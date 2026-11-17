<script setup lang="ts">
withDefaults(defineProps<{ title: string; number?: string; tag?: string; highlight?: boolean }>(), { highlight: false })
</script>
<template>
  <div class="ff-panel" :class="{ highlight }">
    <div v-if="tag" class="tag">{{ tag }}</div><span v-if="number" class="num">{{ number }}</span>
    <h2>{{ title }}</h2><slot/>
  </div>
</template>
