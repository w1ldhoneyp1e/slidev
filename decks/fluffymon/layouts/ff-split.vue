<script setup lang="ts">
withDefaults(defineProps<{ section?: string }>(), { section: 'Контекст' })
</script>
<template>
  <div class="slidev-layout ff-slide ff-split">
    <div class="side"><div class="eyebrow">{{ section }}</div><slot/></div>
    <div class="side" style="padding-top:28px"><slot name="right"/></div>
    <FfFooter :section="section"/>
  </div>
</template>
