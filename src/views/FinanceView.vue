<template>
  <div class="px-4 pt-5 pb-4">
    <!-- Header -->
    <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ t('finance.title') }}</h1>

    <!-- Period tabs -->
    <div class="flex bg-gray-100 rounded-2xl p-1 mb-5">
      <button
        v-for="p in periods"
        :key="p.key"
        @click="activePeriod = p.key"
        class="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
        :class="activePeriod === p.key ? 'bg-white text-brand shadow-sm' : 'text-gray-500'"
      >
        {{ t('finance.' + p.key) }}
      </button>
    </div>

    <!-- Revenue cards -->
    <div class="grid grid-cols-1 gap-3 mb-5">
      <div class="bg-brand rounded-2xl p-5 shadow-lg shadow-brand/20">
        <p class="text-green-100 text-xs font-semibold uppercase tracking-wide mb-1">{{ t('finance.revenue') }}</p>
        <p class="text-3xl font-bold text-white">{{ formatMoney(stats.total) }} <span class="text-base font-normal text-green-100">so'm</span></p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-2 h-2 rounded-full bg-green-500" />
            <p class="text-xs text-gray-500 font-semibold">{{ t('finance.cash') }}</p>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ formatMoney(stats.cash) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-2 h-2 rounded-full bg-blue-500" />
            <p class="text-xs text-gray-500 font-semibold">{{ t('finance.card') }}</p>
          </div>
          <p class="text-lg font-bold text-gray-900">{{ formatMoney(stats.card) }}</p>
        </div>
      </div>
    </div>

    <!-- Unpaid section -->
    <div>
      <div class="flex items-center gap-2 mb-3">
        <div class="w-2 h-2 rounded-full bg-orange-500" />
        <h2 class="font-bold text-gray-900 text-base">{{ t('finance.unpaidList') }}</h2>
        <span class="text-xs text-orange-500 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">{{ unpaid.length }}</span>
      </div>

      <div v-if="unpaid.length === 0" class="text-center py-10 text-gray-400 text-sm">{{ t('finance.noUnpaid') }}</div>

      <div class="flex flex-col gap-2">
        <div
          v-for="b in unpaid"
          :key="b.id"
          class="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex items-center gap-3"
        >
          <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-gray-900">{{ b.clientName }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ b.date }} · {{ b.startTime }}–{{ b.endTime }}</p>
          </div>
          <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
            <p class="text-sm font-bold text-gray-900">{{ formatMoney(b.price) }}</p>
            <div class="flex gap-1">
              <button
                @click="pay(b.id, 'cash')"
                class="text-[10px] font-bold px-2 py-1 bg-brand-light text-brand rounded-lg"
              >{{ t('booking.cash') }}</button>
              <button
                @click="pay(b.id, 'card')"
                class="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg"
              >{{ t('booking.card') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import dayjs from 'dayjs'

const { t } = useI18n()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const periods = [
  { key: 'today' },
  { key: 'week' },
  { key: 'month' },
]
const activePeriod = ref('today')

const stadiumId = computed(() => stadiumsStore.activeStadiumId)

const dateRange = computed(() => {
  const today = dayjs()
  if (activePeriod.value === 'today') {
    const d = today.format('YYYY-MM-DD')
    return { start: d, end: d }
  }
  if (activePeriod.value === 'week') {
    return { start: today.startOf('week').format('YYYY-MM-DD'), end: today.endOf('week').format('YYYY-MM-DD') }
  }
  return { start: today.startOf('month').format('YYYY-MM-DD'), end: today.endOf('month').format('YYYY-MM-DD') }
})

const stats = computed(() =>
  bookingsStore.revenueByPeriod(stadiumId.value, dateRange.value.start, dateRange.value.end)
)

const unpaid = computed(() =>
  bookingsStore.unpaidBookings.filter(b => b.stadiumId === stadiumId.value)
)

function pay(id: string, method: 'cash' | 'card') {
  bookingsStore.markPaid(id, method)
}
function formatMoney(n: number) { return n.toLocaleString('uz-UZ') }
</script>
