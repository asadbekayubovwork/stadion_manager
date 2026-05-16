<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div style="background:#ffffff; border-bottom:1px solid #e2e8f0;">
      <!-- Title row -->
      <div style="padding:12px 16px 8px; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="font-size:18px; font-weight:900; color:#0f172a;">{{ monthLabel }}</div>
          <div style="font-size:12px; color:#475569; font-weight:500;">{{ t('schedule.scheduleView') }}</div>
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
          <span style="font-size:13px; font-weight:800; color:#ffffff;">{{ t('schedule.bookBtn') }}</span>
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

        <!-- Per-hour empty slot button -->
        <div
          v-for="hour in hours"
          :key="'empty-' + hour"
          v-show="isHourFree(hour)"
          @click="openNewBooking(hourTime(hour))"
          style="position:absolute; left:54px; right:0; padding:6px 0; cursor:pointer;"
          :style="{ top: hourToY(hour) + 'px', height: HOUR_HEIGHT + 'px' }"
        >
          <div
            class="hover-empty"
            style="height:100%; border-radius:12px; border:1.5px dashed #e2e8f0;
                   display:flex; align-items:center; justify-content:center;
                   gap:6px; transition:all 0.15s;"
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
            <span style="font-size:12px; color:#94a3b8; font-weight:600;">{{ t('schedule.freeSlot') }}</span>
          </div>
        </div>

        <!-- Booking cards -->
        <div
          v-for="b in dayBookings"
          :key="b.id"
          @click="openBookingDetail(b)"
          style="position:absolute; left:54px; right:0; padding:3px 0; cursor:pointer;"
          :style="{ top: slotY(b.startTime) + 'px', height: bookingHeight(b) + 'px' }"
        >
          <div
            :style="`height:100%; border-radius:14px;
                     background:linear-gradient(135deg, #fed7aa 0%, ${b.paymentStatus === 'paid' ? 'rgba(249,115,22,0.13)' : 'rgba(249,115,22,0.20)'} 100%);
                     border:1.5px solid rgba(249,115,22,0.4); padding:10px 14px;
                     display:flex; flex-direction:column; justify-content:center; gap:4px; overflow:hidden;`"
          >
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <div style="font-size:16px; font-weight:800; color:#9a3412; min-width:0;
                          overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; line-height:1.2;">
                {{ b.customerName }}
              </div>
              <div
                :style="b.paymentStatus === 'paid'
                  ? 'width:24px; height:24px; border-radius:7px; background:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0;'
                  : 'width:24px; height:24px; border-radius:7px; background:#f97316; display:flex; align-items:center; justify-content:center; flex-shrink:0;'"
              >
                <svg v-if="b.paymentStatus === 'paid'" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
            <div style="font-size:12px; color:#9a3412; font-weight:600; font-family:'Inter', sans-serif;
                        line-height:1.25; display:flex; align-items:center; gap:6px;
                        white-space:nowrap; overflow:hidden;">
              <span style="font-weight:700; flex-shrink:0;">{{ b.startTime }}–{{ b.endTime }}</span>
              <span v-if="b.customerPhone" style="opacity:0.7; min-width:0; overflow:hidden; text-overflow:ellipsis;">
                · {{ b.customerPhone }}
              </span>
              <span style="margin-left:auto; font-weight:800; flex-shrink:0;">
                {{ formatMoney(b.price) }} {{ t('common.soum') }}
              </span>
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
import { useI18n } from 'vue-i18n'
import { useStadiumsStore } from '../stores/stadiums'
import { useBookingsStore } from '../stores/bookings'
import type { Booking } from '../types'
import dayjs from 'dayjs'
import BookingModal from '../components/booking/BookingModal.vue'

const router = useRouter()
const { t, tm, rt } = useI18n()
const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()

const PX_PER_MIN = 1.2
const HOUR_HEIGHT = PX_PER_MIN * 60

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedFieldId = ref<number | ''>(stadiumsStore.activeFieldId)
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

const monthLabel = computed(() => {
  const d = dayjs(selectedDate.value)
  const months = tm('date.months') as unknown as any[]
  return `${rt(months[d.month()])} ${d.year()}`
})

const weekStrip = computed(() => {
  const today = dayjs()
  const weekdaysShort = tm('date.weekdaysShort') as unknown as any[]
  return Array.from({ length: 7 }, (_, i) => {
    const d = today.add(i, 'day')
    return {
      value: d.format('YYYY-MM-DD'),
      day: d.date(),
      weekday: rt(weekdaysShort[d.day()]),
      faded: false,
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

function hourTime(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

function isHourFree(hour: number) {
  const hourStart = hour * 60
  const hourEnd = (hour + 1) * 60
  for (const b of dayBookings.value) {
    const [bsh, bsm] = b.startTime.split(':').map(Number)
    const [beh, bem] = b.endTime.split(':').map(Number)
    const bs = bsh * 60 + bsm
    const be = beh * 60 + bem
    if (bs < hourEnd && be > hourStart) return false
  }
  return true
}

function selectDate(d: string) {
  selectedDate.value = d
  bookingsStore.loadSchedule(d).catch(() => {})
}
function selectField(id: number | string) {
  const n = Number(id)
  selectedFieldId.value = n
  stadiumsStore.setActiveField(n)
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
  if (!stadiumsStore.loaded) await stadiumsStore.loadAll()
  if (!selectedFieldId.value && stadiumsStore.fields[0]) {
    selectedFieldId.value = stadiumsStore.fields[0].id
  }
  await bookingsStore.loadSchedule(selectedDate.value).catch(() => {})
  await nextTick()
  if (timelineEl.value) {
    const scrollY = isToday.value && nowY.value > 0
      ? Math.max(0, nowY.value - 100)
      : hourToY(Math.max(workStart.value, 8))
    timelineEl.value.scrollTop = scrollY
  }
})

watch(() => stadiumsStore.activeFieldId, id => {
  if (id !== '') selectedFieldId.value = Number(id)
})
</script>

<style scoped>
.hover-empty:hover {
  border-color: rgba(22, 163, 74, 0.4) !important;
  background: rgba(22, 163, 74, 0.04);
}
</style>
