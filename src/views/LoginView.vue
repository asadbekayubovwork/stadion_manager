<template>
  <div class="min-h-dvh flex flex-col" style="background: #f8fafc;">

    <!-- ── HEADER ── -->
    <div
      class="flex flex-col gap-2 px-6 pb-6"
      :style="{ paddingTop: headerTopPad }"
    >
      <!-- Logo area -->
      <div class="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
           style="background: rgba(22,163,74,0.1);">
        <!-- Hexagon icon -->
        <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 21.3333V10.6667C27.999 9.71494 27.4909 8.83587 26.6667 8.36L17.3333 3.02667C16.5083 2.55031 15.4917 2.55031 14.6667 3.02667L5.33333 8.36C4.50911 8.83587 4.00098 9.71494 4 10.6667V21.3333C4.00098 22.2851 4.50911 23.1641 5.33333 23.64L14.6667 28.9733C15.4917 29.4497 16.5083 29.4497 17.3333 28.9733L26.6667 23.64C27.4909 23.1641 27.999 22.2851 28 21.3333"
                stroke="#16A34A" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- Green dot at center -->
        <div class="absolute w-4 h-4 rounded-full bg-[#16a34a]" style="left: 20px; top: 20px;" />
      </div>

      <!-- Title -->
      <div class="pt-6">
        <h1 style="font-size:30px; font-weight:700; color:#0f172a; letter-spacing:-0.75px; line-height:36px; margin:0;">
          Hush kelibsiz
        </h1>
      </div>

      <!-- Subtitle -->
      <p style="font-size:16px; font-weight:400; color:#64748b; line-height:24px; margin:0;">
        Tizimga kirish uchun telefon raqamingizni kiriting
      </p>
    </div>

    <!-- ── MIDDLE ── -->
    <div class="flex-1 flex flex-col px-6 pt-4" style="gap:12px;">

      <!-- Label -->
      <label style="font-size:14px; font-weight:500; color:#334155; line-height:20px; display:block;">
        Telefon raqam
      </label>

      <!-- Input container -->
      <div
        class="flex items-center bg-white rounded-2xl transition-shadow"
        style="border: 1px solid rgba(22,163,74,0.5); padding: 17px; border-radius: 16px; position: relative;"
        :style="focused
          ? 'box-shadow: 0px 0px 0px 4px rgba(22,163,74,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1);'
          : 'box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.06);'"
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
            @focus="focused = true"
            @blur="focused = false"
            @input="formatPhone"
            @keyup.enter="proceed"
          />
        </div>
      </div>

      <!-- Security note -->
      <div class="flex items-center" style="gap:8px; padding-top:4px;">
        <!-- Shield-check icon -->
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
      style="padding: 17px 24px 40px; backdrop-filter: blur(6px); background: rgba(248,250,252,0.8); border-top: 1px solid transparent;"
      :style="{ paddingBottom: buttonBottomPad }"
    >
      <button
        @click="proceed"
        :disabled="!isValid"
        class="relative flex items-center justify-center w-full transition-all active:scale-95"
        style="height:61.5px; border-radius:9999px; border:none; cursor:pointer;"
        :style="isValid
          ? 'background:#16a34a; box-shadow:0px 1px 3px 0px rgba(22,163,74,0.2), 0px 1px 2px -1px rgba(22,163,74,0.2);'
          : 'background:#e2e8f0; cursor:not-allowed;'"
      >
        <span
          style="font-size:17px; font-weight:600; line-height:25.5px; letter-spacing:0;"
          :style="isValid ? 'color:#ffffff;' : 'color:#94a3b8;'"
        >
          Davom etish
        </span>
        <!-- Arrow icon -->
        <svg
          v-if="isValid"
          class="absolute"
          style="right: 20px; top: 50%; transform: translateY(-50%);"
          width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
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

const router = useRouter()
const phone = ref('')
const focused = ref(false)

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
const isValid = computed(() => digits.value.length === 9)

function formatPhone(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 9)
  let f = raw
  if (raw.length > 2) f = raw.slice(0, 2) + ' ' + raw.slice(2)
  if (raw.length > 5) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5)
  if (raw.length > 7) f = raw.slice(0, 2) + ' ' + raw.slice(2, 5) + ' ' + raw.slice(5, 7) + ' ' + raw.slice(7)
  phone.value = f
}

function proceed() {
  if (!isValid.value) return
  sessionStorage.setItem('sm_otp_phone', '+998' + digits.value)
  router.push({ name: 'otp' })
}
</script>
