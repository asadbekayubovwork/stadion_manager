import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, CustomerDetail } from '../types'
import * as customersApi from '../api/customers'
import { normalizeBooking } from '../utils/booking'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Customer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const detailCache = ref<Record<number, CustomerDetail>>({})

  const sorted = computed(() =>
    [...clients.value].sort((a, b) =>
      (b.totalSpent ?? 0) - (a.totalSpent ?? 0) ||
      a.name.localeCompare(b.name)
    )
  )

  async function load(search?: string) {
    loading.value = true
    error.value = null
    try {
      const list = await customersApi.getCustomers(search)
      clients.value = Array.isArray(list) ? list : []
    } catch (e: any) {
      error.value = e?.message ?? 'Yuklashda xato'
    } finally {
      loading.value = false
    }
  }

  async function loadDetail(id: number) {
    const raw = await customersApi.getCustomer(id)
    const detail: CustomerDetail = {
      ...(raw as any),
      bookings: Array.isArray((raw as any)?.bookings)
        ? (raw as any).bookings.map(normalizeBooking)
        : [],
    }
    detailCache.value[id] = detail
    return detail
  }

  function findById(id: number) {
    return clients.value.find(c => c.id === id) ?? detailCache.value[id] ?? null
  }

  function findByPhone(phone: string) {
    return clients.value.find(c => c.phone === phone) ?? null
  }

  async function createCustomer(payload: { name: string; phone: string }) {
    const created = await customersApi.createCustomer(payload)
    if (created) clients.value.unshift(created)
    return created
  }

  async function updateCustomer(payload: { id: number; name?: string; phone?: string }) {
    const updated = await customersApi.updateCustomer(payload)
    const idx = clients.value.findIndex(c => c.id === payload.id)
    if (idx !== -1 && updated) {
      clients.value[idx] = { ...clients.value[idx], ...updated }
    }
    return updated
  }

  async function deleteCustomer(id: number) {
    await customersApi.deleteCustomer(id)
    clients.value = clients.value.filter(c => c.id !== id)
    delete detailCache.value[id]
  }

  function reset() {
    clients.value = []
    detailCache.value = {}
  }

  return {
    clients, sorted, loading, error,
    load, loadDetail, findById, findByPhone,
    createCustomer, updateCustomer, deleteCustomer, reset,
  }
})
