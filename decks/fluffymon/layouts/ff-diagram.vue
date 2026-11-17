<script setup lang="ts">
withDefaults(defineProps<{ section?: string }>(), { section: '4+1 / Architecture View' })
</script>
<template>
  <div class="slidev-layout ff-slide"><div class="eyebrow">{{ section }}</div><slot/><FfFooter section="Архитектурные представления"/></div>
</template>
