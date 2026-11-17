<script setup lang="ts">
withDefaults(defineProps<{ section?: string; image?: string; closing?: boolean }>(), { section: 'Архитектурная ката', image: '/visuals/search-map.svg', closing: false })
</script>
<template>
  <div class="slidev-layout ff-slide ff-hero" :class="{'ff-closing': closing}">
    <div class="hero-content"><div class="eyebrow">{{ section }}</div><slot /></div>
    <div v-if="!closing" class="hero-visual"><img :src="image" alt="Схема территории поиска" /></div>
    <FfFooter :section="section" />
  </div>
</template>
