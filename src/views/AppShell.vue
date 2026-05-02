<template>
  <div class="flex flex-col min-h-dvh bg-gray-50">
    <main class="flex-1 overflow-y-auto" :style="{ paddingBottom: bottomPad, paddingTop: topPad }">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BottomNav from '../components/layout/BottomNav.vue'

const tg = (window as any).Telegram?.WebApp

// top: Telegram header height + extra breathing room
const topPad = computed(() => {
  const tgTop = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0
  return tgTop > 0 ? tgTop + 'px' : 'var(--tg-safe-top, 0px)'
})

// bottom: BottomNav height (64px) + Telegram bottom safe area
const bottomPad = computed(() => {
  const tgBottom = tg?.safeAreaInset?.bottom ?? 0
  return `calc(68px + ${tgBottom}px + var(--tg-safe-bottom, 0px))`
})
</script>
