<template>
  <div
    v-if="booking"
    class="flex flex-col"
    style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;"
  >

    <!-- ── HEADER ── -->
    <div
      style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:12px 16px;
             display:flex; align-items:center; gap:12px;"
    >
      <button
        @click="router.back()"
        style="width:36px; height:36px; border-radius:10px; background:#f1f5f9;
               display:flex; align-items:center; justify-content:center;
               border:none; cursor:pointer;"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div style="flex:1;">
        <div style="font-size:17px; font-weight:900; color:#0f172a;">Bron tafsiloti</div>
      </div>
      <button
        @click="onEdit"
        style="width:36px; height:36px; border-radius:10px; background:#f1f5f9;
               display:flex; align-items:center; justify-content:center;
               border:none; cursor:pointer;"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>

    <!-- ── BODY ── -->
    <div style="padding:16px;">

      <!-- Hero card -->
      <div
        :style="`background: linear-gradient(135deg, ${heroColor} 0%, ${heroColorDark} 100%);
                 border-radius:20px; padding:20px; margin-bottom:16px;
                 box-shadow: 0 6px 24px ${heroShadow};`"
      >
        <div
          style="display:inline-flex; padding:4px 12px; border-radius:100px;
                 background:rgba(255,255,255,0.2); margin-bottom:12px;"
        >
          <span style="font-size:12px; color:#ffffff; font-weight:700;">
            {{ booking.paymentStatus === 'paid' ? "To'langan" : "To'lanmagan" }} · {{ fieldName }}
          </span>
        </div>
        <div style="font-size:32px; font-weight:900; color:#ffffff;
                    font-family:'Inter', sans-serif; line-height:1;">
          {{ booking.startTime }}
        </div>
        <div style="font-size:18px; font-weight:700; color:rgba(255,255,255,0.8);
                    font-family:'Inter', sans-serif;">
          — {{ booking.endTime }}
        </div>
        <div style="margin-top:12px; font-size:20px; font-weight:800; color:#ffffff;">
          {{ booking.clientName }}
        </div>
        <div style="font-size:14px; color:rgba(255,255,255,0.8); font-weight:500;
                    margin-top:2px; font-family:'Inter', sans-serif;">
          {{ booking.clientPhone }}
        </div>
      </div>

      <!-- Info rows -->
      <div
        style="background:#ffffff; border-radius:16px; overflow:hidden;
               box-shadow:0 2px 8px rgba(15,23,42,0.08); margin-bottom:12px;"
      >
        <div
          v-for="(row, i) in infoRows"
          :key="row.label"
          style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px;"
          :style="i < infoRows.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : ''"
        >
          <span style="font-size:14px; color:#475569; font-weight:600;">{{ row.label }}</span>
          <span
            style="font-size:14px; font-weight:800; color:#0f172a; font-family: 'Inter', sans-serif;"
          >{{ row.value }}</span>
        </div>
      </div>

      <!-- Client history -->
      <div
        v-if="clientHistory.length > 0"
        style="background:#ffffff; border-radius:16px; padding:14px 16px;
               box-shadow:0 2px 8px rgba(15,23,42,0.08); margin-bottom:16px;"
      >
        <div style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:10px;">
          Mijoz tarixi
        </div>
        <div
          v-for="(h, i) in clientHistory"
          :key="h.id"
          style="display:flex; justify-content:space-between; align-items:center;"
          :style="i > 0 ? 'padding-top:8px;' : ''"
        >
          <span style="font-size:13px; color:#475569; font-weight:600;">
            {{ formatShortDate(h.date) }} · {{ fieldNameOf(h.fieldId) }}
          </span>
          <div
            :style="h.paymentStatus === 'paid'
              ? 'padding:2px 8px; border-radius:6px; background:#dcfce7; font-size:11px; font-weight:700; color:#14532d;'
              : 'padding:2px 8px; border-radius:6px; background:#fff7ed; font-size:11px; font-weight:700; color:#9a3412;'"
          >
            {{ h.paymentStatus === 'paid' ? "To'langan" : "To'lanmagan" }}
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display:flex; gap:10px;">
        <button
          v-if="booking.paymentStatus === 'unpaid'"
          @click="onMarkPaid"
          style="flex:2; height:52px; border-radius:14px; background:#16a34a;
                 display:flex; align-items:center; justify-content:center; gap:8px;
                 border:none; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.4);"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style="font-size:15px; font-weight:800; color:#ffffff;">To'landi ✓</span>
        </button>
        <button
          v-else
          disabled
          style="flex:2; height:52px; border-radius:14px; background:#dcfce7;
                 display:flex; align-items:center; justify-content:center; gap:8px;
                 border:none; cursor:default;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
               stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style="font-size:15px; font-weight:800; color:#16a34a;">To'langan</span>
        </button>
        <button
          @click="onCancel"
          style="flex:1; height:52px; border-radius:14px; background:#fee2e2;
                 display:flex; align-items:center; justify-content:center; gap:6px;
                 border:none; cursor:pointer;"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          <span style="font-size:14px; font-weight:700; color:#ef4444;">Bekor</span>
        </button>
      </div>
    </div>

    <!-- Edit modal -->
    <BookingModal
      :show="showEdit"
      :booking="booking"
      :default-date="booking.date"
      :default-time="booking.startTime"
      :field-id="booking.fieldId"
      @close="showEdit = false"
      @saved="onSaved"
    />
  </div>

  <!-- Not found -->
  <div
    v-else
    class="flex items-center justify-center"
    style="min-height:100%; padding:40px; flex-direction:column; gap:12px;"
  >
    <div style="font-size:16px; color:#94a3b8;">Bron topilmadi</div>
    <button
      @click="router.push({ name: 'schedule' })"
      style="padding:12px 24px; border-radius:12px; background:#16a34a; color:#ffffff;
             font-size:14px; font-weight:700; border:none; cursor:pointer;"
    >
      Jadvalga qaytish
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import dayjs from 'dayjs'
import BookingModal from '../components/booking/BookingModal.vue'

const router = useRouter()
const route = useRoute()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const showEdit = ref(false)

const booking = computed(() =>
  bookingsStore.bookings.find(b => b.id === route.params.id)
)

const fieldName = computed(() =>
  booking.value ? fieldNameOf(booking.value.fieldId) : ''
)

function fieldNameOf(fieldId: string) {
  for (const s of stadiumsStore.stadiums) {
    const f = s.fields.find(f => f.id === fieldId)
    if (f) return f.name
  }
  return fieldId
}

const heroColor = computed(() =>
  booking.value?.paymentStatus === 'paid' ? '#16a34a' : '#f97316'
)
const heroColorDark = computed(() =>
  booking.value?.paymentStatus === 'paid' ? '#0d8c3a' : '#ea580c'
)
const heroShadow = computed(() =>
  booking.value?.paymentStatus === 'paid' ? 'rgba(22,163,74,0.33)' : 'rgba(249,115,22,0.33)'
)

const WEEKDAYS_UZ = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
const MONTHS_UZ = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr']
const MONTHS_UZ_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']

function formatFullDate(dateStr: string) {
  const d = dayjs(dateStr)
  return `${d.date()} ${MONTHS_UZ[d.month()]}, ${WEEKDAYS_UZ[d.day()]}`
}

function formatShortDate(dateStr: string) {
  const d = dayjs(dateStr)
  return `${d.date()} ${MONTHS_UZ_SHORT[d.month()]}`
}

function formatMoney(n: number) { return n.toLocaleString('uz-UZ').replace(/,/g, ' ') }

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h} soat ${m} daq`
  if (h) return `${h} soat`
  return `${m} daq`
}

const infoRows = computed(() => {
  const b = booking.value
  if (!b) return []
  const rows = [
    { label: 'Sana', value: formatFullDate(b.date), mono: false },
    { label: 'Davomiylik', value: formatDuration(b.durationMin), mono: false },
    { label: 'Narx', value: `${formatMoney(b.price)} so'm`, mono: true },
  ]
  if (b.notes) rows.push({ label: 'Izoh', value: b.notes, mono: false })
  return rows
})

const clientHistory = computed(() => {
  const b = booking.value
  if (!b || !b.clientPhone) return []
  return bookingsStore.bookings
    .filter(x =>
      x.id !== b.id &&
      x.status === 'active' &&
      (x.clientPhone === b.clientPhone || x.clientName === b.clientName)
    )
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))
    .slice(0, 5)
})

function onMarkPaid() {
  if (!booking.value) return
  bookingsStore.markPaid(booking.value.id, 'cash')
}

function onCancel() {
  if (!booking.value) return
  if (confirm('Bronni bekor qilishni tasdiqlaysizmi?')) {
    bookingsStore.cancelBooking(booking.value.id)
    router.back()
  }
}

function onEdit() {
  showEdit.value = true
}

function onSaved() {
  showEdit.value = false
}
</script>
