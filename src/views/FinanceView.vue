<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div
      style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:14px 16px;
             display:flex; align-items:center; justify-content:space-between;"
    >
      <div style="font-size:22px; font-weight:900; color:#0f172a;">Moliya</div>
      <div
        style="background:#f1f5f9; border-radius:10px; padding:4px;
               display:flex; gap:2px;"
      >
        <button
          v-for="p in periods"
          :key="p.key"
          @click="activePeriod = p.key"
          :style="activePeriod === p.key
            ? 'padding:6px 14px; border-radius:8px; background:#16a34a; color:#ffffff; font-size:12px; font-weight:800; border:none; cursor:pointer; box-shadow:0 2px 6px rgba(22,163,74,0.3);'
            : 'padding:6px 14px; border-radius:8px; background:transparent; color:#475569; font-size:12px; font-weight:700; border:none; cursor:pointer;'"
        >{{ p.label }}</button>
      </div>
    </div>

    <div style="padding:16px;">

      <!-- Total revenue card -->
      <div
        style="background:linear-gradient(135deg,#16a34a 0%, #0d8c3a 100%);
               border-radius:18px; padding:18px;
               box-shadow:0 6px 20px rgba(22,163,74,0.3); margin-bottom:14px;"
      >
        <div style="font-size:11px; color:rgba(255,255,255,0.8); font-weight:700;
                    text-transform:uppercase; letter-spacing:0.5px;">
          {{ totalLabel }}
        </div>
        <div style="font-size:30px; font-weight:900; color:#ffffff;
                    font-family:'Inter', sans-serif; margin-top:4px; letter-spacing:-0.5px;">
          {{ formatMoney(stats.total) }}
        </div>
        <div style="font-size:13px; color:rgba(255,255,255,0.7); font-weight:600;">so'm</div>
        <div v-if="totalLabel !== 'Bugungi jami'"
             style="display:flex; align-items:center; gap:4px; margin-top:8px;">
          <svg v-if="deltaPct >= 0" width="14" height="14" viewBox="0 0 24 24" fill="none"
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
            {{ deltaPct >= 0 ? '+' : '' }}{{ deltaPct }}% {{ deltaLabel }}
          </span>
        </div>
      </div>

      <!-- Bar chart -->
      <div
        style="background:#ffffff; border-radius:16px; padding:16px;
               box-shadow:0 2px 8px rgba(15,23,42,0.08); margin-bottom:14px;"
      >
        <div style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:14px;">
          Kunlik daromad
        </div>
        <div style="display:flex; align-items:flex-end; gap:8px; height:90px;">
          <div
            v-for="bar in chart"
            :key="bar.label"
            style="flex:1; display:flex; align-items:flex-end; height:100%;"
          >
            <div
              :style="{
                width: '100%',
                height: bar.h + '%',
                minHeight: '4px',
                background: bar.active ? '#16a34a' : '#bbf7d0',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s ease',
              }"
            />
          </div>
        </div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <div
            v-for="bar in chart"
            :key="bar.label + '-l'"
            style="flex:1; text-align:center; font-size:11px; font-weight:600; color:#94a3b8;"
          >
            {{ bar.label }}
          </div>
        </div>
      </div>

      <!-- Cash / Card cards -->
      <div style="display:flex; gap:10px; margin-bottom:14px;">
        <div
          style="flex:1; background:#ffffff; border-radius:14px; padding:14px;
                 box-shadow:0 2px 8px rgba(15,23,42,0.08); border-top:3px solid #16a34a;"
        >
          <div style="font-size:11px; color:#16a34a; font-weight:700;
                      text-transform:uppercase; letter-spacing:0.5px;">Naqd</div>
          <div style="font-size:18px; font-weight:900; color:#0f172a; margin-top:4px;
                      font-family:'Inter', sans-serif;">
            {{ formatMoney(stats.cash) }}
          </div>
          <div style="font-size:11px; color:#16a34a; font-weight:700; margin-top:2px;">
            {{ cashPct }}%
          </div>
        </div>
        <div
          style="flex:1; background:#ffffff; border-radius:14px; padding:14px;
                 box-shadow:0 2px 8px rgba(15,23,42,0.08); border-top:3px solid #3b82f6;"
        >
          <div style="font-size:11px; color:#3b82f6; font-weight:700;
                      text-transform:uppercase; letter-spacing:0.5px;">Karta</div>
          <div style="font-size:18px; font-weight:900; color:#0f172a; margin-top:4px;
                      font-family:'Inter', sans-serif;">
            {{ formatMoney(stats.card) }}
          </div>
          <div style="font-size:11px; color:#3b82f6; font-weight:700; margin-top:2px;">
            {{ cardPct }}%
          </div>
        </div>
      </div>

      <!-- Unpaid section -->
      <div
        style="background:#ffffff; border-radius:14px; overflow:hidden;
               box-shadow:0 2px 8px rgba(15,23,42,0.08);"
      >
        <div
          style="display:flex; align-items:center; justify-content:space-between;
                 padding:12px 14px; border-bottom:1px solid #f1f5f9;"
        >
          <div style="font-size:14px; font-weight:800; color:#0f172a;">To'lanmagan bronlar</div>
          <div
            style="background:#fff7ed; padding:2px 10px; border-radius:8px;
                   font-size:11px; font-weight:700; color:#9a3412;"
          >
            {{ unpaidCount }} ta · {{ formatMoney(unpaidTotal) }} so'm
          </div>
        </div>

        <div v-if="unpaid.length === 0"
             style="padding:24px; text-align:center; color:#94a3b8; font-size:13px;">
          To'lanmagan bron yo'q
        </div>

        <div v-else>
          <div
            v-for="(b, i) in unpaid"
            :key="b.id"
            @click="router.push({ name: 'booking-detail', params: { id: b.id } })"
            style="display:flex; align-items:center; padding:12px 14px; cursor:pointer;"
            :style="i < unpaid.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : ''"
          >
            <div style="flex:1; min-width:0;">
              <div style="font-size:14px; font-weight:800; color:#0f172a;
                          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                {{ b.customerName }}
              </div>
              <div style="font-size:12px; color:#475569; font-weight:500; margin-top:2px;
                          font-family:'Inter', sans-serif;">
                {{ b.startTime }}–{{ b.endTime }}
              </div>
            </div>
            <div style="font-size:14px; font-weight:800; color:#f97316;
                        font-family:'Inter', sans-serif; flex-shrink:0; margin-left:12px;">
              {{ formatMoney(b.price) }} so'm
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import * as financeApi from '../api/finance'
import { normalizeBooking } from '../utils/booking'
import type { FinanceData } from '../types'
import dayjs from 'dayjs'

const router = useRouter()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()
const finance = ref<FinanceData | null>(null)
const loading = ref(false)

const periods = [
  { key: 'today', label: 'Kun' },
  { key: 'week', label: 'Hafta' },
  { key: 'month', label: 'Oy' },
] as const

const activePeriod = ref<'today' | 'week' | 'month'>('week')

const stadiumId = computed(() => stadiumsStore.activeStadiumId)

const dateRange = computed(() => {
  const today = dayjs()
  if (activePeriod.value === 'today') {
    const d = today.format('YYYY-MM-DD')
    return { start: d, end: d }
  }
  if (activePeriod.value === 'week') {
    return { start: today.startOf('week').format('YYYY-MM-DD'), end: today.endOf('week').format('YYYY-MM-DD') }
  }
  return { start: today.startOf('month').format('YYYY-MM-DD'), end: today.endOf('month').format('YYYY-MM-DD') }
})

const localStats = computed(() =>
  bookingsStore.revenueByPeriod(stadiumId.value, dateRange.value.start, dateRange.value.end)
)
const stats = computed(() => ({
  total: finance.value?.totalIncome ?? localStats.value.total,
  cash: finance.value?.cashAmount ?? localStats.value.cash,
  card: finance.value?.cardAmount ?? localStats.value.card,
}))

const prevRange = computed(() => {
  const today = dayjs()
  if (activePeriod.value === 'today') {
    const d = today.subtract(1, 'day').format('YYYY-MM-DD')
    return { start: d, end: d }
  }
  if (activePeriod.value === 'week') {
    const prev = today.subtract(1, 'week')
    return { start: prev.startOf('week').format('YYYY-MM-DD'), end: prev.endOf('week').format('YYYY-MM-DD') }
  }
  const prev = today.subtract(1, 'month')
  return { start: prev.startOf('month').format('YYYY-MM-DD'), end: prev.endOf('month').format('YYYY-MM-DD') }
})

const prevStats = computed(() =>
  bookingsStore.revenueByPeriod(stadiumId.value, prevRange.value.start, prevRange.value.end)
)

const deltaPct = computed(() => {
  if (typeof finance.value?.changePercent === 'number') {
    return Math.round(finance.value.changePercent)
  }
  const p = prevStats.value.total
  if (!p) return stats.value.total > 0 ? 100 : 0
  return Math.round(((stats.value.total - p) / p) * 100)
})

const totalLabel = computed(() =>
  activePeriod.value === 'today' ? 'Bugungi jami'
    : activePeriod.value === 'week' ? "Bu hafta jami"
    : 'Bu oy jami'
)

const deltaLabel = computed(() =>
  activePeriod.value === 'week' ? "o'tgan haftadan"
    : activePeriod.value === 'month' ? "o'tgan oydan"
    : ''
)

const cashPct = computed(() => {
  if (typeof finance.value?.cashPercent === 'number') {
    return Math.round(finance.value.cashPercent)
  }
  const t = stats.value.total
  if (!t) return 0
  return Math.round((stats.value.cash / t) * 100)
})
const cardPct = computed(() => {
  if (typeof finance.value?.cardPercent === 'number') {
    return Math.round(finance.value.cardPercent)
  }
  return 100 - cashPct.value
})

const WEEKDAYS_LABEL = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

const chart = computed(() => {
  const today = dayjs()
  const todayStr = today.format('YYYY-MM-DD')

  // Prefer server-provided daily breakdown.
  const daily = finance.value?.dailyIncomes
  if (Array.isArray(daily) && daily.length > 0) {
    const buckets = daily.map(d => ({ label: d.dayLabel, value: d.amount, date: d.date }))
    const activeIdx = buckets.findIndex(b => b.date === todayStr)
    return buildChart(buckets, activeIdx)
  }

  // Local fallback
  if (activePeriod.value === 'today') {
    const buckets: { label: string; value: number }[] = []
    for (let h = 6; h < 24; h += 3) {
      buckets.push({ label: `${h}h`, value: 0 })
    }
    bookingsStore.bookings
      .filter(b => b.date === todayStr && b.isPaid && b.status === 'active')
      .forEach(b => {
        const h = parseInt(b.startTime.split(':')[0])
        const idx = Math.min(buckets.length - 1, Math.max(0, Math.floor((h - 6) / 3)))
        buckets[idx].value += b.price
      })
    return buildChart(buckets, -1)
  }
  if (activePeriod.value === 'week') {
    const start = today.startOf('week')
    const buckets = WEEKDAYS_LABEL.map((label, i) => ({
      label,
      value: 0,
      date: start.add(i, 'day').format('YYYY-MM-DD'),
    }))
    bookingsStore.bookings
      .filter(b => b.isPaid && b.status === 'active')
      .forEach(b => {
        const bucket = buckets.find(x => x.date === b.date)
        if (bucket) bucket.value += b.price
      })
    return buildChart(buckets, today.day())
  }
  const daysInMonth = today.daysInMonth()
  const buckets: { label: string; value: number }[] = []
  for (let d = 1; d <= daysInMonth; d += Math.ceil(daysInMonth / 7)) {
    buckets.push({ label: String(d), value: 0 })
  }
  return buildChart(buckets, -1)
})

function buildChart(buckets: { label: string; value: number }[], activeIdx: number) {
  const max = Math.max(1, ...buckets.map(b => b.value))
  return buckets.map((b, i) => ({
    label: b.label,
    h: Math.round((b.value / max) * 100),
    active: i === activeIdx,
  }))
}

const unpaid = computed(() => {
  if (finance.value?.unpaidBookings?.length) {
    return finance.value.unpaidBookings.map(normalizeBooking).slice(0, 6)
  }
  return bookingsStore.unpaidBookings.slice(0, 6)
})

const unpaidTotal = computed(() =>
  finance.value?.totalUnpaid ?? unpaid.value.reduce((sum, b) => sum + b.price, 0)
)
const unpaidCount = computed(() =>
  finance.value?.unpaidCount ?? unpaid.value.length
)

async function loadFinance() {
  loading.value = true
  try {
    finance.value = await financeApi.getFinance(activePeriod.value) as any
  } catch {
    finance.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!stadiumsStore.loaded) await stadiumsStore.loadAll()
  await Promise.all([
    bookingsStore.loadByDate(dateRange.value.start).catch(() => {}),
    bookingsStore.loadByDate(dateRange.value.end).catch(() => {}),
    loadFinance(),
  ])
})

watch(activePeriod, () => { loadFinance() })

function formatMoney(n: number) { return n.toLocaleString('uz-UZ').replace(/,/g, ' ') }
</script>
