<template>
  <div class="px-4 pt-5 pb-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('clients.title') }}</h1>
      <span class="text-sm text-gray-400">{{ t('clients.total', { count: filtered.length }) }}</span>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 mb-5 focus-within:border-brand transition-colors">
      <svg class="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input
        v-model="query"
        type="search"
        class="flex-1 outline-none text-sm font-medium text-gray-900 bg-transparent placeholder-gray-400"
        :placeholder="t('common.search')"
      />
    </div>

    <!-- Client list -->
    <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <p class="text-sm">{{ t('clients.noClients') }}</p>
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="client in filtered"
        :key="client.id"
        @click="router.push('/clients/' + client.id)"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
      >
        <div class="w-11 h-11 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
          <span class="text-brand font-bold text-base">{{ client.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 text-sm">{{ client.name }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ client.phone }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-xs font-semibold text-gray-400">{{ bookingCount(client.id) }} ta bron</p>
        </div>
        <svg class="w-4 h-4 text-gray-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useClientsStore } from '../stores/clients'
import { useBookingsStore } from '../stores/bookings'

const { t } = useI18n()
const router = useRouter()
const clientsStore = useClientsStore()
const bookingsStore = useBookingsStore()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return clientsStore.clients
  return clientsStore.clients.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(q)
  )
})

function bookingCount(clientId: string) {
  return bookingsStore.getForClient(clientId).length
}
</script>
