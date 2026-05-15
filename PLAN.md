# StadionManager — Frontend & Backend Ish Rejasi

> Maqsad: hozir localStorage-da ishlaydigan demo ilovani real backend bilan ulash.

---

## Hozirgi holat (MVP tayyor)

Frontend to'liq yozilgan, lekin backend yo'q — barcha ma'lumot brauzer localStorage-da saqlanadi.

| Ekran | Holat |
|-------|-------|
| Login + OTP | UI tayyor, haqiqiy SMS yo'q |
| Home / Dashboard | Tayyor (localStorage) |
| Schedule / Timeline | Tayyor (localStorage) |
| Booking modal | Tayyor (localStorage) |
| Clients | Tayyor (localStorage) |
| Finance | Tayyor (localStorage) |
| Settings | Tayyor (localStorage) |

---

## Bosqichlar

```
Bosqich 1 — Auth (OTP)
Bosqich 2 — Stadion va Maydon CRUD
Bosqich 3 — Bookinglar
Bosqich 4 — Klientlar
Bosqich 5 — Moliya hisobotlari
```

---

## Backend dasturchi vazifalar

### Bosqich 1 — Auth

**POST `/auth/send-otp`**
```json
Body:    { "phone": "+998901234567" }
Success: { "ok": true }
Error:   { "error": "invalid_phone" }
```
- Telefon raqamni tekshir (+998 XX XXX XX XX format)
- 4-raqamli OTP generatsiya qil
- SMS yuborish servisi ulash (Playmobile yoki Eskiz — O'zbekiston)
- OTP ni DB/Redis ga 5 daqiqa TTL bilan saqlash
- 60 soniya ichida takroriy so'rovni bloklash (rate limit)

**POST `/auth/verify-otp`**
```json
Body:    { "phone": "+998901234567", "code": "1234" }
Success: { "token": "jwt...", "user": { "id", "phone", "name", "stadiumIds" } }
Error:   { "error": "wrong_code" | "expired" | "too_many_attempts" }
```
- 3 marta xato kiritsa OTP ni o'chirish
- JWT access token + refresh token qaytarish
- Agar foydalanuvchi yangi bo'lsa — avtomatik register qilish

**POST `/auth/refresh`**
```json
Body:    { "refreshToken": "..." }
Success: { "token": "jwt..." }
```

**POST `/auth/logout`**
- Refresh token ni bekor qilish

---

### Bosqich 2 — Stadionlar va Maydonlar

> Barcha endpoint lar `Authorization: Bearer <token>` talab qiladi.
> Foydalanuvchi faqat o'ziga tegishli stadionlarni ko'ra oladi.

**GET `/stadiums`**
```json
Response: [{ "id", "name", "workStart", "workEnd", "fields": [{ "id", "name", "pricePerHour", "color" }] }]
```

**POST `/stadiums`**
```json
Body:    { "name": "Sardor Stadion", "workStart": 6, "workEnd": 24 }
Success: { id, name, workStart, workEnd, fields: [] }
```

**PATCH `/stadiums/:id`**
```json
Body:    { "name"?, "workStart"?, "workEnd"? }
```

**DELETE `/stadiums/:id`**
- Tegishli booking lar va maydonlarni ham o'chirish (cascade)

**POST `/stadiums/:id/fields`**
```json
Body:    { "name": "1-Maydon", "pricePerHour": 250000, "color": "#16a34a" }
```

**PATCH `/stadiums/:stadiumId/fields/:fieldId`**
```json
Body:    { "name"?, "pricePerHour"?, "color"? }
```

**DELETE `/stadiums/:stadiumId/fields/:fieldId`**

---

### Bosqich 3 — Bookinglar

**GET `/bookings`**
```
Query params:
  stadiumId=xxx       (majburiy)
  date=2025-06-15     (ixtiyoriy — muayyan kun)
  fieldId=xxx         (ixtiyoriy — muayyan maydon)
  from=2025-06-01     (ixtiyoriy — oraliq)
  to=2025-06-30
  status=active|cancelled
  paymentStatus=paid|unpaid
```
```json
Response: [{ booking ob'ektlari }]
```

**POST `/bookings`**
```json
Body: {
  "fieldId": "...",
  "stadiumId": "...",
  "clientName": "Jahongir",
  "clientPhone": "+998901234567",
  "date": "2025-06-15",
  "startTime": "18:00",
  "endTime": "19:30",
  "durationMin": 90,
  "price": 375000,
  "paymentStatus": "unpaid",
  "notes": ""
}
Success: { booking ob'ekti }
Error:   { "error": "conflict" }  ← vaqt to'qnashsa
```
- Server tomonida conflict tekshirish qilish (bir vaqtda ikki so'rov kelsa ham xavfsiz bo'lsin)
- Telefon raqam bo'yicha klient avtomatik upsert qilinsin

**PATCH `/bookings/:id`**
```json
Body: { "startTime"?, "endTime"?, "durationMin"?, "price"?, "notes"? }
```
- Vaqt o'zgartirilsa conflict qayta tekshirilsin

**POST `/bookings/:id/pay`**
```json
Body:    { "method": "cash" | "card" }
Success: { booking ob'ekti yangilangan holda }
```

**POST `/bookings/:id/cancel`**

---

### Bosqich 4 — Klientlar

**GET `/clients`**
```
Query params:
  stadiumId=xxx   (majburiy — faqat o'sha stadion klientlari)
  search=jahon    (ixtiyoriy — ism yoki telefon bo'yicha qidirish)
```

**GET `/clients/:id`**
```json
Response: { client + bookings: [...] }
```

**PATCH `/clients/:id`**
```json
Body: { "name"? }
```
- Telefon raqamni o'zgartirish mumkin emas (u identifikator)

---

### Bosqich 5 — Moliya hisobotlari

**GET `/finance/summary`**
```
Query params:
  stadiumId=xxx   (majburiy)
  from=2025-06-01
  to=2025-06-30
```
```json
Response: {
  "total": 3750000,
  "cash": 2500000,
  "card": 1250000,
  "bookingsCount": 15,
  "unpaidTotal": 500000
}
```

---

### Texnik talablar (backend uchun)

- **Ma'lumotlar bazasi**: PostgreSQL yoki MySQL (relatsion, chunki booking-field-stadium bog'liqligi bor)
- **ORM**: istalgan (Prisma, TypeORM, Sequelize)
- **Auth**: JWT, access token 15 daqiqa, refresh token 30 kun
- **Rate limiting**: OTP endpoint ga — IP bo'yicha 5 so'rov/daqiqa
- **CORS**: frontend domeniga ruxsat berish
- **Validation**: barcha input larda server-side validation
- **Xatolar formati** har doim bir xil bo'lsin:
  ```json
  { "error": "machine_readable_key", "message": "Human readable" }
  ```
- **Pagination**: `/bookings` va `/clients` endpoint lari `page` + `limit` qo'llab-quvvatlashi kerak (keyingi bosqichda)
- **Timezone**: barcha vaqt UTC da saqlansin, `date` (YYYY-MM-DD) va `startTime`/`endTime` (HH:MM) alohida ustunlarda

---

## Frontend dasturchi (o'zim) vazifalar

### Bosqich 1 — Auth

- [ ] `src/api/http.ts` — Axios/fetch wrapper yaratish (base URL, token header, 401 → refresh → retry)
- [ ] `src/api/auth.ts` — `sendOtp()`, `verifyOtp()`, `refreshToken()`, `logout()` funksiyalari
- [ ] `src/stores/auth.ts` ga `token` va `refreshToken` qo'shish; localStorage ga saqlash
- [ ] `OtpView.vue` — haqiqiy API ga ulash, xato holatlarni ko'rsatish (noto'g'ri kod, muddati o'tgan)
- [ ] Router guard-ga token amal qilishini tekshirish qo'shish
- [ ] 60 soniyalik qayta yuborish taymeri `OtpView.vue` da

### Bosqich 2 — Stadionlar va Maydonlar

- [ ] `src/api/stadiums.ts` — barcha CRUD funksiyalar
- [ ] `src/stores/stadiums.ts` — localStorage o'chirib API ga ulash
- [ ] `SettingsView.vue` da loading/error holatlarni qo'shish

### Bosqich 3 — Bookinglar

- [ ] `src/api/bookings.ts` — `getBookings()`, `createBooking()`, `updateBooking()`, `payBooking()`, `cancelBooking()`
- [ ] `src/stores/bookings.ts` — localStorage o'chirib API ga ulash
- [ ] `ScheduleView.vue` — sanani o'zgartirganda API dan qayta yuklash
- [ ] `BookingModal.vue` — conflict xatosini ko'rsatish
- [ ] Yuklanish holatida skeleton yoki spinner qo'shish

### Bosqich 4 — Klientlar

- [ ] `src/api/clients.ts` — `getClients()`, `getClient()`, `updateClient()`
- [ ] `src/stores/clients.ts` — localStorage o'chirib API ga ulash
- [ ] `ClientsView.vue` — qidiruv server-side ga o'tkazish (debounce bilan)

### Bosqich 5 — Moliya

- [ ] `src/api/finance.ts` — `getSummary()`
- [ ] `FinanceView.vue` — API dan hisob-kitob olish

### Qo'shimcha (API integratsiyadan keyin)

- [ ] `src/api/http.ts` da global xato handler — toast notification
- [ ] Token muddati tugaganida auto refresh, muvaffaqiyatsiz bo'lsa `/login` ga yo'naltirish
- [ ] Offline holat uchun xabar ko'rsatish (network error toast)
- [ ] PWA / service worker (keyingi bosqich)
- [ ] Telegram Bot deep link integratsiyasi (keyingi bosqich)

---

## API URL kelishuv

Backendchi quyidagi base URL ni bersin:

```
Development:  http://localhost:3000/api/v1
Production:   https://api.stadion-manager.uz/v1   (yoki boshqa)
```

Frontend `.env` fayllari:
```
.env.development    VITE_API_URL=http://localhost:3000/api/v1
.env.production     VITE_API_URL=https://api.stadion-manager.uz/v1
```

---

## Ma'lumot modeli kelishuvi

Frontend `src/types/index.ts` dagi tiplar backend response lari bilan mos bo'lishi kerak.
Backend o'z response larini quyidagicha qaytarsin:

```ts
// Booking response
{
  id: string          // UUID yoki nanoid
  fieldId: string
  stadiumId: string
  clientId: string
  clientName: string
  clientPhone: string
  date: string        // "YYYY-MM-DD"
  startTime: string   // "HH:MM"
  endTime: string     // "HH:MM"
  durationMin: number
  price: number       // so'mda (UZS)
  paymentStatus: "paid" | "unpaid"
  paymentMethod: "cash" | "card" | null
  status: "active" | "cancelled"
  notes: string | null
  createdAt: string   // ISO 8601
}
```

---

## Birinchi uchrashuvda hal qilish kerak bo'lgan savollar

1. Backend texnologiyasi qaysi? (Node/Nest, Django, Laravel, Go?)
2. SMS provayder qaysi? (Playmobile, Eskiz.uz, boshqa?)
3. Hosting qayerda? (VPS, Heroku, Railway, boshqa?)
4. Ma'lumotlar bazasi: PostgreSQL yoki MySQL?
5. Staging server bo'ladimi yoki to'g'ridan-to'g'ri production?
