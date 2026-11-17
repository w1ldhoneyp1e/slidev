# Презентации Slidev

В корне проекта общие зависимости и команды. У каждой презентации своя папка в `decks/` со слайдами, стилями и макетами. Для изображений можно добавить `public/` в папке презентации.

## Запуск

Нужен Node.js 22.12 или новее. Запусти эти команды из корня проекта.

```bash
npm ci
npm run dev -- qualitative-research --open
```

Текст выступления на 15 минут находится в `decks/qualitative-research/doklad.md`. На адресе презентации с окончанием `/presenter` доступны заметки и тайминг к каждому слайду.

## Правки и проверка

| Команда                                  | Действие                                                |
| ---------------------------------------- | ------------------------------------------------------- |
| `npm run new -- my-next-talk`            | Создать папку новой презентации из шаблона              |
| `npm run format -- qualitative-research` | Отформатировать Markdown Slidev, Vue и CSS              |
| `npm run check -- qualitative-research`  | Проверить формат, сборку и выход содержимого за границы |
| `npm run pdf -- qualitative-research`    | Сохранить PDF в `dist/qualitative-research.pdf`         |

Открой корень проекта в VS Code и установи рекомендованные расширения. Панель Slidev поддерживает предпросмотр и перетаскивание слайдов. Чтобы изменить порядок блоков внутри слайда, поменяй местами секции в контейнере `cards`. Сетка сама распределяет ширину и переносит блоки. Для колонок разной ширины задай контейнеру `style="--columns: 2fr 1fr"`.

При первой установке Playwright скачивает Chromium, общий для всех презентаций. Он используется для проверки вёрстки и экспорта PDF.

Можно использовать уже установленный Chrome или Chromium. Если загрузка браузера при установке прерывается, пропусти её и укажи путь к своему браузеру. Пример для Chrome на Ubuntu.

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci
export SLIDEV_CHROMIUM_PATH="$(command -v google-chrome)"
npm run check -- qualitative-research
```

Для системного Chromium используй `command -v chromium`. Переменная `SLIDEV_CHROMIUM_PATH` работает и для экспорта PDF.

## GitHub

Выполни из корня проекта. Последняя команда создаёт закрытый репозиторий и отправляет в него первый коммит. Для неё нужна авторизация в GitHub CLI.

```bash
git init -b main
git add .
git commit -m "Add Slidev workspace and first presentation"
gh repo create slidev-workspace --private --source=. --remote=origin --push
```
