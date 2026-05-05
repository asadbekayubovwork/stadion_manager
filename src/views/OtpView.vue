<template>
  <div class="min-h-dvh bg-white flex flex-col px-6 pt-16 pb-8">
    <button @click="router.push({ name: 'login' })" class="flex items-center gap-2 text-gray-500 text-sm mb-8 -ml-1">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
      {{ t('auth.changePhone') }}
    </button>

    <img src="/logo.png" alt="Maydon" class="mb-8 w-16 h-16" />

    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ t('auth.otpTitle') }}</h1>
    <p class="text-gray-500 mb-10 text-[15px]">{{ t('auth.otpSubtitle', { phone }) }}</p>

    <!-- OTP boxes -->
    <div class="flex gap-3 justify-center mb-8">
      <input
        v-for="(_, i) in 4"
        :key="i"
        :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
        v-model="digits[i]"
        type="tel"
        inputmode="numeric"
        maxlength="1"
        class="w-14 h-14 text-center text-2xl font-bold border-2 rounded-2xl outline-none transition-colors"
        :class="digits[i] ? 'border-brand text-brand' : 'border-gray-200 text-gray-900'"
        @input="onInput(i, $event)"
        @keydown.backspace="onBackspace(i)"
        @paste="onPaste"
      />
    </div>

    <p v-if="error" class="text-red-500 text-sm text-center mb-4">{{ error }}</p>

    <div class="text-center text-sm text-gray-500 mb-2">
      <span v-if="countdown > 0">{{ t('auth.otpResendIn', { s: countdown }) }}</span>
      <button v-else @click="resend" class="text-brand font-semibold">{{ t('auth.otpResend') }}</button>
    </div>

    <div class="flex-1" />

    <button
      @click="verify"
      :disabled="otpValue.length < 4 || loading"
      class="w-full py-4 rounded-2xl font-bold text-white text-base transition-all"
      :class="otpValue.length === 4 && !loading ? 'bg-brand shadow-lg shadow-brand/30 active:scale-95' : 'bg-gray-200 text-gray-400'"
    >
      {{ loading ? t('common.loading') : t('auth.verify') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { nanoid } from '../utils/nanoid'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const phone = ref(sessionStorage.getItem('sm_otp_phone') || '')
const digits = ref(['', '', '', ''])
const inputs = ref<HTMLInputElement[]>([])
const error = ref('')
const loading = ref(false)
const countdown = ref(60)

const otpValue = computed(() => digits.value.join(''))

let timer: ReturnType<typeof setInterval>
onMounted(() => {
  inputs.value[0]?.focus()
  startCountdown()
})
onUnmounted(() => clearInterval(timer))

function startCountdown() {
  countdown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

function resend() {
  digits.value = ['', '', '', '']
  error.value = ''
  startCountdown()
  inputs.value[0]?.focus()
}

function onInput(i: number, e: Event) {
  const val = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  digits.value[i] = val.slice(-1)
  if (val && i < 3) inputs.value[i + 1]?.focus()
}

function onBackspace(i: number) {
  if (!digits.value[i] && i > 0) {
    digits.value[i - 1] = ''
    inputs.value[i - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text').replace(/\D/g, '') || ''
  if (text.length >= 4) {
    digits.value = text.slice(0, 4).split('')
  }
}

async function verify() {
  if (otpValue.value.length < 4) return
  loading.value = true
  error.value = ''
  // demo: any 4-digit code works
  await new Promise(r => setTimeout(r, 800))
  auth.login({
    id: nanoid(),
    phone: phone.value,
    name: '',
    stadiumIds: [],
  })
  const isOnboarded = localStorage.getItem('sm_onboarded') === 'true'
  router.push({ name: isOnboarded ? 'home' : 'onboarding' })
}
</script>
