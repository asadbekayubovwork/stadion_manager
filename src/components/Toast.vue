<template>
  <Teleport to="body">
    <div
      class="fixed left-0 right-0 flex flex-col items-center pointer-events-none"
      style="top: 0; z-index: 9999; gap: 8px; padding: 16px;"
      :style="{ paddingTop: topPad }"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          @click="dismiss(t.id)"
          class="pointer-events-auto flex items-center"
          style="max-width: 480px; width: calc(100% - 32px); padding: 14px 16px; border-radius: 14px; gap: 12px; cursor: pointer;"
          :style="styleFor(t.kind)"
        >
          <svg v-if="t.kind === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg v-else-if="t.kind === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span style="font-size:14px; font-weight:500; line-height:20px; flex:1;">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const { toasts, dismiss } = useToast()

const tg = (window as any).Telegram?.WebApp
const topPad = computed(() => {
  const top = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0
  return top > 0 ? `${top + 16}px` : 'calc(var(--tg-safe-top, env(safe-area-inset-top, 0px)) + 16px)'
})

function styleFor(kind: 'error' | 'success' | 'info') {
  switch (kind) {
    case 'error':
      return 'background: #fff1f2; color: #be123c; border: 1px solid rgba(244,63,94,0.25); box-shadow: 0px 8px 24px rgba(244,63,94,0.18), 0px 1px 3px rgba(0,0,0,0.06);'
    case 'success':
      return 'background: #ecfdf5; color: #15803d; border: 1px solid rgba(22,163,74,0.25); box-shadow: 0px 8px 24px rgba(22,163,74,0.18), 0px 1px 3px rgba(0,0,0,0.06);'
    default:
      return 'background: #ffffff; color: #0f172a; border: 1px solid rgba(226,232,240,0.9); box-shadow: 0px 8px 24px rgba(15,23,42,0.12), 0px 1px 3px rgba(0,0,0,0.06);'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.28s ease, opacity 0.2s ease;
}
.toast-enter-from {
  transform: translateY(-16px);
  opacity: 0;
}
.toast-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
