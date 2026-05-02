<template>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-40 safe-bottom">
    <div class="flex items-center">
      <button
        v-for="item in navItems"
        :key="item.name"
        @click="router.push(item.to)"
        class="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors"
        :class="isActive(item.to) ? 'text-brand' : 'text-gray-400'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-[10px] font-medium leading-tight">{{ t(item.label) }}</span>
        <span v-if="isActive(item.to)" class="absolute bottom-0 w-1 h-1 rounded-full bg-brand" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
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

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
