<template>
  <nav
    class="fixed z-40"
    :style="{
      bottom: navBottom,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(calc(100vw - 48px), 432px)',
      backdropFilter: 'blur(12px)',
      background: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(226,232,240,0.5)',
      borderRadius: '40px',
      padding: '17px 25px',
      boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
    }"
  >
    <div class="flex items-center justify-between w-full">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="router.push(item.to)"
        class="flex flex-col items-center cursor-pointer"
        style="gap:4px;background:none;border:none;padding:0;"
      >
        <component :is="item.icon" class="w-6 h-6" :class="isActive(item.to) ? 'text-[#16a34a]' : 'text-[#64748b]'" />
        <span
          :style="isActive(item.to)
            ? 'font-size:10px;font-weight:700;color:#16a34a;line-height:15px;'
            : 'font-size:10px;font-weight:500;color:#64748b;line-height:15px;'"
        >{{ t(item.label) }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HomeIcon from './icons/HomeIcon.vue'
import CalendarIcon from './icons/CalendarIcon.vue'
import PeopleIcon from './icons/PeopleIcon.vue'
import WalletIcon from './icons/WalletIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const navItems = [
  { name: 'home', to: '/', label: 'nav.home', icon: HomeIcon },
  { name: 'schedule', to: '/schedule', label: 'nav.schedule', icon: CalendarIcon },
  { name: 'clients', to: '/clients', label: 'nav.clients', icon: PeopleIcon },
  { name: 'finance', to: '/finance', label: 'nav.finance', icon: WalletIcon },
  { name: 'settings', to: '/settings', label: 'nav.settings', icon: SettingsIcon },
]

const tg = (window as any).Telegram?.WebApp
const navBottom = computed(() => {
  const bottom = tg?.safeAreaInset?.bottom ?? 0
  return bottom > 0 ? `${bottom + 16}px` : 'calc(var(--tg-safe-bottom, env(safe-area-inset-bottom, 0px)) + 24px)'
})

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
