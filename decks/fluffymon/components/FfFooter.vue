<script setup lang="ts">
withDefaults(defineProps<{ section?: string }>(), { section: 'Архитектура ПО' })
</script>
<template>
  <div class="ff-footer"><span>Where’s Fluffymon?</span><span class="footer-section">{{ section }}</span><span class="page-no">{{ String($page).padStart(2, '0') }}</span></div>
</template>
