<template>
  <div class="min-h-dvh flex flex-col" style="background: #f8fafc;">

    <!-- ── HEADER ── -->
    <div
      class="flex flex-col gap-2 px-6 pb-6"
      :style="{ paddingTop: headerTopPad }"
    >
      <!-- Logo -->
      <img src="/logo.png" alt="Maydon" style="height: 44px; width: auto;" />

      <div class="pt-6">
        <h1 style="font-size:30px; font-weight:700; color:#0f172a; letter-spacing:-0.75px; line-height:36px; margin:0;">
          {{ t('auth.onboardingTitle') }}
        </h1>
      </div>
      <p style="font-size:16px; font-weight:400; color:#64748b; line-height:24px; margin:0;">
        {{ t('auth.onboardingSubtitle') }}
      </p>
    </div>

    <!-- ── SCROLLABLE FORM ── -->
    <div class="flex-1 overflow-y-auto px-6" style="padding-bottom: 24px; display: flex; flex-direction: column; gap: 24px;">

      <!-- Ism -->
      <div class="flex flex-col" style="gap: 8px;">
        <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
          {{ t('auth.yourName') }}
        </label>
        <div
          class="flex items-center bg-white"
          style="border-radius: 16px; padding: 17px; transition: box-shadow 0.15s;"
          :style="[
            focusedName
              ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
              : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'
          ]"
        >
          <input
            v-model="name"
            type="text"
            :placeholder="t('auth.yourNamePlaceholder')"
            class="w-full bg-transparent outline-none"
            style="font-size:18px; font-weight:500; color:#0f172a; border:none;"
            @focus="focusedName = true"
            @blur="focusedName = false"
          />
        </div>
      </div>

      <!-- Stadion nomi -->
      <div class="flex flex-col" style="gap: 8px;">
        <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
          {{ t('auth.stadiumNameLabel') }}
        </label>
        <div
          class="flex items-center bg-white"
          style="border-radius: 16px; padding: 17px; transition: box-shadow 0.15s;"
          :style="[
            focusedStadium
              ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
              : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'
          ]"
        >
          <input
            v-model="stadiumName"
            type="text"
            :placeholder="t('auth.stadiumNamePlaceholder')"
            class="w-full bg-transparent outline-none"
            style="font-size:18px; font-weight:500; color:#0f172a; border:none;"
            @focus="focusedStadium = true"
            @blur="focusedStadium = false"
          />
        </div>
      </div>

      <!-- Maydonlar -->
      <div class="flex flex-col" style="gap: 12px;">
        <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
          {{ t('auth.fieldsLabel') }}
          <span style="font-weight:400; color:#94a3b8;"> {{ t('auth.fieldsOptional') }}</span>
        </label>

        <!-- Field rows -->
        <div
          v-for="(field, i) in fields"
          :key="i"
          class="flex items-center"
          style="gap: 10px;"
        >
          <!-- Maydon nomi -->
          <div
            class="flex items-center bg-white flex-1"
            style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; box-shadow: 0px 1px 2px rgba(0,0,0,0.04);"
          >
            <input
              v-model="field.name"
              type="text"
              :placeholder="t('auth.fieldPlaceholder', { n: i + 1 })"
              class="w-full bg-transparent outline-none"
              style="font-size:15px; font-weight:500; color:#0f172a; border:none;"
            />
          </div>

          <!-- Soatlik narx -->
          <div
            class="flex items-center bg-white"
            style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 12px; box-shadow: 0px 1px 2px rgba(0,0,0,0.04); width: 120px; gap: 4px;"
          >
            <input
              v-model.number="field.price"
              type="tel"
              inputmode="numeric"
              placeholder="250 000"
              class="w-full bg-transparent outline-none"
              style="font-size:14px; font-weight:500; color:#0f172a; border:none; min-width:0;"
            />
            <span style="font-size:11px; font-weight:500; color:#94a3b8; flex-shrink:0;">{{ t('common.soum') }}</span>
          </div>

          <!-- O'chirish -->
          <button
            @click="removeField(i)"
            style="width:44px; height:44px; border-radius:12px; background:#fff1f2; border:none; flex-shrink:0; display:flex; align-items:center; justify-content:center; cursor:pointer;"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Narx izoh -->
        <p
          v-if="fields.length > 0"
          style="font-size:12px; color:#94a3b8; margin:0; padding-left:2px; line-height:18px;"
        >
          {{ t('auth.priceNote') }}
        </p>

        <!-- Maydon qo'shish tugmasi -->
        <button
          @click="addField"
          class="flex items-center justify-center w-full"
          style="height:54px; border-radius:16px; border: 1.5px dashed rgba(22,163,74,0.4); background: rgba(22,163,74,0.03); gap:8px; cursor:pointer;"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span style="font-size:14px; font-weight:600; color:#16a34a;">{{ t('auth.addField') }}</span>
        </button>
      </div>

    </div>

    <!-- ── BOTTOM BUTTON ── -->
    <div
      class="sticky bottom-0 flex flex-col px-6"
      style="padding-top:16px; backdrop-filter: blur(8px); background: rgba(248,250,252,0.92); border-top: 1px solid rgba(226,232,240,0.6);"
      :style="{ paddingBottom: buttonBottomPad }"
    >
      <button
        @click="save"
        :disabled="!isValid || loading"
        class="relative flex items-center justify-center w-full transition-all active:scale-95"
        style="height:61.5px; border-radius:9999px; border:none; cursor:pointer;"
        :style="(isValid && !loading)
          ? 'background:#16a34a; box-shadow:0px 4px 14px rgba(22,163,74,0.3);'
          : 'background:#e2e8f0; cursor:not-allowed;'"
      >
        <span
          style="font-size:17px; font-weight:600; line-height:25.5px;"
          :style="(isValid && !loading) ? 'color:#ffffff;' : 'color:#94a3b8;'"
        >
          {{ loading ? t('common.saving') : t('auth.saveStart') }}
        </span>
        <svg
          v-if="isValid"
          class="absolute"
          style="right: 20px; top: 50%; transform: translateY(-50%);"
          width="20" height="20" viewBox="0 0 20 20" fill="none"
        >
          <path d="M4.16667 10H15.8333M10 4.16667L15.8333 10L10 15.8333"
                stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useStadiumsStore } from '../stores/stadiums'
import { ApiError } from '../api/http'
import { useToast, extractApiErrorMessage } from '../composables/useToast'

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()
const stadiumsStore = useStadiumsStore()
const toast = useToast()
const loading = ref(false)

const tg = (window as any).Telegram?.WebApp

const headerTopPad = computed(() => {
  const top = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0
  return top > 0 ? `${top + 16}px` : 'calc(var(--tg-safe-top, 0px) + 64px)'
})

const buttonBottomPad = computed(() => {
  const bottom = tg?.safeAreaInset?.bottom ?? 0
  return bottom > 0 ? `${bottom + 16}px` : 'calc(var(--tg-safe-bottom, env(safe-area-inset-bottom, 0px)) + 24px)'
})

const name = ref('')
const stadiumName = ref('')
const fields = ref<{ name: string; price: number | null }[]>([])

const focusedName = ref(false)
const focusedStadium = ref(false)

const isValid = computed(
  () => name.value.trim().length >= 2 && stadiumName.value.trim().length >= 2
)

function addField() {
  fields.value.push({ name: '', price: null })
}

function removeField(i: number) {
  fields.value.splice(i, 1)
}

async function save() {
  if (!isValid.value || loading.value) return
  loading.value = true
  try {
    if (auth.user) auth.updateProfile({ name: name.value.trim() })
    await stadiumsStore.updateStadiumSettings({
      name: stadiumName.value.trim(),
      workStartHour: 6,
      workEndHour: 24,
    })
    const newFields = fields.value.filter(f => f.name.trim())
    for (const f of newFields) {
      await stadiumsStore.addField(1, f.name.trim(), Number(f.price) || 0)
    }
    await stadiumsStore.loadAll()
    toast.success(t('auth.onboardingSaved'))
    router.push({ name: 'home' })
  } catch (e) {
    const msg = e instanceof ApiError
      ? extractApiErrorMessage(e.data, e.message || t('auth.savingError'))
      : t('auth.savingError')
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
