<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end" @click.self="$emit('close')">
      <div class="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[92dvh]">
        <!-- Handle + header -->
        <div class="flex-shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
          <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">{{ isEdit ? t('booking.edit') : t('booking.new') }}</h2>
            <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Form -->
        <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <!-- Client name -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.clientName') }}</label>
            <input
              v-model="form.clientName"
              type="text"
              class="w-full border-2 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors"
              :class="form.clientName ? 'border-brand' : 'border-gray-200'"
              :placeholder="t('booking.clientName')"
            />
          </div>

          <!-- Client phone -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.clientPhone') }}</label>
            <div class="flex items-center border-2 rounded-xl px-4 py-3 gap-2 transition-colors"
              :class="form.clientPhone ? 'border-brand' : 'border-gray-200'">
              <span class="text-base">🇺🇿</span>
              <span class="text-sm font-semibold text-gray-600">+998</span>
              <input
                v-model="form.clientPhone"
                type="tel"
                inputmode="numeric"
                maxlength="12"
                class="flex-1 outline-none text-sm font-medium text-gray-900 bg-transparent placeholder-gray-400"
                placeholder="99 123 45 67"
              />
            </div>
          </div>

          <!-- Field + Date row -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.field') }}</label>
              <select
                v-model="form.fieldId"
                class="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-medium outline-none bg-white"
                @change="onFieldChange"
              >
                <option v-for="f in fields" :key="f.id" :value="f.id">{{ f.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.date') }}</label>
              <input
                v-model="form.date"
                type="date"
                class="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <!-- Start time -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.startTime') }}</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="slot in timeSlots"
                :key="slot"
                @click="form.startTime = slot"
                class="py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                :class="form.startTime === slot ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-600'"
              >
                {{ slot }}
              </button>
            </div>
            <input
              v-model="form.startTime"
              type="time"
              class="mt-2 w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
            />
          </div>

          <!-- Duration chips -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.duration') }}</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="d in durations"
                :key="d.value"
                @click="selectDuration(d.value)"
                class="flex-1 min-w-[4rem] py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                :class="form.durationMin === d.value ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-600'"
              >
                {{ d.label }}
              </button>
            </div>
          </div>

          <!-- Price -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              {{ t('booking.price') }}
              <span class="text-brand normal-case font-normal ml-1">{{ t('booking.priceAuto') }}</span>
            </label>
            <div class="flex items-center border-2 rounded-xl px-4 py-3 gap-2 border-gray-200">
              <input
                v-model.number="form.price"
                type="number"
                inputmode="numeric"
                class="flex-1 outline-none text-sm font-bold text-gray-900 bg-transparent"
                placeholder="0"
              />
              <span class="text-sm text-gray-400 font-medium">so'm</span>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{{ t('booking.notes') }}</label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none"
              :placeholder="t('booking.notes')"
            />
          </div>

          <!-- Conflict warning -->
          <div v-if="conflict" class="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span class="text-sm font-semibold">{{ t('schedule.conflict') }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-shrink-0 px-5 pb-6 pt-3 border-t border-gray-100">
          <button
            @click="save"
            :disabled="!canSave || conflict"
            class="w-full py-4 rounded-2xl font-bold text-white text-base transition-all"
            :class="canSave && !conflict ? 'bg-brand shadow-lg shadow-brand/30 active:scale-95' : 'bg-gray-200 text-gray-400'"
          >
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStadiumsStore } from '../../stores/stadiums'
import { useBookingsStore } from '../../stores/bookings'
import { useClientsStore } from '../../stores/clients'
import type { Booking } from '../../types'
import dayjs from 'dayjs'

const props = defineProps<{
  booking?: Booking | null
  defaultDate?: string
  defaultTime?: string
  fieldId?: string
}>()
const emit = defineEmits<{ close: []; saved: [] }>()

const { t } = useI18n()
const stadiumsStore = useStadiumsStore()
const bookingsStore = useBookingsStore()
const clientsStore = useClientsStore()

const isEdit = computed(() => !!props.booking)
const fields = computed(() => stadiumsStore.activeStadium?.fields ?? [])

const durations = [
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
  { value: 90, label: '1.5h' },
  { value: 120, label: '2h' },
]

// Time slots for quick pick (every 30 min from work start to work end)
const timeSlots = computed(() => {
  const slots: string[] = []
  const ws = stadiumsStore.activeStadium?.workStart ?? 6
  const we = stadiumsStore.activeStadium?.workEnd ?? 24
  for (let h = ws; h < we; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots.slice(0, 8) // show just first 8 for space
})

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
  startTime: props.defaultTime ?? `${String((stadiumsStore.activeStadium?.workStart ?? 6) + 12).padStart(2, '0')}:00`,
  durationMin: 60,
  price: 0,
  notes: '',
})

onMounted(() => {
  if (props.booking) {
    const b = props.booking
    form.value = {
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      fieldId: b.fieldId,
      date: b.date,
      startTime: b.startTime,
      durationMin: b.durationMin,
      price: b.price,
      notes: b.notes ?? '',
    }
  }
  autoPrice()
})

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const endTime = computed(() => addMinutes(form.value.startTime, form.value.durationMin))

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
  !!form.value.clientName && !!form.value.fieldId && !!form.value.date && !!form.value.startTime
)

function onFieldChange() { autoPrice() }
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

function save() {
  if (!canSave.value || conflict.value) return
  const client = clientsStore.upsert(form.value.clientName, form.value.clientPhone || 'unknown')
  const stadiumId = stadiumsStore.activeStadiumId

  if (isEdit.value && props.booking) {
    bookingsStore.updateBooking(props.booking.id, {
      clientId: client.id,
      clientName: form.value.clientName,
      clientPhone: form.value.clientPhone,
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
      clientName: form.value.clientName,
      clientPhone: form.value.clientPhone,
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
