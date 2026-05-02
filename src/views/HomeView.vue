<template>
  <div class="min-h-full flex flex-col" style="background:#f8fafc;">

    <!-- ── HEADER ── -->
    <div class="flex flex-col px-6 pb-4" style="padding-top:64px; gap:32px;">

      <!-- Greeting row -->
      <div class="flex items-center justify-between w-full">
        <!-- Left: name + subtitle -->
        <div class="flex flex-col" style="gap:4px;">
          <h1 style="font-size:30px;font-weight:700;color:#0f172a;letter-spacing:-0.75px;line-height:36px;margin:0;">
            Salom, {{ auth.user?.name || 'Sardor' }}
          </h1>
          <p style="font-size:16px;font-weight:400;color:#64748b;line-height:24px;margin:0;">
            Bugun uchun xush kelibsiz
          </p>
        </div>

        <!-- Right: avatar -->
        <div class="relative flex-shrink-0">
          <div
            class="flex items-center justify-center overflow-hidden"
            style="width:56px;height:56px;border-radius:16px;border:2px solid white;box-shadow:0px 1px 3px 0px rgba(0,0,0,0.1),0px 1px 2px -1px rgba(0,0,0,0.1);background:rgba(22,163,74,0.1);"
          >
            <span style="font-size:22px;font-weight:700;color:#16a34a;">
              {{ auth.user?.name?.charAt(0)?.toUpperCase() || 'S' }}
            </span>
          </div>
          <!-- Online dot -->
          <div
            class="absolute"
            style="width:16px;height:16px;border-radius:9999px;background:#16a34a;border:2px solid white;bottom:-4px;right:-4px;"
          />
        </div>
      </div>

      <!-- Revenue card -->
      <div
        class="relative overflow-hidden w-full flex flex-col"
        style="background:#16a34a;border-radius:32px;padding:24px;box-shadow:0px 10px 15px -3px rgba(22,163,74,0.2),0px 4px 6px -4px rgba(22,163,74,0.2);gap:8px;"
      >
        <!-- Decorative circle -->
        <div
          class="absolute"
          style="width:128px;height:128px;border-radius:9999px;background:rgba(255,255,255,0.1);filter:blur(20px);bottom:-24px;right:-24px;pointer-events:none;"
        />

        <!-- Label row -->
        <div class="flex items-center" style="gap:8px;">
          <!-- Trend icon -->
          <svg width="18" height="10" viewBox="0 0 16.5 9" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
            <path d="M11.25 0.75H15.75V5.25" stroke="white" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.75 0.75L9.375 7.125L5.625 3.375L0.75 8.25" stroke="white" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.8);line-height:20px;">Bugungi tushum</span>
        </div>

        <!-- Amount -->
        <div class="flex items-baseline" style="gap:6px;">
          <span style="font-size:30px;font-weight:700;color:white;letter-spacing:-0.75px;line-height:36px;">
            {{ formatMoney(revenue) }}
          </span>
          <span style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.9);line-height:28px;">so'm</span>
        </div>
      </div>
    </div>

    <!-- ── SCROLLABLE CONTENT ── -->
    <div class="flex flex-col" style="gap:32px;padding-top:24px;padding-bottom:8px;">

      <!-- Upcoming bookings -->
      <section class="flex flex-col" style="gap:16px;padding:0 24px;">
        <!-- Section header -->
        <div class="flex items-center justify-between" style="padding:0 4px;">
          <h2 style="font-size:18px;font-weight:700;color:#0f172a;line-height:28px;margin:0;">Navbatdagilar</h2>
          <button
            @click="router.push('/schedule')"
            style="font-size:14px;font-weight:600;color:#16a34a;line-height:20px;background:none;border:none;cursor:pointer;padding:0;"
          >
            Hammasi
          </button>
        </div>

        <!-- Horizontal scroll cards -->
        <div
          v-if="upcoming.length === 0"
          style="font-size:14px;color:#94a3b8;text-align:center;padding:16px 0;"
        >
          Bugun bron yo'q
        </div>
        <div class="flex overflow-x-auto" style="gap:16px;padding-bottom:8px;scrollbar-width:none;" v-else>
          <div
            v-for="b in upcoming"
            :key="b.id"
            @click="router.push('/schedule')"
            class="flex flex-col flex-shrink-0 cursor-pointer"
            style="min-width:206px;background:white;border:1px solid rgba(226,232,240,0.5);border-radius:16px;padding:17px;gap:3.8px;box-shadow:0px 1px 3px 0px rgba(0,0,0,0.1),0px 1px 2px -1px rgba(0,0,0,0.1);"
          >
            <!-- Time badge -->
            <div style="display:inline-flex;align-self:flex-start;">
              <span
                style="font-size:12px;font-weight:700;color:#16a34a;line-height:16px;background:rgba(22,163,74,0.1);padding:4px 10px;border-radius:9999px;"
              >
                {{ b.startTime }} - {{ b.endTime }}
              </span>
            </div>
            <!-- Field name -->
            <p style="font-size:17px;font-weight:700;color:#0f172a;letter-spacing:-0.425px;line-height:25.5px;text-transform:uppercase;margin:0;">
              {{ fieldName(b.fieldId) }}
            </p>
            <!-- Client name -->
            <p style="font-size:14px;font-weight:500;color:#64748b;line-height:20px;margin:0;">
              {{ b.clientName }}
            </p>
          </div>
        </div>
      </section>

      <!-- Alerts -->
      <section class="flex flex-col" style="gap:16px;padding:0 24px;">
        <!-- Section header -->
        <div class="flex items-center" style="gap:8px;padding:0 4px;">
          <!-- Bell icon -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
            <path d="M8.55667 17.5C8.8544 18.0156 9.40459 18.3333 10 18.3333C10.5954 18.3333 11.1456 18.0156 11.4433 17.5M18.3333 6.66667C18.3333 4.75 17.6667 3.08333 16.6667 1.66667M2.71833 12.7717C2.49591 13.0155 2.4383 13.3675 2.57142 13.6695C2.70455 13.9715 3.00332 14.1664 3.33333 14.1667H16.6667C16.9966 14.1668 17.2956 13.9722 17.4291 13.6704C17.5626 13.3687 17.5054 13.0166 17.2833 12.7725C16.175 11.63 15 10.4158 15 6.66667C15 3.90709 12.7596 1.66667 10 1.66667C7.24042 1.66667 5 3.90709 5 6.66667C5 10.4158 3.82417 11.63 2.71833 12.7717M3.33333 1.66667C2.33333 3.08333 1.66667 4.75 1.66667 6.66667"
                  stroke="#F97316" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 style="font-size:18px;font-weight:700;color:#0f172a;line-height:28px;margin:0;">Ogohlantirishlar</h2>
        </div>

        <div v-if="alerts.length === 0" style="font-size:14px;color:#94a3b8;text-align:center;padding:16px 0;">
          Ogohlantirishlar yo'q
        </div>

        <div class="flex flex-col" style="gap:12px;">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="flex items-center"
            :style="alert.type === 'unpaid'
              ? 'background:rgba(249,115,22,0.05);border:1px solid rgba(249,115,22,0.2);border-radius:16px;padding:17px;gap:16px;'
              : 'background:white;border:1px solid rgba(226,232,240,0.5);border-radius:16px;padding:17px;gap:16px;opacity:0.6;'"
          >
            <!-- Icon box -->
            <div
              class="flex items-center justify-center flex-shrink-0"
              :style="alert.type === 'unpaid'
                ? 'width:48px;height:48px;border-radius:20px;background:rgba(249,115,22,0.1);'
                : 'width:48px;height:48px;border-radius:20px;background:#f1f5f9;'"
            >
              <!-- Wallet icon (unpaid) -->
              <svg v-if="alert.type === 'unpaid'" width="24" height="24" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 5V2C17 1.44808 16.5519 1 16 1H3C1.89617 1 1 1.89617 1 3C1 4.10383 1.89617 5 3 5H18C18.5519 5 19 5.44808 19 6V10H16C14.8962 10 14 10.8962 14 12C14 13.1038 14.8962 14 16 14H19C19.5519 14 20 13.5519 20 13V11C20 10.4481 19.5519 10 19 10"
                      stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 3V17C1 18.1038 1.89617 19 3 19H18C18.5519 19 19 18.5519 19 18V14"
                      stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <!-- Info icon -->
              <svg v-else width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11C1 16.5192 5.48085 21 11 21C16.5192 21 21 16.5192 21 11C21 5.48085 16.5192 1 11 1C5.48085 1 1 5.48085 1 11V11"
                      stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 15V11M11 7H11.01"
                      stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- Text content -->
            <div class="flex flex-col flex-1 min-w-0" style="gap:2px;">
              <div class="flex items-center justify-between w-full">
                <span style="font-size:16px;font-weight:700;color:#0f172a;line-height:24px;">{{ alert.title }}</span>
                <span
                  v-if="alert.time"
                  style="font-size:12px;font-weight:700;color:#f97316;line-height:16px;text-transform:uppercase;flex-shrink:0;margin-left:8px;"
                >{{ alert.time }}</span>
              </div>
              <p style="font-size:14px;font-weight:400;color:#64748b;line-height:20px;margin:0;">{{ alert.subtitle }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useStadiumsStore } from '../stores/stadiums'
import dayjs from 'dayjs'

const router = useRouter()
const auth = useAuthStore()
const bookingsStore = useBookingsStore()
const stadiumsStore = useStadiumsStore()

const today = dayjs().format('YYYY-MM-DD')
const now = dayjs().format('HH:mm')

const stadiumId = computed(() => stadiumsStore.activeStadiumId)
const revenue = computed(() => bookingsStore.todayRevenue(stadiumId.value))

const upcoming = computed(() => {
  if (!stadiumId.value) return []
  return bookingsStore.getForStadiumAndDate(stadiumId.value, today)
    .filter(b => b.endTime > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 5)
})

const alerts = computed(() => {
  const result: { id: string; type: string; title: string; subtitle: string; time?: string }[] = []
  bookingsStore.unpaidBookings
    .filter(b => b.stadiumId === stadiumId.value && b.date === today)
    .slice(0, 3)
    .forEach(b => result.push({
      id: b.id,
      type: 'unpaid',
      title: "To'lov qilinmagan",
      subtitle: `${b.clientName} (${fieldName(b.fieldId)}) — ${formatMoney(b.price)} so'm`,
      time: b.startTime,
    }))
  return result
})

function fieldName(fieldId: string) {
  const s = stadiumsStore.activeStadium
  return s?.fields.find(f => f.id === fieldId)?.name ?? fieldId
}
function formatMoney(n: number) {
  return n.toLocaleString('uz-UZ')
}
</script>
