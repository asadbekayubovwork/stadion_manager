import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking, PaymentMethod } from '../types'
import { nanoid } from '../utils/nanoid'
import dayjs from 'dayjs'

const STORAGE_KEY = 'sm_bookings'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      bookings.value = JSON.parse(saved)
    } else {
      seedDemo()
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value))
  }

  function seedDemo() {
    bookings.value = []
    persist()
  }

  function getForFieldAndDate(fieldId: string, date: string) {
    return bookings.value.filter(
      b => b.fieldId === fieldId && b.date === date && b.status === 'active'
    )
  }

  function getForStadiumAndDate(stadiumId: string, date: string) {
    return bookings.value.filter(
      b => b.stadiumId === stadiumId && b.date === date && b.status === 'active'
    )
  }

  function getForClient(clientId: string) {
    return bookings.value.filter(b => b.clientId === clientId).sort(
      (a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime)
    )
  }

  function hasConflict(fieldId: string, date: string, startTime: string, endTime: string, excludeId?: string) {
    return bookings.value.some(b => {
      if (b.fieldId !== fieldId || b.date !== date || b.status !== 'active') return false
      if (excludeId && b.id === excludeId) return false
      return b.startTime < endTime && b.endTime > startTime
    })
  }

  function addBooking(data: Omit<Booking, 'id' | 'createdAt'>) {
    const booking: Booking = {
      ...data,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    }
    bookings.value.push(booking)
    persist()
    return booking
  }

  function updateBooking(id: string, patch: Partial<Booking>) {
    const idx = bookings.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      bookings.value[idx] = { ...bookings.value[idx], ...patch }
      persist()
    }
  }

  function markPaid(id: string, method: PaymentMethod) {
    updateBooking(id, { paymentStatus: 'paid', paymentMethod: method })
  }

  function cancelBooking(id: string) {
    updateBooking(id, { status: 'cancelled' })
  }

  const unpaidBookings = computed(() =>
    bookings.value.filter(b => b.paymentStatus === 'unpaid' && b.status === 'active')
      .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
  )

  function todayRevenue(stadiumId: string) {
    const today = dayjs().format('YYYY-MM-DD')
    return bookings.value
      .filter(b => b.stadiumId === stadiumId && b.date === today && b.paymentStatus === 'paid' && b.status === 'active')
      .reduce((sum, b) => sum + b.price, 0)
  }

  function revenueByPeriod(stadiumId: string, start: string, end: string) {
    const paid = bookings.value.filter(
      b => b.stadiumId === stadiumId && b.date >= start && b.date <= end
        && b.paymentStatus === 'paid' && b.status === 'active'
    )
    return {
      total: paid.reduce((s, b) => s + b.price, 0),
      cash: paid.filter(b => b.paymentMethod === 'cash').reduce((s, b) => s + b.price, 0),
      card: paid.filter(b => b.paymentMethod === 'card').reduce((s, b) => s + b.price, 0),
    }
  }

  function seedDemoWithFields(fieldId1: string, stadiumId: string, fieldId2: string) {
    const today = dayjs().format('YYYY-MM-DD')
    if (bookings.value.length > 0) return
    const demos: Omit<Booking, 'id' | 'createdAt'>[] = [
      {
        fieldId: fieldId1, stadiumId, clientId: 'c1', clientName: 'Jahongir Olimov',
        clientPhone: '+998901234567', date: today, startTime: '18:00', endTime: '19:30',
        durationMin: 90, price: 375000, paymentStatus: 'paid', paymentMethod: 'cash', status: 'active',
      },
      {
        fieldId: fieldId1, stadiumId, clientId: 'c2', clientName: 'Laziz To\'rayev',
        clientPhone: '+998902345678', date: today, startTime: '20:00', endTime: '21:00',
        durationMin: 60, price: 250000, paymentStatus: 'unpaid', status: 'active',
      },
      {
        fieldId: fieldId2, stadiumId, clientId: 'c3', clientName: 'Doniyor Hasanov',
        clientPhone: '+998903456789', date: today, startTime: '16:00', endTime: '17:30',
        durationMin: 90, price: 300000, paymentStatus: 'unpaid', status: 'active',
      },
    ]
    demos.forEach(d => addBooking(d))
  }

  return {
    bookings, unpaidBookings,
    init, getForFieldAndDate, getForStadiumAndDate, getForClient,
    hasConflict, addBooking, updateBooking, markPaid, cancelBooking,
    todayRevenue, revenueByPeriod, seedDemoWithFields,
  }
})
