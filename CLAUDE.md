# StadionManager — CLAUDE.md

B2B SaaS web app for mini football stadium owners in Uzbekistan. Manages bookings, clients, schedule, and revenue. Mobile-first; planned for Android wrap and Telegram Bot integration.

## Stack

| Tool | Version |
|------|---------|
| Vue | 3.5 (Composition API + `<script setup>`) |
| TypeScript | ~6.0 |
| Tailwind CSS | v3.4 |
| Pinia | 3 (localStorage persistence) |
| Vue Router | 4 (hash history) |
| vue-i18n | 9 (uz / ru / en) |
| dayjs | date/time formatting |
| Naive UI | installed, not yet used in components |
| @vicons/ionicons5 | icon set |
| Vite | 8 |
| pnpm | package manager — always use pnpm, never npm/yarn |

Build: `pnpm build` (runs `vue-tsc -b && vite build`).
Dev server: `pnpm dev`.
Deploy: Vercel.

## Project structure

```
src/
  types/index.ts          — all shared TS types (see below)
  stores/
    auth.ts               — logged-in user, phone via sessionStorage
    stadiums.ts           — Stadium + Field CRUD, localStorage
    bookings.ts           — Booking CRUD + conflict detection, localStorage
    clients.ts            — Client CRUD, localStorage
  router/index.ts         — hash history, requiresAuth nav guard
  i18n/
    index.ts
    locales/uz.ts ru.ts en.ts
  views/
    LoginView.vue         — phone input
    OtpView.vue           — 4-digit OTP (demo: any code works)
    AppShell.vue          — shell with BottomNav + page transitions
    HomeView.vue          — dashboard: revenue card, upcoming bookings, unpaid alerts
    ScheduleView.vue      — vertical timeline, date strip, field filter, FAB, context menu
    ClientsView.vue       — searchable client list
    ClientDetailView.vue  — client info + booking history
    FinanceView.vue       — today/week/month revenue, cash/card split, pay-unpaid
    SettingsView.vue      — stadium CRUD, field CRUD, language switcher, logout
  components/
    layout/BottomNav.vue  — floating pill nav
    layout/               — SVG icon components
    booking/BookingModal.vue — create/edit booking (duration chips, auto-price, conflict check)
    clients/
    schedule/
    finance/
  utils/nanoid.ts
  assets/
public/                   — SVG icons served statically
```

## Core types (`src/types/index.ts`)

```ts
Stadium  { id, name, ownerId, workStart, workEnd, fields: Field[] }
Field    { id, stadiumId, name, pricePerHour (UZS), color? }
Client   { id, name, phone, createdAt }
Booking  { id, fieldId, stadiumId, clientId, clientName, clientPhone,
           date (YYYY-MM-DD), startTime (HH:MM), endTime (HH:MM),
           durationMin, price, paymentStatus, paymentMethod?, status, notes?, createdAt }
AuthUser { id, phone, name, avatarUrl?, stadiumIds[] }

PaymentMethod = 'cash' | 'card'
BookingStatus = 'active' | 'cancelled'
PaymentStatus = 'paid' | 'unpaid'
Lang = 'uz' | 'ru' | 'en'
```

## Design rules

- **Mobile-first, max-width 480px**, centered on desktop.
- **No component library** — use plain Tailwind utility classes. Naive UI is installed but not wired in; do not introduce it unless specifically asked.
- **Brand colors** (defined in `tailwind.config.js`):
  - `brand` = `#1a7a3e` (green)
  - `brand-light` = `#e8f5ee`
  - `booked` = `#f97316` (orange for booked slots)
  - `booked-light` = `#fff7ed`
- **Font**: Inter (loaded via CSS).
- **Icons**: `@vicons/ionicons5` — import individual icon components.
- **All user-visible strings** go through `vue-i18n` (`t('key')`). Add keys to all three locale files (uz, ru, en).

## Routing & navigation

Router uses `createWebHashHistory` (hash-based URLs, required for Vercel static deploy).

Routes:
- `/login`, `/otp` — public
- `/` (AppShell) → children: `home`, `schedule`, `clients`, `clients/:id`, `finance`, `settings` — all `requiresAuth`

Page transitions in `AppShell.vue`:
- Between tabs → directional slide (left/right based on tab order)
- Push to sub-page (e.g. client detail) → `slide-push`
- Pop back → `slide-pop`

## Auth

Demo only — any 4-digit OTP is accepted. Phone is passed via `sessionStorage`. Auth state is persisted in localStorage via the `auth` Pinia store.

## Schedule timeline

- `PX_PER_MIN = 1.2` → 72px per hour
- Working hours come from `stadium.workStart` / `stadium.workEnd`
- Empty slots between bookings are clickable dashed areas (opens BookingModal pre-filled)
- Context menu on booking card: edit / mark paid / cancel / duplicate

## Telegram Mini App

`AppShell.vue` reads `window.Telegram?.WebApp` for safe area insets:
- Top: `contentSafeAreaInset.top` or `safeAreaInset.top`
- Bottom: adds to the 116px BottomNav bottom padding

Always preserve this Telegram safe-area logic when editing `AppShell.vue`.

## What is NOT done yet

- Naive UI not wired into any component (just installed)
- No real backend — all data lives in localStorage
- No PWA / service worker
- No real OTP SMS integration
- Multi-stadium switcher in top bar (only one active stadium at a time via store)
