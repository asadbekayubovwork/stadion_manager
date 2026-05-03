<template>
  <div class="flex flex-col min-h-dvh bg-gray-50">
    <main class="flex-1 overflow-y-auto" :style="{ paddingBottom: bottomPad, paddingTop: topPad }">
      <RouterView v-slot="{ Component }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BottomNav from '../components/layout/BottomNav.vue'

const tg = (window as any).Telegram?.WebApp
const router = useRouter()
const route = useRoute()

const topPad = computed(() => {
  const tgTop = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0
  return tgTop > 0 ? tgTop + 'px' : 'var(--tg-safe-top, 0px)'
})

const bottomPad = computed(() => {
  const tgBottom = tg?.safeAreaInset?.bottom ?? 0
  return `calc(116px + ${tgBottom}px + var(--tg-safe-bottom, 0px))`
})

const TAB_PATHS = ['/', '/schedule', '/clients', '/finance', '/settings']
const transitionName = ref('fade')

const removeGuard = router.beforeEach((to, from) => {
  const toIdx = TAB_PATHS.indexOf(to.path)
  const fromIdx = TAB_PATHS.indexOf(from.path)
  if (toIdx === -1) {
    transitionName.value = 'slide-push'
  } else if (fromIdx === -1) {
    transitionName.value = 'slide-pop'
  } else {
    transitionName.value = toIdx > fromIdx ? 'slide-left' : 'slide-right'
  }
})

onUnmounted(removeGuard)
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from { opacity: 0; transform: translateX(24px); }
.slide-left-leave-to  { opacity: 0; transform: translateX(-24px); }

.slide-right-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-right-leave-to  { opacity: 0; transform: translateX(24px); }

.slide-push-enter-active,
.slide-push-leave-active,
.slide-pop-enter-active,
.slide-pop-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-push-enter-from { opacity: 0; transform: translateX(48px); }
.slide-push-leave-to  { opacity: 0; transform: translateX(-24px); }

.slide-pop-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-pop-leave-to  { opacity: 0; transform: translateX(48px); }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
