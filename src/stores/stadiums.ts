import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Stadium, Field } from '../types'
import { nanoid } from '../utils/nanoid'

const STORAGE_KEY = 'sm_stadiums'
const ACTIVE_STADIUM_KEY = 'sm_active_stadium'
const ACTIVE_FIELD_KEY = 'sm_active_field'

export const useStadiumsStore = defineStore('stadiums', () => {
  const stadiums = ref<Stadium[]>([])
  const activeStadiumId = ref<string>('')
  const activeFieldId = ref<string>('')

  const activeStadium = computed(() =>
    stadiums.value.find(s => s.id === activeStadiumId.value)
  )
  const activeField = computed(() =>
    activeStadium.value?.fields.find(f => f.id === activeFieldId.value)
  )

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      stadiums.value = JSON.parse(saved)
    } else {
      // seed demo data
      const fieldId1 = nanoid()
      const fieldId2 = nanoid()
      const stadiumId = nanoid()
      stadiums.value = [{
        id: stadiumId,
        name: 'Sardor Stadion',
        ownerId: 'user1',
        workStart: 6,
        workEnd: 24,
        fields: [
          { id: fieldId1, stadiumId, name: '1-Maydon', pricePerHour: 250000, color: '#16a34a' },
          { id: fieldId2, stadiumId, name: '2-Maydon', pricePerHour: 200000, color: '#2563eb' },
        ],
      }]
      persist()
    }
    const savedStadium = localStorage.getItem(ACTIVE_STADIUM_KEY)
    const savedField = localStorage.getItem(ACTIVE_FIELD_KEY)
    if (savedStadium && stadiums.value.find(s => s.id === savedStadium)) {
      activeStadiumId.value = savedStadium
    } else if (stadiums.value.length) {
      activeStadiumId.value = stadiums.value[0].id
    }
    if (savedField && activeStadium.value?.fields.find(f => f.id === savedField)) {
      activeFieldId.value = savedField
    } else if (activeStadium.value?.fields.length) {
      activeFieldId.value = activeStadium.value.fields[0].id
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stadiums.value))
  }

  function setActiveStadium(id: string) {
    activeStadiumId.value = id
    localStorage.setItem(ACTIVE_STADIUM_KEY, id)
    const s = stadiums.value.find(s => s.id === id)
    if (s?.fields.length) {
      setActiveField(s.fields[0].id)
    }
  }

  function setActiveField(id: string) {
    activeFieldId.value = id
    localStorage.setItem(ACTIVE_FIELD_KEY, id)
  }

  function addStadium(name: string, workStart = 6, workEnd = 24) {
    const id = nanoid()
    stadiums.value.push({ id, name, ownerId: 'user1', workStart, workEnd, fields: [] })
    persist()
    return id
  }

  function updateStadium(id: string, patch: Partial<Pick<Stadium, 'name' | 'workStart' | 'workEnd'>>) {
    const s = stadiums.value.find(s => s.id === id)
    if (s) Object.assign(s, patch)
    persist()
  }

  function deleteStadium(id: string) {
    stadiums.value = stadiums.value.filter(s => s.id !== id)
    if (activeStadiumId.value === id && stadiums.value.length) {
      setActiveStadium(stadiums.value[0].id)
    }
    persist()
  }

  function addField(stadiumId: string, name: string, pricePerHour: number) {
    const s = stadiums.value.find(s => s.id === stadiumId)
    if (!s) return
    const id = nanoid()
    s.fields.push({ id, stadiumId, name, pricePerHour })
    persist()
    return id
  }

  function updateField(stadiumId: string, fieldId: string, patch: Partial<Pick<Field, 'name' | 'pricePerHour'>>) {
    const f = stadiums.value.find(s => s.id === stadiumId)?.fields.find(f => f.id === fieldId)
    if (f) Object.assign(f, patch)
    persist()
  }

  function deleteField(stadiumId: string, fieldId: string) {
    const s = stadiums.value.find(s => s.id === stadiumId)
    if (!s) return
    s.fields = s.fields.filter(f => f.id !== fieldId)
    if (activeFieldId.value === fieldId && s.fields.length) {
      setActiveField(s.fields[0].id)
    }
    persist()
  }

  return {
    stadiums, activeStadiumId, activeFieldId, activeStadium, activeField,
    init, setActiveStadium, setActiveField,
    addStadium, updateStadium, deleteStadium,
    addField, updateField, deleteField,
  }
})
