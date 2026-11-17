<script setup lang="ts">
withDefaults(defineProps<{ section?: string }>(), { section: 'Архитектура решения' })
</script>
<template>
  <div class="slidev-layout ff-slide"><div class="eyebrow">{{ section }}</div><slot/><FfFooter :section="section"/></div>
</template>
