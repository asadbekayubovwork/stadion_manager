<template>
  <div class="min-h-dvh flex flex-col" style="background: #f8fafc;">

    <!-- ── HEADER ── -->
    <div
      class="flex flex-col gap-2 px-6 pb-6"
      :style="{ paddingTop: headerTopPad }"
    >
      <!-- Logo area -->
      <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
       <img src="/logo.png" alt="Maydon" />
      </div>

      <!-- Title -->
      <div class="pt-6">
        <h1 style="font-size:30px; font-weight:700; color:#0f172a; letter-spacing:-0.75px; line-height:36px; margin:0;">
          Hush kelibsiz
        </h1>
      </div>

      <!-- Subtitle -->
      <p style="font-size:16px; font-weight:400; color:#64748b; line-height:24px; margin:0;">
        Tizimga kirish uchun ma'lumotlaringizni kiriting
      </p>
    </div>

    <!-- ── MIDDLE ── -->
    <div class="flex-1 flex flex-col px-6 pt-2" style="gap:16px;">

      <!-- Phone label -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px; display:block;">
        Telefon raqam
      </label>

      <!-- Phone input -->
      <div
        class="flex items-center bg-white rounded-2xl transition-shadow"
        style="padding: 17px; border-radius: 16px; position: relative; margin-top: -8px;"
        :style="phoneFocused
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1);'
          : errorMsg
            ? 'border: 1px solid rgba(244,63,94,0.6); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'
            : 'border: 1px solid rgba(22,163,74,0.5); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <!-- Country prefix -->
        <div class="flex items-center flex-shrink-0" style="padding-right:17px; border-right: 1px solid rgba(226,232,240,0.7); gap:8px;">
          <!-- Uzbekistan flag -->
          <div class="overflow-hidden flex-shrink-0" style="width:24px; height:16px; border-radius:12px; border:1px solid #e2e8f0;">
            <div style="height:5.25px; background:#0099b5;" />
            <div style="height:3.5px; background:#ffffff;" />
            <div style="height:5.25px; background:#1eb53a;" />
          </div>
          <!-- +998 -->
          <span style="font-size:18px; font-weight:600; color:#0f172a; letter-spacing:0.45px; line-height:28px; white-space:nowrap;">
            +998
          </span>
        </div>

        <!-- Phone number input -->
        <div class="flex-1 flex items-center" style="padding-left:16px;">
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            placeholder="99 123 45 67"
            maxlength="12"
            class="w-full bg-transparent outline-none"
            style="font-size:20px; font-weight:500; color:#0f172a; letter-spacing:0.5px; line-height:28px; border:none;"
            @focus="phoneFocused = true"
            @blur="phoneFocused = false"
            @input="formatPhone"
          />
        </div>
      </div>

      <!-- Password label -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px; display:block;">
        Parol
      </label>

      <!-- Password input -->
      <div
        class="flex items-center bg-white rounded-2xl transition-shadow"
        style="padding: 17px; border-radius: 16px; position: relative; margin-top: -8px;"
        :style="passwordFocused
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1);'
          : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <!-- Lock icon -->
        <svg class="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>

        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Parolingiz"
          class="w-full bg-transparent outline-none"
          style="font-size:18px; font-weight:500; color:#0f172a; letter-spacing:0.5px; line-height:28px; border:none; padding-left:12px;"
          @focus="passwordFocused = true"
          @blur="passwordFocused = false"
          @keyup.enter="proceed"
        />

        <!-- Show/hide -->
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="flex-shrink-0"
          style="background:transparent; border:none; cursor:pointer; padding:4px; display:flex; align-items:center; justify-content:center;"
        >
          <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>

      <!-- Error message -->
      <p
        v-if="errorMsg"
        style="font-size:13px; font-weight:500; color:#f43f5e; margin:0; padding-left:2px;"
      >
        {{ errorMsg }}
      </p>

      <!-- Security note -->
      <div class="flex items-center" style="gap:8px; padding-top:4px;">
        <svg class="flex-shrink-0" width="16" height="16" viewBox="0 0 12 14.6689" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.3333 8.0003C11.3333 11.3336 9 13.0003 6.22667 13.967C6.08144 14.0162 5.92369 14.0138 5.78 13.9603C3 13.0003 0.666667 11.3336 0.666667 8.0003V3.33363C0.666667 2.96569 0.96539 2.66697 1.33333 2.66697C2.66667 2.66697 4.33333 1.86697 5.49333 0.853633C5.78512 0.604345 6.21488 0.604345 6.50667 0.853633C7.67333 1.87363 9.33333 2.66697 10.6667 2.66697C11.0346 2.66697 11.3333 2.96569 11.3333 3.33363V8.0003Z"
                stroke="#16A34A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 7.33363L5.33333 8.66697L8 6.0003"
                stroke="#16A34A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="font-size:12px; font-weight:500; color:#64748b; line-height:16px;">
          Ma'lumotlaringiz ishonchli himoyalangan
        </span>
      </div>
    </div>

    <!-- ── BOTTOM BUTTON ── -->
    <div
      class="flex flex-col"
      style="padding: 17px 24px 0; backdrop-filter: blur(6px); background: rgba(248,250,252,0.8); border-top: 1px solid transparent; gap:14px;"
      :style="{ paddingBottom: buttonBottomPad }"
    >
      <button
        @click="proceed"
        :disabled="!isValid || loading"
        class="relative flex items-center justify-center w-full transition-all active:scale-95"
        style="height:61.5px; border-radius:9999px; border:none; cursor:pointer;"
        :style="(isValid && !loading)
          ? 'background:#16a34a; box-shadow:0px 1px 3px 0px rgba(22,163,74,0.2), 0px 1px 2px -1px rgba(22,163,74,0.2);'
          : 'background:#e2e8f0; cursor:not-allowed;'"
      >
        <span
          style="font-size:17px; font-weight:600; line-height:25.5px; letter-spacing:0;"
          :style="(isValid && !loading) ? 'color:#ffffff;' : 'color:#94a3b8;'"
        >
          {{ loading ? 'Kirilmoqda…' : 'Kirish' }}
        </span>
        <svg
          v-if="isValid && !loading"
          class="absolute"
          style="right: 20px; top: 50%; transform: translateY(-50%);"
          width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.16667 10H15.8333M10 4.16667L15.8333 10L10 15.8333"
                stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Register link -->
      <div class="flex items-center justify-center" style="gap:6px;">
        <span style="font-size:14px; font-weight:500; color:#64748b; line-height:20px;">
          Hisobingiz yo'qmi?
        </span>
        <button
          type="button"
          @click="router.push({ name: 'register' })"
          style="background:transparent; border:none; cursor:pointer; padding:0; font-size:14px; font-weight:700; color:#16a34a; line-height:20px;"
        >
          Ro'yxatdan o'tish →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useStadiumsStore } from '../stores/stadiums'
import { ApiError } from '../api/http'

const router = useRouter()
const auth = useAuthStore()
const stadiumsStore = useStadiumsStore()

const phone = ref('')
const password = ref('')
const phoneFocused = ref(false)
const passwordFocused = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const tg = (window as any).Telegram?.WebApp

const headerTopPad = computed(() => {
  const top = tg?.contentSafeAreaInset?.top ?? tg?.safeAreaInset?.top ?? 0
  return top > 0 ? `${top + 16}px` : 'calc(var(--tg-safe-top, 0px) + 64px)'
})

const buttonBottomPad = computed(() => {
  const bottom = tg?.safeAreaInset?.bottom ?? 0
  return bottom > 0 ? `${bottom + 24}px` : 'calc(var(--tg-safe-bottom, env(safe-area-inset-bottom, 0px)) + 40px)'
})

const digits = computed(() => phone.value.replace(/\D/g, ''))
const isValid = computed(() => digits.value.length === 9 && password.value.length >= 4)

function formatPhone(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 9)
  let f = raw
  if (raw.length > 2) f = raw.slice(0, 2) + ' ' + raw.slice(2)
  if (raw.length > 5) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5)
  if (raw.length > 7) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5, 7) + ' ' + raw.slice(7)
  phone.value = f
}

async function proceed() {
  if (!isValid.value || loading.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login('+998' + digits.value, password.value)
    await stadiumsStore.loadAll()
    const hasStadium = !!stadiumsStore.settings?.name
    router.push({ name: hasStadium ? 'home' : 'onboarding' })
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 401 || e.status === 400) {
        errorMsg.value = 'Telefon yoki parol noto\'g\'ri'
      } else if (e.status === 0) {
        errorMsg.value = 'Internet ulanmagan'
      } else {
        errorMsg.value = e.message || 'Xatolik yuz berdi'
      }
    } else {
      errorMsg.value = 'Xatolik yuz berdi'
    }
  } finally {
    loading.value = false
  }
}
</script>
