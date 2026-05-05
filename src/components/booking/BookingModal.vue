<template>
  <Teleport to="body">
    <Transition name="sheet" appear>
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end"
        style="background:rgba(15,23,42,0.4); font-family:'Inter', sans-serif;"
        @click.self="$emit('close')"
      >
        <div
          class="sheet-content w-full mx-auto flex flex-col"
          style="max-width:480px; background:#f8fafc; border-radius:24px 24px 0 0;
                 box-shadow:0 -8px 32px rgba(0,0,0,0.2); max-height:94dvh;"
        >
        <!-- ── HEADER ── -->
        <div
          style="background:#ffffff; border-bottom:1px solid #e2e8f0;
                 padding:12px 16px; display:flex; align-items:center; gap:12px;
                 border-radius:24px 24px 0 0; flex-shrink:0;"
        >
          <button
            @click="$emit('close')"
            style="width:36px; height:36px; border-radius:10px; background:#f1f5f9;
                   display:flex; align-items:center; justify-content:center;
                   border:none; cursor:pointer;"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style="flex:1; min-width:0;">
            <div style="font-size:17px; font-weight:900; color:#0f172a;">
              {{ isEdit ? 'Bronni tahrirlash' : 'Yangi bron' }}
            </div>
            <div style="font-size:12px; color:#475569; font-weight:500;
                        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              {{ fieldName }} · {{ dateLabel }}
            </div>
          </div>
          <button
            @click="$emit('close')"
            style="background:none; border:none; cursor:pointer; padding:0;
                   font-size:13px; color:#94a3b8; font-weight:600;"
          >
            Bekor
          </button>
        </div>

        <!-- ── BODY ── -->
        <div style="flex:1; overflow-y:auto; padding:16px;">

          <!-- Time slot info card -->
          <div
            style="background:linear-gradient(135deg,#16a34a 0%, #0d8c3a 100%);
                   border-radius:16px; padding:14px 16px; margin-bottom:20px;
                   display:flex; justify-content:space-between; align-items:center;
                   box-shadow:0 4px 16px rgba(22,163,74,0.25);"
          >
            <div>
              <div style="font-size:11px; color:rgba(255,255,255,0.75); font-weight:600;
                          text-transform:uppercase; letter-spacing:0.5px;">
                Tanlangan vaqt
              </div>
              <div style="font-size:28px; font-weight:900; color:#ffffff;
                          font-family:'Inter', sans-serif; margin-top:2px;">
                {{ form.startTime }}–{{ endTime }}
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px; color:rgba(255,255,255,0.75); font-weight:600;">
                Davomiyligi
              </div>
              <div style="font-size:22px; font-weight:900; color:#ffffff;">
                {{ durationLabel }}
              </div>
            </div>
          </div>

          <!-- Form -->
          <div style="display:flex; flex-direction:column; gap:12px;">

            <!-- Field selector (only if more than 1) -->
            <div v-if="fields.length > 1">
              <div :class="'lbl'">Maydon</div>
              <div style="display:flex; gap:8px;">
                <button
                  v-for="f in fields"
                  :key="f.id"
                  @click="form.fieldId = f.id; autoPrice()"
                  :style="form.fieldId === f.id
                    ? 'flex:1; height:44px; border-radius:10px; background:#16a34a; border:none; cursor:pointer; font-size:13px; font-weight:800; color:#ffffff;'
                    : 'flex:1; height:44px; border-radius:10px; background:#f1f5f9; border:none; cursor:pointer; font-size:13px; font-weight:700; color:#475569;'"
                >{{ f.name }}</button>
              </div>
            </div>

            <!-- Client name -->
            <div>
              <div :class="'lbl'">Mijoz</div>
              <div :style="inputBox(form.clientName)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     :stroke="form.clientName ? '#16a34a' : '#94a3b8'"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  v-model="form.clientName"
                  type="text"
                  placeholder="Mijoz ismi"
                  style="flex:1; outline:none; border:none; background:transparent;
                         font-size:16px; font-weight:700; color:#0f172a; min-width:0;"
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <div :class="'lbl'">Telefon</div>
              <div :style="inputBox(false)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.16 1.18 2 2 0 012.13 0H5.1a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span style="font-size:14px; color:#0f172a; font-weight:600;
                             font-family:'Inter', sans-serif; flex-shrink:0;">+998</span>
                <input
                  v-model="form.clientPhone"
                  type="tel"
                  inputmode="numeric"
                  placeholder="90 123 45 67"
                  style="flex:1; outline:none; border:none; background:transparent;
                         font-size:14px; font-weight:600; color:#0f172a;
                         font-family:'Inter', sans-serif; min-width:0;"
                />
              </div>
            </div>

            <!-- Date -->
            <div>
              <div :class="'lbl'">Sana</div>
              <div :style="inputBox(false)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input
                  v-model="form.date"
                  type="date"
                  style="flex:1; outline:none; border:none; background:transparent;
                         font-size:14px; font-weight:700; color:#0f172a;
                         font-family:'Inter', sans-serif; min-width:0;"
                />
              </div>
            </div>

            <!-- Time row -->
            <div style="display:flex; gap:10px;">
              <div style="flex:1;">
                <div :class="'lbl'">Boshlanish</div>
                <div :style="inputBox(false, true)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <input
                    v-model="form.startTime"
                    type="time"
                    style="flex:1; outline:none; border:none; background:transparent;
                           font-size:16px; font-weight:800; color:#0f172a;
                           font-family:'Inter', sans-serif; min-width:0; text-align:center;"
                  />
                </div>
              </div>
              <div style="flex:1;">
                <div :class="'lbl'">Tugash</div>
                <div :style="inputBox(false, true)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style="font-size:16px; font-weight:800; color:#0f172a;
                               font-family:'Inter', sans-serif;">{{ endTime }}</span>
                </div>
              </div>
            </div>

            <!-- Duration chips -->
            <div>
              <div :class="'lbl'">Davomiyligi</div>
              <div style="display:flex; gap:8px;">
                <button
                  v-for="d in durations"
                  :key="d.value"
                  @click="selectDuration(d.value)"
                  :style="form.durationMin === d.value
                    ? 'flex:1; height:44px; border-radius:10px; background:#16a34a; border:none; cursor:pointer; font-size:13px; font-weight:800; color:#ffffff;'
                    : 'flex:1; height:44px; border-radius:10px; background:#f1f5f9; border:none; cursor:pointer; font-size:13px; font-weight:700; color:#475569;'"
                >{{ d.label }}</button>
              </div>
            </div>

            <!-- Price -->
            <div>
              <div :class="'lbl'">Narx</div>
              <div :style="inputBox(false)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
                <input
                  v-model.number="form.price"
                  type="number"
                  inputmode="numeric"
                  style="flex:1; outline:none; border:none; background:transparent;
                         font-size:18px; font-weight:900; color:#0f172a;
                         font-family:'Inter', sans-serif; min-width:0;"
                />
                <span style="font-size:13px; color:#94a3b8; font-weight:600; flex-shrink:0;">so'm</span>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <div :class="'lbl'">Izoh (ixtiyoriy)</div>
              <textarea
                v-model="form.notes"
                rows="2"
                placeholder="Izoh yozing..."
                style="width:100%; background:#ffffff; border-radius:12px;
                       border:1.5px solid #e2e8f0; padding:12px 14px;
                       outline:none; resize:none; font-family:'Inter', sans-serif;
                       font-size:14px; font-weight:500; color:#0f172a;"
              />
            </div>

            <!-- Conflict warning -->
            <div
              v-if="conflict"
              style="display:flex; align-items:center; gap:8px;
                     background:#fee2e2; border-radius:12px; padding:12px 14px;
                     color:#dc2626;"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style="font-size:13px; font-weight:700;">Bu vaqt band!</span>
            </div>
          </div>
        </div>

        <!-- ── FOOTER ── -->
        <div
          style="background:#ffffff; border-top:1px solid #e2e8f0; padding:12px 16px;
                 padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); flex-shrink:0;"
        >
          <button
            @click="save"
            :disabled="!canSave || conflict"
            :style="canSave && !conflict
              ? 'width:100%; height:56px; border-radius:14px; background:#16a34a; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 16px rgba(22,163,74,0.33);'
              : 'width:100%; height:56px; border-radius:14px; background:#e2e8f0; border:none; cursor:not-allowed; display:flex; align-items:center; justify-content:center; gap:8px;'"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 :stroke="canSave && !conflict ? '#ffffff' : '#94a3b8'"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span :style="canSave && !conflict
              ? 'font-size:17px; font-weight:900; color:#ffffff;'
              : 'font-size:17px; font-weight:900; color:#94a3b8;'">
              Bronni saqlash
            </span>
          </button>
        </div>
      </div>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useStadiumsStore } from '../../stores/stadiums'
import { useBookingsStore } from '../../stores/bookings'
import { useClientsStore } from '../../stores/clients'
import type { Booking } from '../../types'
import dayjs from 'dayjs'

const props = defineProps<{
  show: boolean
  booking?: Booking | null
  defaultDate?: string
  defaultTime?: string
  fieldId?: string
}>()
const emit = defineEmits<{ close: []; saved: [] }>()

const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()
const clientsStore = useClientsStore()

const isEdit = computed(() => !!props.booking)
const fields = computed(() => stadiumsStore.activeStadium?.fields ?? [])

const durations = [
  { value: 30, label: '30 daq' },
  { value: 60, label: '1 soat' },
  { value: 90, label: '1.5 soat' },
  { value: 120, label: '2 soat' },
]

interface Form {
  clientName: string
  clientPhone: string
  fieldId: string
  date: string
  startTime: string
  durationMin: number
  price: number
  notes: string
}

const form = ref<Form>({
  clientName: '',
  clientPhone: '',
  fieldId: props.fieldId ?? fields.value[0]?.id ?? '',
  date: props.defaultDate ?? dayjs().format('YYYY-MM-DD'),
  startTime: props.defaultTime || `${String((stadiumsStore.activeStadium?.workStart ?? 6) + 12).padStart(2, '0')}:00`,
  durationMin: 60,
  price: 0,
  notes: '',
})

function resetForm() {
  if (props.booking) {
    const b = props.booking
    form.value = {
      clientName: b.clientName,
      clientPhone: b.clientPhone.replace(/^\+998\s*/, ''),
      fieldId: b.fieldId,
      date: b.date,
      startTime: b.startTime,
      durationMin: b.durationMin,
      price: b.price,
      notes: b.notes ?? '',
    }
  } else {
    form.value = {
      clientName: '',
      clientPhone: '',
      fieldId: props.fieldId ?? fields.value[0]?.id ?? '',
      date: props.defaultDate ?? dayjs().format('YYYY-MM-DD'),
      startTime: props.defaultTime || `${String((stadiumsStore.activeStadium?.workStart ?? 6) + 12).padStart(2, '0')}:00`,
      durationMin: 60,
      price: 0,
      notes: '',
    }
  }
  autoPrice()
}

onMounted(resetForm)
watch(() => props.show, (open) => { if (open) resetForm() })

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const endTime = computed(() => addMinutes(form.value.startTime, form.value.durationMin))

const fieldName = computed(() =>
  fields.value.find(f => f.id === form.value.fieldId)?.name ?? '—'
)

const MONTHS_UZ_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']
const dateLabel = computed(() => {
  const d = dayjs(form.value.date)
  return `${d.date()} ${MONTHS_UZ_SHORT[d.month()]}`
})

const durationLabel = computed(() => {
  const m = form.value.durationMin
  if (m < 60) return `${m} daq`
  const h = m / 60
  return Number.isInteger(h) ? `${h} soat` : `${h} soat`
})

const conflict = computed(() => {
  if (!form.value.fieldId || !form.value.date || !form.value.startTime) return false
  return bookingsStore.hasConflict(
    form.value.fieldId,
    form.value.date,
    form.value.startTime,
    endTime.value,
    props.booking?.id,
  )
})

const canSave = computed(() =>
  !!form.value.clientName.trim() && !!form.value.fieldId && !!form.value.date && !!form.value.startTime
)

function selectDuration(mins: number) {
  form.value.durationMin = mins
  autoPrice()
}

function autoPrice() {
  const field = fields.value.find(f => f.id === form.value.fieldId)
  if (field) {
    form.value.price = Math.round((field.pricePerHour * form.value.durationMin) / 60)
  }
}

watch(() => [form.value.fieldId, form.value.durationMin], autoPrice)

function inputBox(active: any, center = false) {
  const isActive = !!active
  return `background:#ffffff; border-radius:12px;
          border:1.5px solid ${isActive ? '#16a34a' : '#e2e8f0'};
          padding:0 14px; height:52px; display:flex; align-items:center; gap:10px;
          ${center ? 'justify-content:center;' : ''}`
}

function save() {
  if (!canSave.value || conflict.value) return
  const phone = form.value.clientPhone.trim()
    ? '+998' + form.value.clientPhone.replace(/\s+/g, '')
    : 'unknown'
  const client = clientsStore.upsert(form.value.clientName.trim(), phone)
  const stadiumId = stadiumsStore.activeStadiumId

  if (isEdit.value && props.booking) {
    bookingsStore.updateBooking(props.booking.id, {
      clientId: client.id,
      clientName: form.value.clientName.trim(),
      clientPhone: phone,
      fieldId: form.value.fieldId,
      stadiumId,
      date: form.value.date,
      startTime: form.value.startTime,
      endTime: endTime.value,
      durationMin: form.value.durationMin,
      price: form.value.price,
      notes: form.value.notes,
    })
  } else {
    bookingsStore.addBooking({
      clientId: client.id,
      clientName: form.value.clientName.trim(),
      clientPhone: phone,
      fieldId: form.value.fieldId,
      stadiumId,
      date: form.value.date,
      startTime: form.value.startTime,
      endTime: endTime.value,
      durationMin: form.value.durationMin,
      price: form.value.price,
      paymentStatus: 'unpaid',
      status: 'active',
      notes: form.value.notes,
    })
  }
  emit('saved')
}
</script>

<style scoped>
.lbl {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
</style>
