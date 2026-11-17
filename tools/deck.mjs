import { spawn, spawnSync } from "node:child_process";
import { accessSync, cpSync, mkdirSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { setTimeout as wait } from "node:timers/promises";

const [action, slug = "qualitative-research", ...options] =
  process.argv.slice(2);
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  throw new Error("Используй имя вроде my-first-deck.");

const deck = "decks/" + slug;
const entry = deck + "/slides.md";
const executablePath = process.env.SLIDEV_CHROMIUM_PATH;

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function freePort() {
  return new Promise((resolvePort, reject) => {
    const socket = createServer();
    socket.once("error", reject);
    socket.listen(0, "localhost", () => {
      const port = socket.address().port;
      socket.close((error) => (error ? reject(error) : resolvePort(port)));
    });
  });
}

async function checkLayout() {
  const { chromium } = await import("playwright-chromium");
  const port = await freePort();
  const url = "http://localhost:" + port;
  const server = spawn("slidev", [entry, "--port", String(port)], {
    stdio: "inherit",
  });
  let startupError;
  let browser;

  server.once("error", (error) => {
    startupError = error;
  });

  try {
    const deadline = Date.now() + 45000;
    while (true) {
      if (startupError) throw startupError;
      if (server.exitCode !== null || server.signalCode)
        throw new Error("Сервер Slidev завершился до проверки.");

      const response = await fetch(url, {
        signal: AbortSignal.timeout(1200),
      }).catch(() => null);

      if (response?.ok) break;
      if (Date.now() >= deadline) throw new Error("Сервер Slidev не ответил.");
      await wait(300);
    }

    browser = await chromium.launch({ executablePath });
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });
    await page.goto(url + "/export?print=true", {
      waitUntil: "networkidle",
      timeout: 45000,
    });

    const slides = page.locator(
      ".print-slide-container [data-slidev-no] .slidev-layout",
    );
    await slides.first().waitFor({ state: "attached" });
    await page.waitForFunction(
      () => !document.querySelector(".slidev-slide-loading"),
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const checks = await slides.evaluateAll((elements) =>
      elements
        .filter((slide) => slide.offsetWidth && slide.offsetHeight)
        .map((slide, index) => {
          const content = slide.querySelector(".lecture-flow");
          const areas = [
            slide,
            ...slide.querySelectorAll(
              ".lecture-flow, .cards, .card, .comparison",
            ),
          ];
          const overflow = areas.some(
            (area) =>
              area.scrollWidth > area.clientWidth + 2 ||
              area.scrollHeight > area.clientHeight + 2,
          );

          const frame = slide.getBoundingClientRect();
          const scale = frame.height / slide.offsetHeight;
          const padding = Number.parseFloat(
            getComputedStyle(slide).paddingBottom,
          );
          const bottom = frame.bottom - padding * scale;
          const outside =
            content && content.getBoundingClientRect().bottom > bottom + 2;

          return {
            name:
              index +
              1 +
              ". " +
              (slide.querySelector("h1")?.textContent.trim() || "Слайд"),
            issue: overflow || Boolean(outside),
          };
        }),
    );

    if (!checks.length) throw new Error("Не найдены отрисованные слайды.");
    const issues = checks.filter((slide) => slide.issue);
    if (issues.length) {
      const titles = issues.map((slide) => slide.name).join("\n");
      throw new Error("Переполнение или выход за нижнее поле:\n" + titles);
    }
    console.log("Проверена вёрстка слайдов: " + checks.length);
  } finally {
    try {
      await browser?.close();
    } finally {
      server.kill();
    }
  }
}

if (action === "new") {
  if (process.argv.length < 4) throw new Error("Укажи имя новой презентации.");
  mkdirSync("decks", { recursive: true });
  mkdirSync(deck);
  try {
    cpSync("template", deck, { recursive: true });
  } catch (error) {
    rmSync(deck, { recursive: true, force: true });
    throw error;
  }
  console.log(entry);
} else {
  accessSync(entry);
  switch (action) {
    case "dev":
      run("slidev", [entry, ...options]);
      break;
    case "format":
      run("prettier", ["--write", deck]);
      break;
    case "check":
      run("prettier", ["--check", deck]);
      run("slidev", ["build", entry, "--out", resolve("dist", slug)]);
      await checkLayout();
      break;
    case "pdf": {
      mkdirSync("dist", { recursive: true });
      const browserArgs = executablePath
        ? ["--executable-path", executablePath]
        : [];
      run("slidev", [
        "export",
        entry,
        "--output",
        resolve("dist", slug + ".pdf"),
        ...browserArgs,
        ...options,
      ]);
      break;
    }
    default:
      throw new Error("Доступны new, dev, format, check, pdf.");
  }
}
