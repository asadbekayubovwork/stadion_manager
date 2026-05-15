<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div
      style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:12px 16px;
             display:flex; align-items:center; justify-content:space-between;"
    >
      <div>
        <div style="font-size:18px; font-weight:900; color:#0f172a;">Barcha maydonlar</div>
        <div style="font-size:12px; color:#475569; font-weight:500;">{{ dateLabel }}</div>
      </div>
      <div style="display:flex; gap:8px;">
        <button
          @click="shiftDate(-1)"
          style="width:36px; height:36px; border-radius:10px; background:#f1f5f9;
                 display:flex; align-items:center; justify-content:center;
                 border:none; cursor:pointer;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
          @click="shiftDate(1)"
          style="width:36px; height:36px; border-radius:10px; background:#16a34a;
                 display:flex; align-items:center; justify-content:center;
                 border:none; cursor:pointer;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <div style="padding:16px;">
      <!-- Hour scale -->
      <div style="margin-bottom:8px;">
        <div style="display:flex; padding-left:72px; gap:0; margin-bottom:6px;">
          <div
            v-for="hour in hourMarks"
            :key="hour"
            style="flex:1; text-align:center; font-size:10px; color:#94a3b8;
                   font-family:'Inter', sans-serif; font-weight:600;"
          >
            {{ String(hour).padStart(2, '0') }}
          </div>
        </div>

        <!-- Field rows -->
        <div
          v-for="f in fields"
          :key="f.id"
          @click="goToField(f.id)"
          style="display:flex; align-items:center; gap:8px; margin-bottom:8px; cursor:pointer;"
        >
          <div
            :style="`width:64px; flex-shrink:0; font-size:12px; font-weight:700; color:${fieldColor(f.id)};`"
          >
            {{ f.name }}
          </div>
          <div
            style="flex:1; display:flex; gap:2px; height:32px; border-radius:10px; overflow:hidden;"
          >
            <div
              v-for="(cell, i) in slotMap[f.id]"
              :key="i"
              :style="{
                flex: 1,
                borderRadius: '4px',
                background: cell ? fieldColor(f.id) + 'cc' : '#f1f5f9'
              }"
            />
          </div>
        </div>
      </div>

      <!-- Field cards -->
      <div style="font-size:15px; font-weight:800; color:#0f172a; margin:16px 0 10px;">
        Maydon holati
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div
          v-for="f in fields"
          :key="f.id"
          @click="goToField(f.id)"
          :style="`background:#ffffff; border-radius:16px; padding:14px 16px;
                   box-shadow:0 2px 8px rgba(15,23,42,0.08);
                   display:flex; align-items:center; gap:14px; cursor:pointer;
                   border-left:4px solid ${fieldColor(f.id)};`"
        >
          <div style="flex:1; min-width:0;">
            <div style="font-size:15px; font-weight:800; color:#0f172a;">{{ f.name }}</div>
            <div style="font-size:12px; color:#475569; font-weight:500; margin-top:2px;
                        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              Keyingi: {{ nextLabel(f.id) }}
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <div
                style="background:#fff7ed; border-radius:8px; padding:3px 10px;
                       font-size:12px; font-weight:700; color:#9a3412;"
              >
                {{ stats[f.id].booked }} band
              </div>
              <div
                style="background:#dcfce7; border-radius:8px; padding:3px 10px;
                       font-size:12px; font-weight:700; color:#14532d;"
              >
                {{ stats[f.id].free }} bo'sh
              </div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStadiumsStore } from '../stores/stadiums'
import { useBookingsStore } from '../stores/bookings'
import dayjs from 'dayjs'

const router = useRouter()
const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()

const FIELD_COLORS = ['#16a34a', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#0d9488']

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

const stadium = computed(() => stadiumsStore.activeStadium)
const fields = computed(() => stadium.value?.fields ?? [])

const workStart = computed(() => stadium.value?.workStart ?? 6)
const workEnd = computed(() => stadium.value?.workEnd ?? 24)

const hourMarks = computed(() => {
  const start = workStart.value
  const end = workEnd.value
  const step = (end - start) / 6
  return Array.from({ length: 7 }, (_, i) => Math.round(start + i * step))
})

const SLOT_COUNT = 18

const slotMap = computed<Record<string, boolean[]>>(() => {
  const result: Record<string, boolean[]> = {}
  const start = workStart.value * 60
  const end = workEnd.value * 60
  const step = (end - start) / SLOT_COUNT

  for (const f of fields.value) {
    const cells: boolean[] = []
    const fieldBookings = bookingsStore.getForFieldAndDate(f.id, selectedDate.value)
    for (let i = 0; i < SLOT_COUNT; i++) {
      const slotStart = start + i * step
      const slotEnd = start + (i + 1) * step
      const hit = fieldBookings.some(b => {
        const bs = timeToMinutes(b.startTime)
        const be = timeToMinutes(b.endTime)
        return bs < slotEnd && be > slotStart
      })
      cells.push(hit)
    }
    result[f.id] = cells
  }
  return result
})

const stats = computed<Record<string, { booked: number; free: number }>>(() => {
  const result: Record<string, { booked: number; free: number }> = {}
  for (const f of fields.value) {
    const fieldBookings = bookingsStore.getForFieldAndDate(f.id, selectedDate.value)
    const totalSlots = workEnd.value - workStart.value
    const bookedHours = fieldBookings.reduce(
      (sum, b) => sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)) / 60,
      0
    )
    result[f.id] = {
      booked: Math.round(bookedHours),
      free: Math.max(0, totalSlots - Math.round(bookedHours)),
    }
  }
  return result
})

const WEEKDAYS_UZ = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
const MONTHS_UZ_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']

const dateLabel = computed(() => {
  const d = dayjs(selectedDate.value)
  return `${d.date()} ${MONTHS_UZ_SHORT[d.month()]}, ${WEEKDAYS_UZ[d.day()]}`
})

function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function fieldColor(fieldId: number) {
  const idx = fields.value.findIndex(f => f.id === fieldId)
  const f = fields.value[idx]
  return f?.color || FIELD_COLORS[idx % FIELD_COLORS.length] || '#16a34a'
}

function nextLabel(fieldId: number) {
  const now = dayjs().isSame(selectedDate.value, 'day') ? dayjs().format('HH:mm') : '00:00'
  const upcoming = bookingsStore
    .getForFieldAndDate(fieldId, selectedDate.value)
    .filter(b => b.endTime > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
  if (!upcoming) return "Bo'sh"
  return `${(upcoming.customerName || '—').split(' ')[0]} — ${upcoming.startTime}`
}

function shiftDate(delta: number) {
  selectedDate.value = dayjs(selectedDate.value).add(delta, 'day').format('YYYY-MM-DD')
}

function goToField(fieldId: number) {
  stadiumsStore.setActiveField(fieldId)
  router.push({ name: 'schedule' })
}

onMounted(async () => {
  if (!stadiumsStore.loaded) await stadiumsStore.loadAll()
  await bookingsStore.loadByDate(selectedDate.value).catch(() => {})
})

watch(selectedDate, (d) => {
  bookingsStore.loadByDate(d).catch(() => {})
})
</script>
