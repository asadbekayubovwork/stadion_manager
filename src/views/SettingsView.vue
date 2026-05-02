<template>
  <div class="px-4 pt-5 pb-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-5">{{ t('settings.title') }}</h1>

    <!-- Language -->
    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
      <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{{ t('settings.language') }}</p>
      <div class="flex gap-2">
        <button
          v-for="lang in langs"
          :key="lang.key"
          @click="setLang(lang.key)"
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
          :class="currentLang === lang.key ? 'bg-brand-light border-brand text-brand' : 'border-gray-200 text-gray-600'"
        >
          {{ lang.label }}
        </button>
      </div>
    </section>

    <!-- Stadiums -->
    <section class="mb-4">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">{{ t('settings.stadiums') }}</p>
        <button @click="openAddStadium()" class="flex items-center gap-1 text-brand text-sm font-semibold">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {{ t('settings.addStadium') }}
        </button>
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="stadium in stadiumsStore.stadiums"
          :key="stadium.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Stadium header -->
          <div class="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center">
                <svg class="w-4 h-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <span class="font-bold text-gray-900 text-sm">{{ stadium.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="openEditStadium(stadium)" class="p-1.5 rounded-lg bg-gray-100 text-gray-500">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button @click="deleteStadium(stadium.id)" class="p-1.5 rounded-lg bg-red-50 text-red-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          </div>

          <!-- Work hours -->
          <div class="px-4 py-2 flex items-center gap-2 text-xs text-gray-500 border-b border-gray-50">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ String(stadium.workStart).padStart(2,'0') }}:00 – {{ String(stadium.workEnd).padStart(2,'0') }}:00
          </div>

          <!-- Fields -->
          <div class="px-4 py-3 space-y-2">
            <div
              v-for="field in stadium.fields"
              :key="field.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-brand" />
                <span class="text-sm font-medium text-gray-800">{{ field.name }}</span>
                <span class="text-xs text-gray-400">{{ formatMoney(field.pricePerHour) }}/h</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button @click="openEditField(stadium.id, field)" class="p-1.5 rounded-lg bg-gray-100 text-gray-500">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button @click="deleteField(stadium.id, field.id)" class="p-1.5 rounded-lg bg-red-50 text-red-400">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
            <button
              @click="openAddField(stadium.id)"
              class="flex items-center gap-1.5 text-brand text-xs font-semibold py-1.5"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {{ t('settings.addField') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Logout -->
    <button
      @click="logout()"
      class="w-full py-4 rounded-2xl border-2 border-red-200 text-red-500 font-bold text-sm mt-4 active:bg-red-50 transition-colors"
    >
      {{ t('settings.logout') }}
    </button>

    <!-- Stadium modal -->
    <Teleport to="body">
      <div v-if="stadiumModal" class="fixed inset-0 z-50 flex items-end" @click.self="stadiumModal = null">
        <div class="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl shadow-2xl p-5 pb-8">
          <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
          <h3 class="font-bold text-gray-900 mb-4">{{ stadiumModal.id ? t('settings.editStadium') : t('settings.addStadium') }}</h3>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 mb-1 block">{{ t('settings.stadiumName') }}</label>
              <input v-model="stadiumModal.name" type="text" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-semibold text-gray-500 mb-1 block">{{ t('settings.workStart') }}</label>
                <input v-model.number="stadiumModal.workStart" type="number" min="0" max="23" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 mb-1 block">{{ t('settings.workEnd') }}</label>
                <input v-model.number="stadiumModal.workEnd" type="number" min="1" max="24" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
            </div>
            <button @click="saveStadium()" class="w-full py-3.5 bg-brand text-white rounded-2xl font-bold text-sm mt-1">{{ t('common.save') }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Field modal -->
    <Teleport to="body">
      <div v-if="fieldModal" class="fixed inset-0 z-50 flex items-end" @click.self="fieldModal = null">
        <div class="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl shadow-2xl p-5 pb-8">
          <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
          <h3 class="font-bold text-gray-900 mb-4">{{ fieldModal.id ? t('settings.editField') : t('settings.addField') }}</h3>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-semibold text-gray-500 mb-1 block">{{ t('settings.fieldName') }}</label>
              <input v-model="fieldModal.name" type="text" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 mb-1 block">{{ t('settings.pricePerHour') }}</label>
              <input v-model.number="fieldModal.pricePerHour" type="number" class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand" />
            </div>
            <button @click="saveField()" class="w-full py-3.5 bg-brand text-white rounded-2xl font-bold text-sm mt-1">{{ t('common.save') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStadiumsStore } from '../stores/stadiums'
import { useAuthStore } from '../stores/auth'
import type { Field } from '../types'

const { t, locale } = useI18n()
const router = useRouter()
const stadiumsStore = useStadiumsStore()
const authStore = useAuthStore()

const langs = [
  { key: 'uz', label: "O'zbek" },
  { key: 'ru', label: 'Русский' },
  { key: 'en', label: 'English' },
]
const currentLang = computed(() => locale.value)
function setLang(lang: string) {
  locale.value = lang
  localStorage.setItem('sm_lang', lang)
}

// Stadium modal
interface StadiumForm { id?: string; name: string; workStart: number; workEnd: number }
const stadiumModal = ref<StadiumForm | null>(null)
function openAddStadium() { stadiumModal.value = { name: '', workStart: 6, workEnd: 24 } }
function openEditStadium(s: { id: string; name: string; workStart: number; workEnd: number }) {
  stadiumModal.value = { id: s.id, name: s.name, workStart: s.workStart, workEnd: s.workEnd }
}
function saveStadium() {
  if (!stadiumModal.value?.name) return
  if (stadiumModal.value.id) {
    stadiumsStore.updateStadium(stadiumModal.value.id, {
      name: stadiumModal.value.name,
      workStart: stadiumModal.value.workStart,
      workEnd: stadiumModal.value.workEnd,
    })
  } else {
    stadiumsStore.addStadium(stadiumModal.value.name, stadiumModal.value.workStart, stadiumModal.value.workEnd)
  }
  stadiumModal.value = null
}
function deleteStadium(id: string) {
  if (confirm(t('settings.confirmDeleteStadium'))) {
    stadiumsStore.deleteStadium(id)
  }
}

// Field modal
interface FieldForm { id?: string; stadiumId: string; name: string; pricePerHour: number }
const fieldModal = ref<FieldForm | null>(null)
function openAddField(stadiumId: string) { fieldModal.value = { stadiumId, name: '', pricePerHour: 200000 } }
function openEditField(stadiumId: string, f: Field) {
  fieldModal.value = { id: f.id, stadiumId, name: f.name, pricePerHour: f.pricePerHour }
}
function saveField() {
  if (!fieldModal.value?.name) return
  if (fieldModal.value.id) {
    stadiumsStore.updateField(fieldModal.value.stadiumId, fieldModal.value.id, {
      name: fieldModal.value.name,
      pricePerHour: fieldModal.value.pricePerHour,
    })
  } else {
    stadiumsStore.addField(fieldModal.value.stadiumId, fieldModal.value.name, fieldModal.value.pricePerHour)
  }
  fieldModal.value = null
}
function deleteField(stadiumId: string, fieldId: string) {
  if (confirm(t('settings.confirmDeleteField'))) {
    stadiumsStore.deleteField(stadiumId, fieldId)
  }
}

function logout() {
  if (confirm(t('settings.confirmLogout'))) {
    authStore.logout()
    router.push({ name: 'login' })
  }
}

function formatMoney(n: number) { return n.toLocaleString('uz-UZ') }
</script>
