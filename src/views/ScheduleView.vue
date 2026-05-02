<template>
  <div class="flex flex-col h-[calc(100dvh-72px)]">
    <!-- Header -->
    <div class="bg-white px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center">
            <svg class="w-5 h-5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <div class="font-bold text-gray-900 text-base leading-tight">{{ t('schedule.title') }}</div>
            <div class="text-xs text-gray-500">{{ formatDateFull(selectedDate) }}</div>
          </div>
        </div>
        <button class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>

      <!-- Date strip -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          v-for="d in dateStrip"
          :key="d.value"
          @click="selectDate(d.value)"
          class="flex-shrink-0 flex flex-col items-center w-12 py-2 rounded-xl transition-all"
          :class="d.value === selectedDate ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
        >
          <span class="text-[10px] font-medium uppercase">{{ d.weekday }}</span>
          <span class="text-lg font-bold leading-tight">{{ d.day }}</span>
        </button>
      </div>

      <!-- Field filter -->
      <div v-if="fields.length > 0" class="flex gap-2 overflow-x-auto py-2 scrollbar-none -mx-1 px-1">
        <button
          v-for="f in fields"
          :key="f.id"
          @click="selectField(f.id)"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          :class="f.id === selectedFieldId
            ? 'bg-brand-light text-brand border border-brand/30'
            : 'bg-gray-100 text-gray-500'"
        >
          {{ f.name }}
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div ref="timelineEl" class="flex-1 overflow-y-auto relative" @scroll="onScroll">
      <div class="relative" :style="{ height: timelineHeight + 'px' }">

        <!-- Hour lines -->
        <div
          v-for="hour in hours"
          :key="hour"
          class="absolute left-0 right-0 flex items-start"
          :style="{ top: hourToY(hour) + 'px' }"
        >
          <span class="w-14 text-xs text-gray-400 font-medium text-right pr-3 leading-none -translate-y-2">
            {{ String(hour).padStart(2, '0') }}:00
          </span>
          <div class="flex-1 border-t border-gray-100" />
        </div>

        <!-- Now indicator -->
        <div
          v-if="isToday && nowY >= 0"
          class="absolute left-0 right-0 flex items-center pointer-events-none z-10"
          :style="{ top: nowY + 'px' }"
        >
          <span class="w-14 flex justify-end pr-2">
            <span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          </span>
          <div class="flex-1 h-px bg-red-400" />
        </div>

        <!-- Empty slot overlays -->
        <template v-for="slot in emptySlots" :key="'empty-' + slot.startTime">
          <div
            @click="openNewBooking(slot.startTime)"
            class="absolute left-14 right-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-between px-4 cursor-pointer hover:border-brand/40 hover:bg-brand-light/30 transition-colors group"
            :style="{ top: slotY(slot.startTime) + 2 + 'px', height: slot.heightPx - 4 + 'px' }"
          >
            <span class="text-sm font-medium text-gray-400 group-hover:text-brand">{{ t('schedule.empty') }}</span>
            <span class="w-7 h-7 rounded-full border-2 border-gray-300 group-hover:border-brand group-hover:text-brand flex items-center justify-center text-gray-400 font-bold text-lg leading-none">+</span>
          </div>
        </template>

        <!-- Booking cards -->
        <div
          v-for="b in dayBookings"
          :key="b.id"
          @click="openBookingMenu(b)"
          @contextmenu.prevent="openBookingMenu(b)"
          class="absolute left-14 right-2 rounded-xl px-4 py-3 cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
          :class="b.paymentStatus === 'unpaid' ? 'bg-booked' : 'bg-booked'"
          :style="{ top: slotY(b.startTime) + 2 + 'px', height: bookingHeight(b) - 4 + 'px' }"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-[10px] font-bold text-orange-100 uppercase tracking-wide mb-0.5">{{ t('schedule.booked') }}</div>
              <div class="text-white font-bold text-sm truncate">{{ b.clientName }}</div>
              <div class="text-orange-100 text-xs mt-0.5">{{ b.startTime }} — {{ b.endTime }}</div>
            </div>
            <div class="flex-shrink-0 text-right">
              <div v-if="b.paymentStatus === 'paid'" class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div v-else class="text-[10px] font-bold text-orange-100 bg-white/10 px-2 py-0.5 rounded-full">{{ t('schedule.debt') }}</div>
            </div>
          </div>
          <div v-if="bookingHeight(b) >= 60" class="mt-1 text-xs text-orange-100 font-semibold">
            {{ formatMoney(b.price) }} UZS
          </div>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button
      @click="openNewBooking()"
      class="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-brand shadow-xl shadow-brand/40 flex items-center justify-center z-30 active:scale-95 transition-transform"
    >
      <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>

    <!-- Booking context menu -->
    <Transition name="fade">
      <div v-if="menuBooking" class="fixed inset-0 z-50 flex items-end" @click.self="menuBooking = null">
        <div class="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl shadow-2xl p-5 pb-8">
          <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
          <div class="mb-4">
            <p class="font-bold text-gray-900 text-base">{{ menuBooking.clientName }}</p>
            <p class="text-sm text-gray-500">{{ menuBooking.startTime }} — {{ menuBooking.endTime }} · {{ fieldName(menuBooking.fieldId) }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button
              v-if="menuBooking.paymentStatus === 'unpaid'"
              @click="markPaid('cash')"
              class="flex items-center gap-3 py-3.5 px-4 rounded-2xl bg-brand-light text-brand font-semibold text-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              {{ t('booking.markPaid') }} ({{ t('booking.cash') }})
            </button>
            <button
              v-if="menuBooking.paymentStatus === 'unpaid'"
              @click="markPaid('card')"
              class="flex items-center gap-3 py-3.5 px-4 rounded-2xl bg-brand-light text-brand font-semibold text-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              {{ t('booking.markPaid') }} ({{ t('booking.card') }})
            </button>
            <button
              @click="editBooking()"
              class="flex items-center gap-3 py-3.5 px-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {{ t('common.edit') }}
            </button>
            <button
              @click="duplicateBooking()"
              class="flex items-center gap-3 py-3.5 px-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {{ t('booking.duplicate') }}
            </button>
            <button
              @click="cancelB()"
              class="flex items-center gap-3 py-3.5 px-4 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ t('booking.cancelBooking') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Booking Modal -->
    <BookingModal
      v-if="showModal"
      :booking="editingBooking"
      :default-date="selectedDate"
      :default-time="defaultTime"
      :field-id="selectedFieldId"
      @close="showModal = false"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStadiumsStore } from '../stores/stadiums'
import { useBookingsStore } from '../stores/bookings'
import type { Booking } from '../types'
import dayjs from 'dayjs'
import BookingModal from '../components/booking/BookingModal.vue'

const { t } = useI18n()
const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()

const PX_PER_MIN = 1.2 // pixels per minute
const HOUR_HEIGHT = PX_PER_MIN * 60

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedFieldId = ref(stadiumsStore.activeFieldId)
const timelineEl = ref<HTMLElement>()
const menuBooking = ref<Booking | null>(null)
const showModal = ref(false)
const editingBooking = ref<Booking | null>(null)
const defaultTime = ref('')

const isToday = computed(() => selectedDate.value === dayjs().format('YYYY-MM-DD'))

const workStart = computed(() => stadiumsStore.activeStadium?.workStart ?? 6)
const workEnd = computed(() => stadiumsStore.activeStadium?.workEnd ?? 24)
const hours = computed(() => {
  const h = []
  for (let i = workStart.value; i <= workEnd.value; i++) h.push(i)
  return h
})
const timelineHeight = computed(() => (workEnd.value - workStart.value) * HOUR_HEIGHT + 40)

const fields = computed(() => stadiumsStore.activeStadium?.fields ?? [])

const dayBookings = computed(() =>
  bookingsStore.getForFieldAndDate(selectedFieldId.value, selectedDate.value)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
)

const nowY = computed(() => {
  if (!isToday.value) return -1
  const now = dayjs()
  const mins = (now.hour() - workStart.value) * 60 + now.minute()
  return mins * PX_PER_MIN
})

const dateStrip = computed(() => {
  const base = dayjs().subtract(1, 'day')
  const days = []
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  for (let i = 0; i < 14; i++) {
    const d = base.add(i, 'day')
    days.push({ value: d.format('YYYY-MM-DD'), day: d.date(), weekday: weekdays[d.day()] })
  }
  return days
})

// Slot geometry helpers
function hourToY(hour: number) {
  return (hour - workStart.value) * HOUR_HEIGHT
}
function timeToY(time: string) {
  const [h, m] = time.split(':').map(Number)
  return ((h - workStart.value) * 60 + m) * PX_PER_MIN
}
function slotY(time: string) { return timeToY(time) }
function bookingHeight(b: Booking) {
  return b.durationMin * PX_PER_MIN
}

// Empty slots between bookings
const emptySlots = computed(() => {
  const slots: { startTime: string; endTime: string; heightPx: number }[] = []
  const booked = [...dayBookings.value].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const ws = `${String(workStart.value).padStart(2, '0')}:00`
  const we = `${String(workEnd.value).padStart(2, '0')}:00`

  let cursor = ws
  for (const b of booked) {
    if (cursor < b.startTime) {
      const [ch, cm] = cursor.split(':').map(Number)
      const [bh, bm] = b.startTime.split(':').map(Number)
      const mins = (bh - ch) * 60 + (bm - cm)
      if (mins >= 30) {
        slots.push({ startTime: cursor, endTime: b.startTime, heightPx: mins * PX_PER_MIN })
      }
    }
    cursor = b.endTime
  }
  if (cursor < we) {
    const [ch, cm] = cursor.split(':').map(Number)
    const [eh, em] = we.split(':').map(Number)
    const mins = (eh - ch) * 60 + (em - cm)
    if (mins >= 30) {
      slots.push({ startTime: cursor, endTime: we, heightPx: mins * PX_PER_MIN })
    }
  }
  return slots
})

function selectDate(d: string) { selectedDate.value = d }
function selectField(id: string) {
  selectedFieldId.value = id
  stadiumsStore.setActiveField(id)
}
function fieldName(fieldId: string) {
  return fields.value.find(f => f.id === fieldId)?.name ?? fieldId
}
function formatMoney(n: number) { return n.toLocaleString('uz-UZ') }
function formatDateFull(d: string) {
  return dayjs(d).format('D MMMM YYYY')
}

function openNewBooking(time?: string) {
  editingBooking.value = null
  defaultTime.value = time ?? ''
  showModal.value = true
}
function openBookingMenu(b: Booking) { menuBooking.value = b }
function editBooking() {
  editingBooking.value = menuBooking.value
  menuBooking.value = null
  showModal.value = true
}
function duplicateBooking() {
  if (!menuBooking.value) return
  const b = menuBooking.value
  editingBooking.value = null
  defaultTime.value = b.startTime
  menuBooking.value = null
  showModal.value = true
}
function markPaid(method: 'cash' | 'card') {
  if (!menuBooking.value) return
  bookingsStore.markPaid(menuBooking.value.id, method)
  menuBooking.value = null
}
function cancelB() {
  if (!menuBooking.value) return
  if (confirm(t('booking.confirmCancel'))) {
    bookingsStore.cancelBooking(menuBooking.value.id)
    menuBooking.value = null
  }
}
function onSaved() { showModal.value = false }
function onScroll() {}

// Scroll to work start or now on mount
onMounted(async () => {
  await nextTick()
  if (timelineEl.value) {
    const scrollY = isToday.value && nowY.value > 0
      ? Math.max(0, nowY.value - 100)
      : hourToY(Math.max(workStart.value, 8))
    timelineEl.value.scrollTop = scrollY
  }
})

watch(() => stadiumsStore.activeFieldId, id => { selectedFieldId.value = id })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scrollbar-none { scrollbar-width: none; }
.scrollbar-none::-webkit-scrollbar { display: none; }
</style>
