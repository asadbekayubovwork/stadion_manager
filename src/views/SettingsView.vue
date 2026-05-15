<template>
  <div class="flex flex-col" style="background:#f8fafc; min-height:100%; font-family:'Inter',sans-serif;">

    <!-- ── HEADER ── -->
    <div
      style="background:linear-gradient(135deg,#16a34a 0%, #0d8c3a 100%);
             padding:14px 16px 20px; box-shadow:0 4px 16px rgba(22,163,74,0.25);"
    >
      <div style="font-size:18px; font-weight:900; color:#ffffff; margin-bottom:14px;">
        Sozlamalar
      </div>
      <div style="display:flex; align-items:center; gap:14px;">
        <div
          style="width:56px; height:56px; border-radius:16px;
                 background:rgba(255,255,255,0.2); border:2px solid rgba(255,255,255,0.3);
                 display:flex; align-items:center; justify-content:center; flex-shrink:0;"
        >
          <span style="font-size:22px; font-weight:900; color:#ffffff;">{{ userInitials }}</span>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:17px; font-weight:900; color:#ffffff;
                      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            {{ auth.user?.name || 'Foydalanuvchi' }}
          </div>
          <div style="font-size:13px; color:rgba(255,255,255,0.85); font-weight:500;
                      margin-top:2px; font-family:'Inter', sans-serif;">
            {{ auth.user?.phone || '—' }}
          </div>
          <div
            style="display:inline-flex; padding:3px 10px; border-radius:100px;
                   background:rgba(255,255,255,0.18); margin-top:6px;"
          >
            <span style="font-size:11px; color:#ffffff; font-weight:700;">
              {{ totalFields }} maydon · Pro tarif
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style="padding:16px;">

      <!-- MAYDONLAR -->
      <div style="font-size:11px; font-weight:700; color:#94a3b8;
                  text-transform:uppercase; letter-spacing:0.6px; margin:4px 0 10px 4px;">
        Maydonlar
      </div>
      <div
        style="background:#ffffff; border-radius:14px; overflow:hidden;
               box-shadow:0 2px 8px rgba(15,23,42,0.06); margin-bottom:18px;"
      >
        <div
          v-for="(f, i) in allFields"
          :key="f.id"
          @click="openEditField(f.stadiumId, f)"
          style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer;"
          :style="i < allFields.length ? 'border-bottom:1px solid #f1f5f9;' : ''"
        >
          <div
            style="width:36px; height:36px; border-radius:10px; background:#dcfce7;
                   display:flex; align-items:center; justify-content:center; flex-shrink:0;"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <line x1="12" y1="4" x2="12" y2="20"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:14px; font-weight:800; color:#0f172a;">{{ f.name }}</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:500;">
              {{ formatMoney(f.pricePerHour) }} so'm/soat
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <!-- Add field row -->
        <div
          @click="openAddField(activeStadiumId)"
          style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer;"
        >
          <div
            style="width:36px; height:36px; border-radius:10px;
                   background:#dcfce7; border:1.5px dashed #16a34a;
                   display:flex; align-items:center; justify-content:center; flex-shrink:0;"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight:800; color:#16a34a;">Maydon qo'shish</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:500;">Yangi maydon yaratish</div>
          </div>
        </div>
      </div>

      <!-- NARX VA VAQT -->
      <div style="font-size:11px; font-weight:700; color:#94a3b8;
                  text-transform:uppercase; letter-spacing:0.6px; margin:4px 0 10px 4px;">
        Narx va vaqt
      </div>
      <div
        style="background:#ffffff; border-radius:14px; overflow:hidden;
               box-shadow:0 2px 8px rgba(15,23,42,0.06); margin-bottom:18px;"
      >
        <div
          @click="openPriceModal"
          style="display:flex; align-items:center; gap:12px; padding:14px 16px;
                 border-bottom:1px solid #f1f5f9; cursor:pointer;"
        >
          <div
            style="width:36px; height:36px; border-radius:10px; background:#fff7ed;
                   display:flex; align-items:center; justify-content:center; flex-shrink:0;"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight:800; color:#0f172a;">Soatlik narx</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:500;">
              {{ avgPriceLabel }}
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>

        <div
          @click="openEditStadium(activeStadium)"
          style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer;"
        >
          <div
            style="width:36px; height:36px; border-radius:10px; background:#eff6ff;
                   display:flex; align-items:center; justify-content:center; flex-shrink:0;"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight:800; color:#0f172a;">Ish vaqti</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:500;
                        font-family:'Inter', sans-serif;">
              {{ workHoursLabel }}
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      <!-- TIZIM -->
      <div style="font-size:11px; font-weight:700; color:#94a3b8;
                  text-transform:uppercase; letter-spacing:0.6px; margin:4px 0 10px 4px;">
        Tizim
      </div>
      <div
        style="background:#ffffff; border-radius:14px; overflow:hidden;
               box-shadow:0 2px 8px rgba(15,23,42,0.06); margin-bottom:18px;"
      >
        <div
          @click="langModalOpen = true"
          style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer;"
        >
          <div
            style="width:36px; height:36px; border-radius:10px; background:#f1f5f9;
                   display:flex; align-items:center; justify-content:center; flex-shrink:0;"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:14px; font-weight:800; color:#0f172a;">Til</div>
            <div style="font-size:12px; color:#94a3b8; font-weight:500;">{{ langLabel }}</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      <!-- Logout -->
      <button
        @click="logout"
        style="width:100%; padding:14px; border-radius:14px;
               background:#ffffff; border:1.5px solid #fee2e2; cursor:pointer;
               display:flex; align-items:center; justify-content:center; gap:8px;"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span style="font-size:14px; font-weight:800; color:#ef4444;">Chiqish</span>
      </button>
    </div>

    <!-- Stadium modal -->
    <Teleport to="body">
      <Transition name="sheet" appear>
        <div v-if="stadiumModal" class="fixed inset-0 z-50 flex items-end" style="background:rgba(15,23,42,0.4);"
             @click.self="stadiumModal = null">
          <div
            class="sheet-content w-full mx-auto"
            style="max-width:480px; background:#ffffff; border-radius:24px 24px 0 0;
                   box-shadow:0 -8px 32px rgba(0,0,0,0.2); padding:20px 20px 32px;
                   font-family:'Inter', sans-serif;"
          >
          <div style="width:40px; height:4px; border-radius:2px; background:#e2e8f0;
                      margin:0 auto 16px;" />
          <div style="font-size:17px; font-weight:900; color:#0f172a; margin-bottom:16px;">
            Ish vaqti
          </div>
          <div style="display:flex; gap:12px;">
            <div style="flex:1;">
              <div style="font-size:11px; font-weight:700; color:#94a3b8;
                          text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                Boshlanish
              </div>
              <input
                v-model.number="stadiumModal.workStart"
                type="number" min="0" max="23"
                style="width:100%; height:48px; border-radius:12px; border:1.5px solid #e2e8f0;
                       padding:0 14px; outline:none; font-size:16px; font-weight:800; color:#0f172a;
                       font-family:'Inter', sans-serif;"
              />
            </div>
            <div style="flex:1;">
              <div style="font-size:11px; font-weight:700; color:#94a3b8;
                          text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                Tugash
              </div>
              <input
                v-model.number="stadiumModal.workEnd"
                type="number" min="1" max="24"
                style="width:100%; height:48px; border-radius:12px; border:1.5px solid #e2e8f0;
                       padding:0 14px; outline:none; font-size:16px; font-weight:800; color:#0f172a;
                       font-family:'Inter', sans-serif;"
              />
            </div>
          </div>
          <button
            @click="saveStadium"
            style="width:100%; height:52px; border-radius:14px; background:#16a34a;
                   color:#ffffff; font-size:15px; font-weight:800; border:none;
                   margin-top:16px; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3);"
          >
            Saqlash
          </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Field modal -->
    <Teleport to="body">
      <Transition name="sheet" appear>
        <div v-if="fieldModal" class="fixed inset-0 z-50 flex items-end" style="background:rgba(15,23,42,0.4);"
             @click.self="fieldModal = null">
          <div
            class="sheet-content w-full mx-auto"
            style="max-width:480px; background:#ffffff; border-radius:24px 24px 0 0;
                   box-shadow:0 -8px 32px rgba(0,0,0,0.2); padding:20px 20px 32px;
                   font-family:'Inter', sans-serif;"
          >
          <div style="width:40px; height:4px; border-radius:2px; background:#e2e8f0;
                      margin:0 auto 16px;" />
          <div style="font-size:17px; font-weight:900; color:#0f172a; margin-bottom:16px;">
            {{ fieldModal.id ? 'Maydonni tahrirlash' : 'Maydon qo\'shish' }}
          </div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div>
              <div style="font-size:11px; font-weight:700; color:#94a3b8;
                          text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                Nomi
              </div>
              <input
                v-model="fieldModal.name"
                type="text"
                placeholder="Maydon 1"
                style="width:100%; height:48px; border-radius:12px; border:1.5px solid #e2e8f0;
                       padding:0 14px; outline:none; font-size:15px; font-weight:600; color:#0f172a;"
              />
            </div>
            <div>
              <div style="font-size:11px; font-weight:700; color:#94a3b8;
                          text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                Soatlik narx (so'm)
              </div>
              <input
                v-model.number="fieldModal.pricePerHour"
                type="number"
                style="width:100%; height:48px; border-radius:12px; border:1.5px solid #e2e8f0;
                       padding:0 14px; outline:none; font-size:15px; font-weight:600; color:#0f172a;
                       font-family:'Inter', sans-serif;"
              />
            </div>
          </div>
          <div style="display:flex; gap:10px; margin-top:16px;">
            <button
              v-if="fieldModal.id"
              @click="deleteField(fieldModal.stadiumId, fieldModal.id)"
              style="flex:1; height:52px; border-radius:14px; background:#fee2e2;
                     color:#ef4444; font-size:15px; font-weight:800; border:none; cursor:pointer;"
            >
              O'chirish
            </button>
            <button
              @click="saveField"
              style="flex:2; height:52px; border-radius:14px; background:#16a34a;
                     color:#ffffff; font-size:15px; font-weight:800; border:none; cursor:pointer;
                     box-shadow:0 4px 12px rgba(22,163,74,0.3);"
            >
              Saqlash
            </button>
          </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Language modal -->
    <Teleport to="body">
      <Transition name="sheet" appear>
        <div v-if="langModalOpen" class="fixed inset-0 z-50 flex items-end" style="background:rgba(15,23,42,0.4);"
             @click.self="langModalOpen = false">
          <div
            class="sheet-content w-full mx-auto"
            style="max-width:480px; background:#ffffff; border-radius:24px 24px 0 0;
                   box-shadow:0 -8px 32px rgba(0,0,0,0.2); padding:20px 20px 32px;
                   font-family:'Inter', sans-serif;"
          >
          <div style="width:40px; height:4px; border-radius:2px; background:#e2e8f0;
                      margin:0 auto 16px;" />
          <div style="font-size:17px; font-weight:900; color:#0f172a; margin-bottom:16px;">Til</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button
              v-for="lang in langs"
              :key="lang.key"
              @click="setLang(lang.key); langModalOpen = false"
              :style="currentLang === lang.key
                ? 'padding:14px 16px; border-radius:12px; border:1.5px solid #16a34a; background:#dcfce7; color:#14532d; font-size:15px; font-weight:800; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between;'
                : 'padding:14px 16px; border-radius:12px; border:1.5px solid #e2e8f0; background:#ffffff; color:#0f172a; font-size:15px; font-weight:600; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between;'"
            >
              {{ lang.label }}
              <svg v-if="currentLang === lang.key" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStadiumsStore } from '../stores/stadiums'
import { useAuthStore } from '../stores/auth'
import { useBookingsStore } from '../stores/bookings'
import { useClientsStore } from '../stores/clients'
import type { Field } from '../types'

const { locale } = useI18n()
const router = useRouter()
const stadiumsStore = useStadiumsStore()
const auth = useAuthStore()
const bookingsStore = useBookingsStore()
const clientsStore = useClientsStore()

onMounted(() => {
  if (!stadiumsStore.loaded) stadiumsStore.loadAll().catch(() => {})
})

const langs = [
  { key: 'uz', label: "O'zbek (lotin)" },
  { key: 'ru', label: 'Русский' },
  { key: 'en', label: 'English' },
]
const currentLang = computed(() => locale.value)
const langLabel = computed(() => langs.find(l => l.key === currentLang.value)?.label || 'O\'zbek')
const langModalOpen = ref(false)

function setLang(lang: string) {
  locale.value = lang as any
  localStorage.setItem('sm_lang', lang)
  stadiumsStore.updateStadiumSettings({ language: lang }).catch(() => {})
}

const userInitials = computed(() => {
  const name = auth.user?.name?.trim() || ''
  if (!name) return 'A'
  const parts = name.split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

const activeStadium = computed(() => stadiumsStore.activeStadium)
const activeStadiumId = computed(() => stadiumsStore.activeStadiumId)

const allFields = computed<(Field & { stadiumId: number })[]>(() =>
  stadiumsStore.stadiums.flatMap(s =>
    s.fields.map(f => ({ ...f, stadiumId: s.id }))
  )
)

const totalFields = computed(() => allFields.value.length)

const avgPriceLabel = computed(() => {
  if (allFields.value.length === 0) return 'O\'rnatilmagan'
  const avg = Math.round(
    allFields.value.reduce((sum, f) => sum + f.pricePerHour, 0) / allFields.value.length
  )
  return `${formatMoney(avg)} so'm/soat`
})

const workHoursLabel = computed(() => {
  const s = activeStadium.value
  if (!s) return '—'
  return `${String(s.workStart).padStart(2, '0')}:00 — ${String(s.workEnd).padStart(2, '0')}:00`
})

function formatMoney(n: number) { return n.toLocaleString('uz-UZ').replace(/,/g, ' ') }

// Stadium modal
interface StadiumForm { id?: number; name: string; workStart: number; workEnd: number }
const stadiumModal = ref<StadiumForm | null>(null)
const savingStadium = ref(false)
function openEditStadium(s: { id: number; name: string; workStart: number; workEnd: number } | null | undefined) {
  if (!s) return
  stadiumModal.value = { id: s.id, name: s.name, workStart: s.workStart, workEnd: s.workEnd }
}
async function saveStadium() {
  if (!stadiumModal.value) return
  savingStadium.value = true
  try {
    await stadiumsStore.updateStadiumSettings({
      name: stadiumModal.value.name,
      workStartHour: stadiumModal.value.workStart,
      workEndHour: stadiumModal.value.workEnd,
    })
    stadiumModal.value = null
  } catch (e: any) {
    alert(e?.message || 'Saqlashda xato')
  } finally {
    savingStadium.value = false
  }
}

// Field modal
interface FieldForm { id?: number; stadiumId: number; name: string; pricePerHour: number }
const fieldModal = ref<FieldForm | null>(null)
const savingField = ref(false)
function openAddField(stadiumId: number | string) {
  fieldModal.value = { stadiumId: Number(stadiumId) || 1, name: '', pricePerHour: 200000 }
}
function openEditField(stadiumId: number | string, f: Field) {
  fieldModal.value = { id: f.id, stadiumId: Number(stadiumId) || 1, name: f.name, pricePerHour: f.pricePerHour }
}
async function saveField() {
  if (!fieldModal.value?.name) return
  savingField.value = true
  try {
    if (fieldModal.value.id) {
      await stadiumsStore.updateField(fieldModal.value.stadiumId, fieldModal.value.id, {
        name: fieldModal.value.name,
        pricePerHour: fieldModal.value.pricePerHour,
      })
    } else {
      await stadiumsStore.addField(fieldModal.value.stadiumId, fieldModal.value.name, fieldModal.value.pricePerHour)
    }
    fieldModal.value = null
  } catch (e: any) {
    alert(e?.message || 'Saqlashda xato')
  } finally {
    savingField.value = false
  }
}
async function deleteField(stadiumId: number | string, fieldId: number) {
  if (!confirm("Maydonni o'chirishni tasdiqlaysizmi?")) return
  try {
    await stadiumsStore.deleteField(Number(stadiumId) || 1, fieldId)
    fieldModal.value = null
  } catch (e: any) {
    alert(e?.message || "O'chirishda xato")
  }
}

function openPriceModal() {
  // Open the first field's editor as a shortcut, or the active field
  const f = allFields.value[0]
  if (f) openEditField(f.stadiumId, f)
}

function logout() {
  if (confirm('Tizimdan chiqishni tasdiqlaysizmi?')) {
    auth.logout()
    stadiumsStore.reset()
    bookingsStore.reset()
    clientsStore.reset()
    router.push({ name: 'login' })
  }
}
</script>
