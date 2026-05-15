import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Field, Settings } from '../types'
import * as settingsApi from '../api/settings'
import * as fieldsApi from '../api/fields'

const ACTIVE_FIELD_KEY = 'sm_active_field'

const FIELD_COLORS = ['#16a34a', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#0d9488']

function withColor(f: Field, i: number): Field {
  return { ...f, color: f.color || FIELD_COLORS[i % FIELD_COLORS.length] }
}

// Backwards-compatible facade: the single stadium from /settings + fields from /fields,
// exposed under the same shape the views already use.
export const useStadiumsStore = defineStore('stadiums', () => {
  const settings = ref<Settings | null>(null)
  const fields = ref<Field[]>([])
  const activeFieldId = ref<number | ''>('')
  const loaded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeStadium = computed(() => {
    if (!settings.value) return null
    return {
      id: 1, // sentinel — backend has no stadium ID concept (single tenant)
      name: settings.value.name,
      workStart: settings.value.workStartHour,
      workEnd: settings.value.workEndHour,
      fields: fields.value,
    }
  })
  const stadiums = computed(() => (activeStadium.value ? [activeStadium.value] : []))
  const activeStadiumId = computed(() => (activeStadium.value ? 1 : ''))
  const activeField = computed(() =>
    fields.value.find(f => f.id === activeFieldId.value) ?? null
  )

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const s = await settingsApi.getSettings().catch(() => null)
      if (s) {
        settings.value = s
        // /settings/get already returns the fields array — no need for a separate call.
        if (Array.isArray(s.fields)) {
          fields.value = s.fields.map(withColor)
        } else {
          fields.value = (await fieldsApi.getFields().catch(() => [] as Field[])).map(withColor)
        }
      }
      const savedField = Number(localStorage.getItem(ACTIVE_FIELD_KEY) || 0)
      if (savedField && fields.value.find(f => f.id === savedField)) {
        activeFieldId.value = savedField
      } else if (fields.value.length) {
        activeFieldId.value = fields.value[0].id
      } else {
        activeFieldId.value = ''
      }
      loaded.value = true
    } catch (e: any) {
      error.value = e?.message ?? 'Yuklashda xato'
    } finally {
      loading.value = false
    }
  }

  function setActiveField(id: number | string) {
    const n = Number(id)
    activeFieldId.value = n
    localStorage.setItem(ACTIVE_FIELD_KEY, String(n))
  }
  // no-op kept for view compatibility (single stadium)
  function setActiveStadium(_id: any) {}

  async function updateStadiumSettings(patch: Partial<Settings>) {
    const merged: Partial<Settings> = {
      name: patch.name ?? settings.value?.name,
      workStartHour: patch.workStartHour ?? settings.value?.workStartHour,
      workEndHour: patch.workEndHour ?? settings.value?.workEndHour,
      language: patch.language ?? settings.value?.language,
    }
    const updated = await settingsApi.updateSettings(merged)
    if (updated) settings.value = { ...(settings.value as Settings), ...updated }
    else settings.value = { ...(settings.value as Settings), ...(merged as Settings) }
  }

  // Compat helper used in old views ({ name, workStart, workEnd } on activeStadium)
  async function updateStadium(_id: any, patch: { name?: string; workStart?: number; workEnd?: number }) {
    await updateStadiumSettings({
      name: patch.name,
      workStartHour: patch.workStart,
      workEndHour: patch.workEnd,
    })
  }

  // Onboarding compat: create stadium ≈ set settings; returns sentinel id (1).
  async function addStadium(name: string, workStart = 6, workEnd = 24) {
    await updateStadiumSettings({ name, workStartHour: workStart, workEndHour: workEnd })
    return 1
  }

  function deleteStadium(_id: any) {
    // Backend has no DELETE endpoint for the stadium itself; no-op.
  }

  async function addField(_stadiumId: any, name: string, pricePerHour: number) {
    const created = await fieldsApi.createField({ name, pricePerHour })
    if (created) {
      fields.value.push(withColor(created, fields.value.length))
      if (!activeFieldId.value) setActiveField(created.id)
      return created.id
    }
    return undefined
  }

  async function updateField(
    _stadiumId: any,
    fieldId: number,
    patch: { name?: string; pricePerHour?: number; isActive?: boolean }
  ) {
    const updated = await fieldsApi.updateField({ id: fieldId, ...patch })
    const idx = fields.value.findIndex(f => f.id === fieldId)
    if (idx !== -1) {
      fields.value[idx] = withColor({ ...fields.value[idx], ...(updated ?? patch) } as Field, idx)
    }
  }

  async function deleteField(_stadiumId: any, fieldId: number) {
    await fieldsApi.deleteField(fieldId)
    fields.value = fields.value.filter(f => f.id !== fieldId)
    if (activeFieldId.value === fieldId) {
      setActiveField(fields.value[0]?.id ?? '')
    }
  }

  function reset() {
    settings.value = null
    fields.value = []
    activeFieldId.value = ''
    loaded.value = false
  }

  return {
    settings, fields, activeFieldId,
    stadiums, activeStadium, activeStadiumId, activeField,
    loaded, loading, error,
    loadAll, setActiveStadium, setActiveField,
    addStadium, updateStadium, updateStadiumSettings, deleteStadium,
    addField, updateField, deleteField, reset,
  }
})
