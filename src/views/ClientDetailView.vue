<template>
  <div v-if="client">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 px-4 pt-4 pb-4 flex items-center gap-3">
      <button @click="router.back()" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="w-11 h-11 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
        <span class="text-brand font-bold text-lg">{{ client.name.charAt(0).toUpperCase() }}</span>
      </div>
      <div>
        <p class="font-bold text-gray-900">{{ client.name }}</p>
        <p class="text-sm text-gray-500">{{ client.phone }}</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-3 px-4 pt-4 pb-3">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
        <p class="text-2xl font-bold text-brand">{{ bookings.length }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ t('clients.bookingHistory') }}</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
        <p class="text-lg font-bold text-gray-900">{{ formatMoney(totalSpent) }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ t('clients.totalSpent') }}</p>
      </div>
    </div>

    <!-- Booking history -->
    <div class="px-4 pb-4">
      <h2 class="font-bold text-gray-900 mb-3">{{ t('clients.bookingHistory') }}</h2>
      <div v-if="bookings.length === 0" class="text-center py-10 text-gray-400 text-sm">{{ t('clients.noBookings') }}</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="b in bookings"
          :key="b.id"
          class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="font-semibold text-sm text-gray-900">{{ b.date }} · {{ b.startTime }}–{{ b.endTime }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ fieldName(b.fieldId) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">{{ formatMoney(b.price) }}</p>
              <span
                class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                :class="b.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'"
              >
                {{ b.paymentStatus === 'paid' ? t('booking.paid') : t('booking.unpaid') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-32 text-gray-400">Client not found</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useClientsStore } from '../stores/clients'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const client = computed(() => clientsStore.findById(route.params.id as string))
const bookings = computed(() => client.value ? bookingsStore.getForClient(client.value.id) : [])
const totalSpent = computed(() => bookings.value.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.price, 0))

function fieldName(fieldId: string) {
  const stadium = stadiumsStore.stadiums.find(s => s.fields.some(f => f.id === fieldId))
  return stadium?.fields.find(f => f.id === fieldId)?.name ?? fieldId
}
function formatMoney(n: number) { return n.toLocaleString('uz-UZ') + " so'm" }
</script>
