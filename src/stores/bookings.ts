import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking, PaymentMethod } from '../types'
import * as bookingsApi from '../api/bookings'
import { normalizeBooking, buildIso, methodToId, parseScheduleBookings } from '../utils/booking'
import dayjs from 'dayjs'

export const useBookingsStore = defineStore('bookings', () => {
  // All bookings we've loaded, keyed by id. We merge results from list/schedule/detail.
  const byId = ref<Record<number, Booking>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const bookings = computed<Booking[]>(() => Object.values(byId.value))

  function upsert(list: Booking[]) {
    for (const b of list) byId.value[b.id] = b
  }

  function remove(id: number) {
    delete byId.value[id]
  }

  async function loadByDate(date: string, fieldId?: number) {
    loading.value = true
    error.value = null
    try {
      const list = await bookingsApi.getBookings({ date, fieldId })
      const normalized = (Array.isArray(list) ? list : []).map(normalizeBooking)
      upsert(normalized)
      return normalized
    } catch (e: any) {
      error.value = e?.message ?? 'Yuklashda xato'
      return []
    } finally {
      loading.value = false
    }
  }

  async function loadSchedule(date: string) {
    loading.value = true
    error.value = null
    try {
      const resp = await bookingsApi.getSchedule(date)
      const normalized = parseScheduleBookings(resp)
      upsert(normalized)
      return resp
    } catch (e: any) {
      error.value = e?.message ?? 'Yuklashda xato'
      return null
    } finally {
      loading.value = false
    }
  }

  async function loadBooking(id: number) {
    const raw = await bookingsApi.getBooking(id)
    const b = normalizeBooking(raw)
    upsert([b])
    return b
  }

  function getForFieldAndDate(fieldId: number | string, date: string) {
    const fid = Number(fieldId)
    return bookings.value
      .filter(b => b.fieldId === fid && b.date === date && b.status === 'active')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  function getForStadiumAndDate(_stadiumId: any, date: string) {
    return bookings.value
      .filter(b => b.date === date && b.status === 'active')
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  function getForClient(customerId: number) {
    return bookings.value
      .filter(b => b.customerId === customerId)
      .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
  }

  // Client-side conflict hint — server is the source of truth and returns 409.
  function hasConflict(
    fieldId: number | string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: number
  ) {
    const fid = Number(fieldId)
    return bookings.value.some(b => {
      if (b.fieldId !== fid || b.date !== date || b.status !== 'active') return false
      if (excludeId && b.id === excludeId) return false
      return b.startTime < endTime && b.endTime > startTime
    })
  }

  const unpaidBookings = computed(() =>
    bookings.value
      .filter(b => !b.isPaid && b.status === 'active')
      .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
  )

  async function createBooking(input: {
    fieldId: number
    customerId?: number | null
    customerName: string
    customerPhone: string
    date: string
    startTime: string
    endTime: string
    isPaid?: boolean
    paymentMethod?: PaymentMethod
    notes?: string | null
    price?: number
  }) {
    const payload = {
      fieldId: input.fieldId,
      customerId: input.customerId ?? null,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      startTime: buildIso(input.date, input.startTime),
      endTime: buildIso(input.date, input.endTime),
      isPaid: !!input.isPaid,
      paymentMethodId: input.isPaid && input.paymentMethod ? methodToId(input.paymentMethod) : null,
      notes: input.notes ?? null,
    }
    const created = await bookingsApi.createBooking(payload)
    const normalized = normalizeBooking({ ...(created ?? payload), id: (created as any)?.id ?? Date.now() })
    upsert([normalized])
    return normalized
  }

  async function updateBookingFull(id: number, patch: {
    customerId?: number | null
    customerName?: string
    customerPhone?: string
    date?: string
    startTime?: string
    endTime?: string
    notes?: string | null
  }) {
    const existing = byId.value[id]
    const date = patch.date ?? existing?.date
    const payload: any = { id }
    if (patch.customerId !== undefined) payload.customerId = patch.customerId
    if (patch.customerName !== undefined) payload.customerName = patch.customerName
    if (patch.customerPhone !== undefined) payload.customerPhone = patch.customerPhone
    if (patch.startTime && date) payload.startTime = buildIso(date, patch.startTime)
    if (patch.endTime && date) payload.endTime = buildIso(date, patch.endTime)
    if (patch.notes !== undefined) payload.notes = patch.notes

    const updated = await bookingsApi.updateBooking(payload)
    if (updated) {
      const n = normalizeBooking(updated)
      upsert([n])
      return n
    }
    // optimistic fallback
    if (existing) {
      const merged: Booking = {
        ...existing,
        ...(patch.customerName !== undefined ? { customerName: patch.customerName } : {}),
        ...(patch.customerPhone !== undefined ? { customerPhone: patch.customerPhone } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
        date: date ?? existing.date,
        startTime: patch.startTime ?? existing.startTime,
        endTime: patch.endTime ?? existing.endTime,
      }
      byId.value[id] = merged
      return merged
    }
    return null
  }

  async function payBooking(id: number, method: PaymentMethod) {
    const updated = await bookingsApi.payBooking(id, methodToId(method))
    if (updated) {
      const n = normalizeBooking(updated)
      upsert([n])
      return n
    }
    const existing = byId.value[id]
    if (existing) {
      const merged: Booking = {
        ...existing,
        isPaid: true,
        paymentStatus: 'paid',
        paymentMethod: method,
        paymentMethodId: methodToId(method),
      }
      byId.value[id] = merged
      return merged
    }
    return null
  }

  // Legacy compat helpers used by existing views
  async function markPaid(id: number, method: PaymentMethod) {
    return payBooking(id, method)
  }

  async function cancelBooking(id: number) {
    await bookingsApi.deleteBooking(id)
    remove(id)
  }

  async function addBooking(data: {
    fieldId: number
    stadiumId?: any
    clientId?: any
    customerId?: number | null
    clientName?: string
    customerName?: string
    clientPhone?: string
    customerPhone?: string
    date: string
    startTime: string
    endTime: string
    durationMin?: number
    price?: number
    paymentStatus?: 'paid' | 'unpaid'
    paymentMethod?: PaymentMethod
    status?: 'active' | 'cancelled'
    notes?: string | null
  }) {
    return createBooking({
      fieldId: data.fieldId,
      customerId: data.customerId ?? null,
      customerName: data.customerName ?? data.clientName ?? '',
      customerPhone: data.customerPhone ?? data.clientPhone ?? '',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      isPaid: data.paymentStatus === 'paid',
      paymentMethod: data.paymentMethod,
      notes: data.notes ?? null,
    })
  }

  // Local revenue helper used by HomeView / FinanceView when finance API is unavailable.
  function todayRevenue(_stadiumId?: any) {
    const today = dayjs().format('YYYY-MM-DD')
    return bookings.value
      .filter(b => b.date === today && b.isPaid && b.status === 'active')
      .reduce((s, b) => s + b.price, 0)
  }

  function revenueByPeriod(_stadiumId: any, start: string, end: string) {
    const paid = bookings.value.filter(
      b => b.date >= start && b.date <= end && b.isPaid && b.status === 'active'
    )
    return {
      total: paid.reduce((s, b) => s + b.price, 0),
      cash: paid.filter(b => b.paymentMethod === 'cash').reduce((s, b) => s + b.price, 0),
      card: paid.filter(b => b.paymentMethod === 'card').reduce((s, b) => s + b.price, 0),
    }
  }

  function reset() {
    byId.value = {}
  }

  return {
    bookings, unpaidBookings, loading, error,
    loadByDate, loadSchedule, loadBooking,
    getForFieldAndDate, getForStadiumAndDate, getForClient,
    hasConflict, createBooking, addBooking,
    updateBooking: updateBookingFull, payBooking, markPaid, cancelBooking,
    todayRevenue, revenueByPeriod, reset,
  }
})
