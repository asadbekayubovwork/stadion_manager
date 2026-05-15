<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div
      style="background:#ffffff; padding:12px 20px 16px; border-bottom:1px solid #e2e8f0;
             display:flex; align-items:center; justify-content:space-between;"
    >
      <div>
        <div style="font-size:13px; color:#475569; font-weight:500;">{{ todayLabel }}</div>
        <div style="font-size:20px; font-weight:900; color:#0f172a; margin-top:2px;">
          Assalomu alaykum 👋
        </div>
      </div>
      <div
        style="width:40px; height:40px; border-radius:12px; background:#16a34a;
               display:flex; align-items:center; justify-content:center;
               font-size:18px; font-weight:800; color:#ffffff;"
      >
        {{ userInitial }}
      </div>
    </div>

    <!-- ── CONTENT ── -->
    <div style="padding:16px;">

      <!-- Revenue + stats row -->
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <!-- Revenue card -->
        <div
          style="flex:1; background:linear-gradient(135deg,#16a34a 0%, #0d8c3a 100%);
                 border-radius:16px; padding:16px;
                 box-shadow:0 4px 16px rgba(22,163,74,0.25);"
        >
          <div style="font-size:11px; color:rgba(255,255,255,0.8); font-weight:600;
                      letter-spacing:0.5px; text-transform:uppercase;">
            Bugungi daromad
          </div>
          <div style="font-size:22px; font-weight:900; color:#ffffff; margin-top:4px;
                      font-family:'Inter', sans-serif;">
            {{ formatMoney(revenue) }}
          </div>
          <div style="font-size:12px; color:rgba(255,255,255,0.7); font-weight:600;">so'm</div>
          <div style="display:flex; align-items:center; gap:4px; margin-top:8px;">
            <svg v-if="revenueDeltaPct >= 0" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
            <span style="font-size:12px; color:rgba(255,255,255,0.9); font-weight:700;">
              {{ revenueDeltaPct >= 0 ? '+' : '' }}{{ revenueDeltaPct }}% kecha
            </span>
          </div>
        </div>

        <!-- Stats stack -->
        <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
          <div style="background:#ffffff; border-radius:14px; padding:12px 14px;
                      box-shadow:0 2px 8px rgba(15,23,42,0.08);">
            <div style="font-size:10px; color:#94a3b8; font-weight:600;
                        text-transform:uppercase; letter-spacing:0.4px;">
              Bronlar
            </div>
            <div style="font-size:20px; font-weight:900; color:#0f172a;
                        font-family:'Inter', sans-serif;">
              {{ todayBookingsCount }}
            </div>
            <div style="font-size:11px; color:#f97316; font-weight:700;">
              {{ todayUnpaidCount }} to'lanmagan
            </div>
          </div>
          <div style="background:#ffffff; border-radius:14px; padding:12px 14px;
                      box-shadow:0 2px 8px rgba(15,23,42,0.08);">
            <div style="font-size:10px; color:#94a3b8; font-weight:600;
                        text-transform:uppercase; letter-spacing:0.4px;">
              Band saatlar
            </div>
            <div style="font-size:20px; font-weight:900; color:#0f172a;
                        font-family:'Inter', sans-serif;">
              {{ bookedHours }}/{{ totalHours }}
            </div>
            <div style="font-size:11px; color:#16a34a; font-weight:700;">
              {{ totalHours - bookedHours }} bo'sh
            </div>
          </div>
        </div>
      </div>

      <!-- Mini timeline -->
      <div
        style="background:#ffffff; border-radius:16px; padding:16px;
               box-shadow:0 2px 8px rgba(15,23,42,0.08); margin-bottom:16px;"
      >
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div style="font-size:15px; font-weight:800; color:#0f172a;">Bugungi jadval</div>
          <button
            @click="router.push('/schedule')"
            style="background:none; border:none; cursor:pointer; padding:0;
                   font-size:13px; color:#16a34a; font-weight:700;"
          >
            Hammasi →
          </button>
        </div>
        <div style="display:flex; gap:3px; height:24px; border-radius:8px; overflow:hidden;">
          <div
            v-for="(bar, i) in timelineBars"
            :key="i"
            :style="{ flex: 1, background: bar ? '#fed7aa' : '#e2e8f0', borderRadius: '3px' }"
          />
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px;">
          <span style="font-size:11px; color:#94a3b8; font-family:'Inter', sans-serif;">06:00</span>
          <span style="font-size:11px; color:#94a3b8; font-family:'Inter', sans-serif;">14:00</span>
          <span style="font-size:11px; color:#94a3b8; font-family:'Inter', sans-serif;">24:00</span>
        </div>
      </div>

      <!-- Upcoming bookings -->
      <div>
        <div style="font-size:15px; font-weight:800; color:#0f172a; margin-bottom:10px;">
          Yaqindagi bronlar
        </div>
        <div v-if="upcoming.length === 0"
             style="font-size:14px; color:#94a3b8; text-align:center; padding:16px 0;">
          Bugun bron yo'q
        </div>
        <div v-else style="display:flex; flex-direction:column; gap:8px;">
          <div
            v-for="b in upcoming"
            :key="b.id"
            @click="router.push('/schedule')"
            style="background:#ffffff; border-radius:14px; padding:12px 14px;
                   display:flex; align-items:center; gap:12px;
                   box-shadow:0 1px 4px rgba(15,23,42,0.08); cursor:pointer;"
            :style="`border-left: 3px solid ${b.paymentStatus === 'paid' ? '#16a34a' : '#f97316'};`"
          >
            <div style="flex:1; min-width:0;">
              <div style="font-size:14px; font-weight:800; color:#0f172a;
                          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                {{ b.customerName }}
              </div>
              <div style="font-size:12px; color:#475569; font-weight:600; margin-top:2px;">
                {{ fieldName(b.fieldId) }} ·
                <span style="font-family:'Inter', sans-serif;">{{ b.startTime }}–{{ b.endTime }}</span>
              </div>
            </div>
            <div
              :style="b.paymentStatus === 'paid'
                ? 'background:#dcfce7; padding:4px 10px; border-radius:8px; flex-shrink:0;'
                : 'background:#fff7ed; padding:4px 10px; border-radius:8px; flex-shrink:0;'"
            >
              <span
                :style="b.paymentStatus === 'paid'
                  ? 'font-size:11px; font-weight:800; color:#14532d;'
                  : 'font-size:11px; font-weight:800; color:#9a3412;'"
              >
                {{ b.paymentStatus === 'paid' ? "To'langan" : "To'liq emas" }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import * as dashboardApi from '../api/dashboard'
import { normalizeBooking } from '../utils/booking'
import type { DashboardData } from '../types'
import dayjs from 'dayjs'

const router = useRouter()
const auth = useAuthStore()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const today = dayjs().format('YYYY-MM-DD')

const dashboard = ref<DashboardData | null>(null)

async function loadDashboard() {
  try {
    const d = await dashboardApi.getDashboard() as any
    if (Array.isArray(d?.recentBookings)) {
      d.recentBookings = d.recentBookings.map(normalizeBooking)
    }
    dashboard.value = d
  } catch {}
}

onMounted(async () => {
  if (!stadiumsStore.loaded) await stadiumsStore.loadAll()
  await Promise.all([
    bookingsStore.loadByDate(today).catch(() => {}),
    loadDashboard(),
  ])
})

const WEEKDAYS_UZ = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

const todayLabel = computed(() => {
  const d = dayjs()
  return `${WEEKDAYS_UZ[d.day()]}, ${d.date()} ${MONTHS_UZ[d.month()]} ${d.year()}`
})

const userInitial = computed(() => auth.user?.name?.trim().charAt(0).toUpperCase() || 'A')

const stadiumId = computed(() => stadiumsStore.activeStadiumId)
const stadium = computed(() => stadiumsStore.activeStadium)

const revenue = computed(() =>
  dashboard.value?.todayIncome ?? bookingsStore.todayRevenue()
)
const revenueDeltaPct = computed(() =>
  Math.round(dashboard.value?.incomeChangePercent ?? 0)
)

const todayBookings = computed(() =>
  bookingsStore.getForStadiumAndDate(stadiumId.value, today)
)

const todayBookingsCount = computed(() =>
  dashboard.value?.todayBookingsCount ?? todayBookings.value.length
)

const todayUnpaidCount = computed(() =>
  dashboard.value?.unpaidBookingsCount ??
  todayBookings.value.filter(b => !b.isPaid).length
)

const totalHours = computed(() => {
  if (typeof dashboard.value?.totalHours === 'number') return dashboard.value.totalHours
  const s = stadium.value
  return s ? (s.workEnd - s.workStart) : 18
})

function timeToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const bookedHours = computed(() => {
  if (typeof dashboard.value?.busyHours === 'number') return dashboard.value.busyHours
  return Math.round(
    todayBookings.value.reduce(
      (sum, b) => sum + (timeToMinutes(b.endTime) - timeToMinutes(b.startTime)),
      0
    ) / 60
  )
})

const timelineBars = computed(() => {
  const schedule = dashboard.value?.todaySchedule
  if (Array.isArray(schedule) && schedule.length > 0) {
    return schedule.map(s => s.isBusy)
  }
  const s = stadium.value
  if (!s) return Array(12).fill(false)
  const bars: boolean[] = []
  const step = (s.workEnd - s.workStart) / 12
  for (let i = 0; i < 12; i++) {
    const slotStart = (s.workStart + i * step) * 60
    const slotEnd = (s.workStart + (i + 1) * step) * 60
    const hit = todayBookings.value.some(b => {
      const bs = timeToMinutes(b.startTime)
      const be = timeToMinutes(b.endTime)
      return bs < slotEnd && be > slotStart
    })
    bars.push(hit)
  }
  return bars
})

const now = dayjs().format('HH:mm')
const upcoming = computed(() => {
  const recent = dashboard.value?.recentBookings
  if (Array.isArray(recent) && recent.length > 0) return recent.slice(0, 5)
  return todayBookings.value
    .filter(b => b.endTime > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 5)
})

function fieldName(fieldId: number) {
  return stadium.value?.fields.find(f => f.id === fieldId)?.name ?? String(fieldId)
}
function formatMoney(n: number) {
  return n.toLocaleString('uz-UZ').replace(/,/g, ' ')
}
</script>
