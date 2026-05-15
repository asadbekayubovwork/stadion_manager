<template>
  <div class="min-h-dvh flex flex-col" style="background: #f8fafc;">

    <!-- ── HEADER ── -->
    <div
      class="flex flex-col gap-2 px-6 pb-4"
      :style="{ paddingTop: headerTopPad }"
    >
      <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
        <img src="/logo.png" alt="Maydon" />
      </div>

      <div class="pt-6">
        <h1 style="font-size:30px; font-weight:700; color:#0f172a; letter-spacing:-0.75px; line-height:36px; margin:0;">
          Ro'yxatdan o'tish
        </h1>
      </div>
      <p style="font-size:16px; font-weight:400; color:#64748b; line-height:24px; margin:0;">
        Yangi hisob yarating
      </p>
    </div>

    <!-- ── SCROLLABLE FORM ── -->
    <div
      class="flex-1 overflow-y-auto px-6"
      style="padding-top: 8px; padding-bottom: 24px; display:flex; flex-direction:column; gap:14px;"
    >

      <!-- Full name -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
        To'liq ism
      </label>
      <div
        class="flex items-center bg-white"
        style="padding:17px; border-radius:16px; transition: box-shadow 0.15s; margin-top:-8px;"
        :style="focusedName
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
          : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <svg class="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <input
          v-model="name"
          type="text"
          placeholder="Alisher Umarov"
          class="w-full bg-transparent outline-none"
          style="font-size:18px; font-weight:500; color:#0f172a; border:none; padding-left:12px;"
          @focus="focusedName = true"
          @blur="focusedName = false"
        />
      </div>

      <!-- Phone -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
        Telefon raqam
      </label>
      <div
        class="flex items-center bg-white rounded-2xl transition-shadow"
        style="padding: 17px; border-radius: 16px; margin-top:-8px;"
        :style="focusedPhone
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
          : 'border: 1px solid rgba(22,163,74,0.5); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <div class="flex items-center flex-shrink-0" style="padding-right:17px; border-right: 1px solid rgba(226,232,240,0.7); gap:8px;">
          <div class="overflow-hidden flex-shrink-0" style="width:24px; height:16px; border-radius:12px; border:1px solid #e2e8f0;">
            <div style="height:5.25px; background:#0099b5;" />
            <div style="height:3.5px; background:#ffffff;" />
            <div style="height:5.25px; background:#1eb53a;" />
          </div>
          <span style="font-size:18px; font-weight:600; color:#0f172a; letter-spacing:0.45px; line-height:28px; white-space:nowrap;">
            +998
          </span>
        </div>
        <div class="flex-1 flex items-center" style="padding-left:16px;">
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            placeholder="99 123 45 67"
            maxlength="12"
            class="w-full bg-transparent outline-none"
            style="font-size:20px; font-weight:500; color:#0f172a; letter-spacing:0.5px; line-height:28px; border:none;"
            @focus="focusedPhone = true"
            @blur="focusedPhone = false"
            @input="formatPhone"
          />
        </div>
      </div>

      <!-- Password -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
        Parol
      </label>
      <div
        class="flex items-center bg-white"
        style="padding:17px; border-radius:16px; margin-top:-8px;"
        :style="focusedPassword
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
          : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <svg class="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Kamida 4 ta belgi"
          class="w-full bg-transparent outline-none"
          style="font-size:18px; font-weight:500; color:#0f172a; letter-spacing:0.5px; line-height:28px; border:none; padding-left:12px;"
          @focus="focusedPassword = true"
          @blur="focusedPassword = false"
        />
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

      <!-- Confirm password -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px;">
        Parolni tasdiqlang
      </label>
      <div
        class="flex items-center bg-white"
        style="padding:17px; border-radius:16px; margin-top:-8px;"
        :style="focusedConfirm
          ? 'border: 1px solid rgba(22,163,74,0.8); box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1);'
          : passwordsMatch && password.length > 0
            ? 'border: 1px solid rgba(22,163,74,0.5); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'
            : confirmTouched && !passwordsMatch
              ? 'border: 1px solid rgba(244,63,94,0.6); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'
              : 'border: 1px solid rgba(22,163,74,0.4); box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
      >
        <svg class="flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input
          v-model="passwordConfirm"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Parolni qayta kiriting"
          class="w-full bg-transparent outline-none"
          style="font-size:18px; font-weight:500; color:#0f172a; letter-spacing:0.5px; line-height:28px; border:none; padding-left:12px;"
          @focus="focusedConfirm = true"
          @blur="focusedConfirm = false; confirmTouched = true"
        />
        <div
          v-if="passwordsMatch && password.length > 0"
          class="flex-shrink-0 flex items-center justify-center"
          style="width:22px; height:22px; border-radius:6px; background:#dcfce7;"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <!-- Mismatch hint -->
      <p
        v-if="confirmTouched && passwordConfirm.length > 0 && !passwordsMatch"
        style="font-size:12px; font-weight:500; color:#f43f5e; margin:0; padding-left:2px;"
      >
        Parollar mos kelmadi
      </p>

      <!-- Server error -->
      <p
        v-if="errorMsg"
        style="font-size:13px; font-weight:500; color:#f43f5e; margin:0; padding-left:2px;"
      >
        {{ errorMsg }}
      </p>

    </div>

    <!-- ── BOTTOM BUTTON ── -->
    <div
      class="flex flex-col px-6"
      style="padding-top:16px; backdrop-filter: blur(8px); background: rgba(248,250,252,0.92); border-top: 1px solid rgba(226,232,240,0.6); gap:14px;"
      :style="{ paddingBottom: buttonBottomPad }"
    >
      <button
        @click="onRegister"
        :disabled="!isValid || loading"
        class="relative flex items-center justify-center w-full transition-all active:scale-95"
        style="height:61.5px; min-height:61.5px; flex-shrink:0; border-radius:9999px; border:none; cursor:pointer;"
        :style="(isValid && !loading)
          ? 'background:#16a34a; box-shadow:0px 4px 14px rgba(22,163,74,0.3);'
          : 'background:#e2e8f0; cursor:not-allowed;'"
      >
        <span
          style="font-size:17px; font-weight:600; line-height:25.5px;"
          :style="(isValid && !loading) ? 'color:#ffffff;' : 'color:#94a3b8;'"
        >
          {{ loading ? "Yaratilmoqda…" : "Ro'yxatdan o'tish" }}
        </span>
        <svg
          v-if="isValid && !loading"
          class="absolute"
          style="right: 20px; top: 50%; transform: translateY(-50%);"
          width="20" height="20" viewBox="0 0 20 20" fill="none"
        >
          <path d="M4.16667 10H15.8333M10 4.16667L15.8333 10L10 15.8333"
                stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Back to login -->
      <div class="flex items-center justify-center" style="gap:6px;">
        <span style="font-size:14px; font-weight:500; color:#64748b; line-height:20px;">
          Hisobingiz bormi?
        </span>
        <button
          type="button"
          @click="router.push({ name: 'login' })"
          style="background:transparent; border:none; cursor:pointer; padding:0; font-size:14px; font-weight:700; color:#16a34a; line-height:20px;"
        >
          ← Kirish
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

const name = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirm = ref('')

const focusedName = ref(false)
const focusedPhone = ref(false)
const focusedPassword = ref(false)
const focusedConfirm = ref(false)
const confirmTouched = ref(false)
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
  return bottom > 0 ? `${bottom + 16}px` : 'calc(var(--tg-safe-bottom, env(safe-area-inset-bottom, 0px)) + 24px)'
})

const digits = computed(() => phone.value.replace(/\D/g, ''))
const passwordsMatch = computed(() => password.value === passwordConfirm.value)
const isValid = computed(
  () =>
    name.value.trim().length >= 2 &&
    digits.value.length === 9 &&
    password.value.length >= 4 &&
    passwordsMatch.value
)

function formatPhone(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 9)
  let f = raw
  if (raw.length > 2) f = raw.slice(0, 2) + ' ' + raw.slice(2)
  if (raw.length > 5) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5)
  if (raw.length > 7) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5, 7) + ' ' + raw.slice(7)
  phone.value = f
}

async function onRegister() {
  if (!isValid.value || loading.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.register(name.value.trim(), '+998' + digits.value, password.value)
    await stadiumsStore.loadAll()
    router.push({ name: 'onboarding' })
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 409 || e.status === 400) {
        errorMsg.value = e.message || "Bu telefon allaqachon ro'yxatdan o'tgan"
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
