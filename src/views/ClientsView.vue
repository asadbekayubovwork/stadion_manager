<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div
      style="background:#ffffff; border-bottom:1px solid #e2e8f0; padding:14px 16px;
             display:flex; align-items:center; justify-content:space-between;"
    >
      <div style="font-size:22px; font-weight:900; color:#0f172a;">Mijozlar</div>
      <div
        style="background:#dcfce7; padding:4px 12px; border-radius:100px;
               display:flex; align-items:center; gap:4px;"
      >
        <span style="font-size:14px; font-weight:800; color:#14532d;
                     font-family:'Inter', sans-serif;">{{ totalClients }}</span>
        <span style="font-size:11px; color:#16a34a; font-weight:600;">jami</span>
      </div>
    </div>

    <div style="padding:14px 16px 16px;">
      <!-- Search -->
      <div
        style="background:#ffffff; border-radius:14px; padding:12px 14px;
               display:flex; align-items:center; gap:10px;
               border:1px solid #e2e8f0; box-shadow:0 1px 2px rgba(15,23,42,0.04);"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="Ism yoki telefon bo'yicha..."
          style="flex:1; outline:none; background:transparent; border:none;
                 font-size:14px; font-weight:500; color:#0f172a; min-width:0;"
        />
      </div>

      <!-- Section header -->
      <div
        style="font-size:11px; font-weight:700; color:#94a3b8;
               text-transform:uppercase; letter-spacing:0.6px; margin:18px 0 10px;"
      >
        Ko'p qaytuvchi mijozlar
      </div>

      <!-- Client list -->
      <div v-if="enriched.length === 0"
           style="text-align:center; padding:40px 0; color:#94a3b8; font-size:14px;">
        Mijozlar yo'q
      </div>

      <div v-else style="display:flex; flex-direction:column; gap:10px;">
        <div
          v-for="c in enriched"
          :key="c.id"
          @click="router.push('/clients/' + c.id)"
          style="background:#ffffff; border-radius:14px; padding:12px 14px;
                 display:flex; align-items:center; gap:12px; cursor:pointer;
                 box-shadow:0 1px 4px rgba(15,23,42,0.06);"
        >
          <!-- Avatar -->
          <div
            :style="`width:44px; height:44px; border-radius:9999px;
                     background:${c.color}; display:flex; align-items:center;
                     justify-content:center; flex-shrink:0;`"
          >
            <span style="font-size:14px; font-weight:800; color:#ffffff;">{{ c.initials }}</span>
          </div>

          <!-- Name + phone -->
          <div style="flex:1; min-width:0;">
            <div style="font-size:14px; font-weight:800; color:#0f172a;
                        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              {{ c.name }}
            </div>
            <div style="font-size:12px; color:#475569; font-weight:500; margin-top:2px;
                        font-family:'Inter', sans-serif;">
              {{ c.phone }}
            </div>
          </div>

          <!-- Stats -->
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-size:14px; font-weight:800; color:#16a34a;
                        font-family:'Inter', sans-serif;">
              {{ formatMoney(c.totalSpent) }}
            </div>
            <div style="font-size:11px; color:#94a3b8; font-weight:600; margin-top:2px;">
              {{ c.visits }} tashrif
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '../stores/clients'
import { useBookingsStore } from '../stores/bookings'

const router = useRouter()
const clientsStore = useClientsStore()
const bookingsStore = useBookingsStore()
const query = ref('')

const AVATAR_COLORS = ['#16a34a', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#0ea5e9', '#14b8a6', '#f59e0b']

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function formatMoney(n: number) { return n.toLocaleString('uz-UZ').replace(/,/g, ' ') }

const enrichedAll = computed(() =>
  clientsStore.clients.map(c => {
    const bookings = bookingsStore.getForClient(c.id)
    const paid = bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'active')
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      initials: getInitials(c.name),
      color: colorFor(c.name),
      visits: bookings.filter(b => b.status === 'active').length,
      totalSpent: paid.reduce((sum, b) => sum + b.price, 0),
    }
  }).sort((a, b) => b.totalSpent - a.totalSpent)
)

const enriched = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return enrichedAll.value
  return enrichedAll.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(q)
  )
})

const totalClients = computed(() => enrichedAll.value.length)
</script>
