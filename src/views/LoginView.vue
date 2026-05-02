<template>
  <div class="min-h-dvh bg-white flex flex-col px-6 pt-16 pb-8">
    <!-- Logo -->
    <div class="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mb-8">
      <svg class="w-8 h-8 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    </div>

    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('auth.welcome') }}</h1>
    <p class="text-gray-500 mb-10 text-[15px] leading-snug">{{ t('auth.subtitle') }}</p>

    <label class="text-sm font-semibold text-gray-700 mb-2 block">{{ t('auth.phoneLabel') }}</label>
    <div class="flex items-center border-2 rounded-2xl px-4 py-3.5 gap-3 transition-colors"
      :class="focused ? 'border-brand' : 'border-gray-200'">
      <span class="text-xl">🇺🇿</span>
      <span class="font-semibold text-gray-800 text-[15px]">+998</span>
      <div class="w-px h-5 bg-gray-200" />
      <input
        ref="inputRef"
        v-model="phone"
        type="tel"
        inputmode="numeric"
        :placeholder="t('auth.phonePlaceholder')"
        maxlength="12"
        class="flex-1 outline-none text-[15px] font-medium text-gray-900 bg-transparent placeholder-gray-400"
        @focus="focused = true"
        @blur="focused = false"
        @input="formatPhone"
        @keyup.enter="proceed"
      />
    </div>

    <div class="flex items-center gap-2 mt-3">
      <svg class="w-4 h-4 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span class="text-xs text-gray-500">{{ t('auth.secureNote') }}</span>
    </div>

    <div class="flex-1" />

    <button
      @click="proceed"
      :disabled="!isValid"
      class="w-full py-4 rounded-2xl font-bold text-white text-base transition-all"
      :class="isValid ? 'bg-brand shadow-lg shadow-brand/30 active:scale-95' : 'bg-gray-200 text-gray-400'"
    >
      {{ t('auth.continue') }} →
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const phone = ref('')
const focused = ref(false)

const digits = computed(() => phone.value.replace(/\D/g, ''))
const isValid = computed(() => digits.value.length === 9)

function formatPhone(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 9)
  let formatted = raw
  if (raw.length > 2) formatted = raw.slice(0, 2) + ' ' + raw.slice(2)
  if (raw.length > 5) formatted = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5)
  if (raw.length > 7) formatted = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5, 7) + ' ' + raw.slice(7)
  phone.value = formatted
}

function proceed() {
  if (!isValid.value) return
  sessionStorage.setItem('sm_otp_phone', '+998' + digits.value)
  router.push({ name: 'otp' })
}
</script>
