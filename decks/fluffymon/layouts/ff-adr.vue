<script setup lang="ts">
withDefaults(defineProps<{ section?: string }>(), { section: 'Architecture Decision Record' })
</script>
<template>
  <div class="slidev-layout ff-slide"><div class="eyebrow">{{ section }}</div><slot/><FfFooter section="Архитектурные решения"/></div>
</template>
