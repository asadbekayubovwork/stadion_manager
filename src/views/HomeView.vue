<template>
  <div class="px-4 pt-6 pb-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('home.greeting', { name: auth.user?.name }) }}</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ t('home.greetingSubtitle') }}</p>
      </div>
      <div class="relative">
        <div class="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-lg overflow-hidden">
          {{ auth.user?.name?.charAt(0) || 'S' }}
        </div>
        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </div>
    </div>

    <!-- Revenue card -->
    <div class="rounded-2xl bg-brand p-5 mb-6 shadow-lg shadow-brand/20">
      <div class="flex items-center gap-1.5 text-green-100 text-sm font-medium mb-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        {{ t('home.todayRevenue') }}
      </div>
      <div class="text-3xl font-bold text-white tracking-tight">
        {{ formatMoney(revenue) }} <span class="text-lg font-normal text-green-100">so'm</span>
      </div>
    </div>

    <!-- Upcoming bookings -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-gray-900 text-base">{{ t('home.upcoming') }}</h2>
        <button @click="router.push('/schedule')" class="text-brand text-sm font-semibold">{{ t('home.upcomingAll') }}</button>
      </div>
      <div v-if="upcoming.length === 0" class="text-gray-400 text-sm py-4 text-center">{{ t('home.noUpcoming') }}</div>
      <div class="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div
          v-for="b in upcoming"
          :key="b.id"
          @click="router.push('/schedule')"
          class="flex-shrink-0 w-44 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-transform"
        >
          <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mb-2"
            :class="b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'">
            {{ b.startTime }} - {{ b.endTime }}
          </div>
          <p class="font-bold text-gray-900 text-sm truncate">{{ fieldName(b.fieldId) }}</p>
          <p class="text-gray-500 text-xs mt-0.5 truncate">{{ b.clientName }}</p>
        </div>
      </div>
    </section>

    <!-- Alerts -->
    <section>
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <h2 class="font-bold text-gray-900 text-base">{{ t('home.alerts') }}</h2>
      </div>
      <div v-if="alerts.length === 0" class="text-gray-400 text-sm py-4 text-center">{{ t('home.noAlerts') }}</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border"
          :class="alert.type === 'unpaid' ? 'border-orange-100' : 'border-gray-100'"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="alert.type === 'unpaid' ? 'bg-orange-100' : 'bg-gray-100'">
            <svg v-if="alert.type === 'unpaid'" class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <svg v-else class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-gray-900">{{ alert.title }}</p>
            <p class="text-xs text-gray-500 truncate mt-0.5">{{ alert.subtitle }}</p>
          </div>
          <span v-if="alert.time" class="text-xs font-semibold text-orange-500 flex-shrink-0">{{ alert.time }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import dayjs from 'dayjs'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const today = dayjs().format('YYYY-MM-DD')
const now = dayjs().format('HH:mm')

const stadiumId = computed(() => stadiumsStore.activeStadiumId)

const revenue = computed(() => bookingsStore.todayRevenue(stadiumId.value))

const upcoming = computed(() => {
  if (!stadiumId.value) return []
  return bookingsStore.getForStadiumAndDate(stadiumId.value, today)
    .filter(b => b.endTime > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 5)
})

const alerts = computed(() => {
  const result: { id: string; type: string; title: string; subtitle: string; time?: string }[] = []
  bookingsStore.unpaidBookings
    .filter(b => b.stadiumId === stadiumId.value && b.date === today)
    .slice(0, 3)
    .forEach(b => result.push({
      id: b.id,
      type: 'unpaid',
      title: t('home.unpaidAlert'),
      subtitle: `${b.clientName} (${fieldName(b.fieldId)}) — ${formatMoney(b.price)} so'm`,
      time: b.startTime,
    }))
  return result
})

function fieldName(fieldId: string) {
  const s = stadiumsStore.activeStadium
  return s?.fields.find(f => f.id === fieldId)?.name ?? fieldId
}

function formatMoney(n: number) {
  return n.toLocaleString('uz-UZ')
}
</script>
