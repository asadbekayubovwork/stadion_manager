<template>
  <div class="flex flex-col min-h-dvh bg-gray-50">
    <main class="flex-1 pb-[72px] overflow-y-auto">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import BottomNav from '../components/layout/BottomNav.vue'
</script>
