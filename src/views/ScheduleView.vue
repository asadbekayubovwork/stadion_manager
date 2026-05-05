<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div style="background:#ffffff; border-bottom:1px solid #e2e8f0;">
      <!-- Title row -->
      <div style="padding:12px 16px 8px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:18px; font-weight:900; color:#0f172a;">{{ monthLabel }}</div>
          <div style="font-size:12px; color:#475569; font-weight:500;">Jadval ko'rinishi</div>
        </div>
        <button
          @click="openNewBooking()"
          style="height:36px; border-radius:10px; background:#16a34a; padding:0 14px;
                 display:flex; align-items:center; justify-content:center; gap:6px;
                 border:none; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3);"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span style="font-size:13px; font-weight:800; color:#ffffff;">Bron</span>
        </button>
      </div>

      <!-- Week strip -->
      <div style="display:flex; padding:0 8px 8px; gap:2px;">
        <div
          v-for="d in weekStrip"
          :key="d.value"
          @click="selectDate(d.value)"
          style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
                 padding-top:4px; cursor:pointer;"
        >
          <span style="font-size:11px; color:#94a3b8; font-weight:600;">{{ d.weekday }}</span>
          <div
            :style="d.value === selectedDate
              ? 'width:32px; height:32px; border-radius:10px; background:#16a34a; display:flex; align-items:center; justify-content:center;'
              : 'width:32px; height:32px; border-radius:10px; background:transparent; display:flex; align-items:center; justify-content:center;'"
          >
            <span
              :style="d.value === selectedDate
                ? 'font-size:14px; font-weight:800; color:#ffffff;'
                : d.faded
                  ? 'font-size:14px; font-weight:800; color:#94a3b8;'
                  : 'font-size:14px; font-weight:800; color:#0f172a;'"
            >{{ d.day }}</span>
          </div>
        </div>
      </div>

      <!-- Field tabs -->
      <div v-if="fields.length > 0" style="display:flex; gap:8px; padding:0 16px 12px;">
        <div
          v-for="f in fields"
          :key="f.id"
          @click="selectField(f.id)"
          :style="f.id === selectedFieldId
            ? 'flex:1; height:36px; border-radius:10px; background:#16a34a; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; font-weight:700; color:#ffffff;'
            : 'flex:1; height:36px; border-radius:10px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; font-weight:700; color:#475569;'"
        >
          {{ f.name }}
        </div>
      </div>
    </div>

    <!-- ── TIMELINE ── -->
    <div ref="timelineEl" style="flex:1; padding:0 12px 12px; overflow-y:auto;">
      <div style="position:relative;" :style="{ height: timelineHeight + 'px' }">

        <!-- Hour rows -->
        <div
          v-for="hour in hours"
          :key="hour"
          style="position:absolute; left:0; right:0; display:flex; gap:10px;"
          :style="{ top: hourToY(hour) + 'px' }"
        >
          <div style="width:44px; padding-top:4px; flex-shrink:0; display:flex; justify-content:flex-end;">
            <span
              :style="isCurrentHour(hour)
                ? 'font-size:12px; font-weight:700; color:#16a34a;'
                : 'font-size:12px; font-weight:700; color:#94a3b8;'"
            >{{ String(hour).padStart(2, '0') }}:00</span>
          </div>
        </div>

        <!-- Now indicator line -->
        <div
          v-if="isToday && nowY >= 0"
          style="position:absolute; left:54px; right:0; pointer-events:none; z-index:2;"
          :style="{ top: nowY + 'px' }"
        >
          <div style="height:2px; background:#16a34a; border-radius:2px;">
            <div style="width:10px; height:10px; border-radius:9999px; background:#16a34a;
                        position:absolute; left:-5px; top:-4px;" />
          </div>
        </div>

        <!-- Empty slot cards -->
        <div
          v-for="slot in emptySlots"
          :key="'empty-' + slot.startTime"
          @click="openNewBooking(slot.startTime)"
          style="position:absolute; left:54px; right:0; padding:6px 0; cursor:pointer;"
          :style="{ top: slotY(slot.startTime) + 'px', height: slot.heightPx + 'px' }"
        >
          <div
            style="height:100%; min-height:36px; border-radius:12px;
                   border:1.5px dashed #e2e8f0; display:flex; align-items:center;
                   justify-content:center; gap:6px; transition:all 0.15s;"
            class="hover-empty"
          >
            <div
              style="width:22px; height:22px; border-radius:6px; background:#dcfce7;
                     display:flex; align-items:center; justify-content:center;"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
                   stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span style="font-size:12px; color:#94a3b8; font-weight:600;">Bo'sh joy</span>
          </div>
        </div>

        <!-- Booking cards -->
        <div
          v-for="b in dayBookings"
          :key="b.id"
          @click="openBookingDetail(b)"
          style="position:absolute; left:54px; right:0; padding:6px 0; cursor:pointer;"
          :style="{ top: slotY(b.startTime) + 'px', height: bookingHeight(b) + 'px' }"
        >
          <div
            :style="`height:100%; border-radius:12px;
                     background:linear-gradient(135deg, #fed7aa 0%, ${b.paymentStatus === 'paid' ? 'rgba(249,115,22,0.13)' : 'rgba(249,115,22,0.20)'} 100%);
                     border:1.5px solid rgba(249,115,22,0.4); padding:8px 12px;
                     display:flex; flex-direction:column; justify-content:center; gap:2px;`"
          >
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="font-size:13px; font-weight:800; color:#9a3412; min-width:0;
                          overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                {{ b.clientName }}
              </div>
              <div
                :style="b.paymentStatus === 'paid'
                  ? 'width:20px; height:20px; border-radius:6px; background:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-left:6px;'
                  : 'width:20px; height:20px; border-radius:6px; background:#f97316; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-left:6px;'"
              >
                <svg v-if="b.paymentStatus === 'paid'" width="12" height="12" viewBox="0 0 24 24"
                     fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"
                     stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
            <div style="font-size:11px; color:#9a3412; font-weight:600; font-family:'Inter', sans-serif;">
              {{ b.startTime }}–{{ b.endTime }}<span v-if="bookingHeight(b) >= 56"> · {{ formatMoney(b.price) }} so'm</span>
            </div>
            <div v-if="bookingHeight(b) >= 64"
                 style="font-size:11px; color:#9a3412; opacity:0.7; font-weight:500;">
              {{ b.clientPhone }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModal
      :show="showModal"
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
import { useRouter } from 'vue-router'
import { useStadiumsStore } from '../stores/stadiums'
import { useBookingsStore } from '../stores/bookings'
import type { Booking } from '../types'
import dayjs from 'dayjs'
import BookingModal from '../components/booking/BookingModal.vue'

const router = useRouter()
const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()

const PX_PER_MIN = 1.2
const HOUR_HEIGHT = PX_PER_MIN * 60

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedFieldId = ref(stadiumsStore.activeFieldId)
const timelineEl = ref<HTMLElement>()
const showModal = ref(false)
const editingBooking = ref<Booking | null>(null)
const defaultTime = ref('')

const isToday = computed(() => selectedDate.value === dayjs().format('YYYY-MM-DD'))

const workStart = computed(() => stadiumsStore.activeStadium?.workStart ?? 6)
const workEnd = computed(() => stadiumsStore.activeStadium?.workEnd ?? 24)
const hours = computed(() => {
  const h: number[] = []
  for (let i = workStart.value; i < workEnd.value; i++) h.push(i)
  return h
})
const timelineHeight = computed(() => (workEnd.value - workStart.value) * HOUR_HEIGHT + 24)

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

const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
const monthLabel = computed(() => {
  const d = dayjs(selectedDate.value)
  return `${MONTHS_UZ[d.month()]} ${d.year()}`
})

const WEEKDAYS_UZ_SHORT = ['Ya', 'D', 'S', 'Ch', 'P', 'J', 'Sh']

const weekStrip = computed(() => {
  const today = dayjs()
  const ref = dayjs(selectedDate.value)
  const start = ref.subtract(ref.day(), 'day')
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.add(i, 'day')
    return {
      value: d.format('YYYY-MM-DD'),
      day: d.date(),
      weekday: WEEKDAYS_UZ_SHORT[d.day()],
      faded: d.isBefore(today, 'day'),
    }
  })
})

function isCurrentHour(hour: number) {
  return isToday.value && dayjs().hour() === hour
}

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
function formatMoney(n: number) { return n.toLocaleString('uz-UZ').replace(/,/g, ' ') }

function openNewBooking(time?: string) {
  editingBooking.value = null
  defaultTime.value = time ?? ''
  showModal.value = true
}
function openBookingDetail(b: Booking) {
  router.push({ name: 'booking-detail', params: { id: b.id } })
}
function onSaved() { showModal.value = false }

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
.hover-empty:hover {
  border-color: rgba(22, 163, 74, 0.4) !important;
  background: rgba(22, 163, 74, 0.04);
}
</style>
