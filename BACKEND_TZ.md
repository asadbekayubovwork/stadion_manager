# StadionManager — Backend Texnik Topshiriq (MVP)

## Loyiha haqida qisqacha

Mini futbol stadionlarini boshqarish uchun B2B veb-ilova. Stadion egalari o'z maydonlarini, bronlarini va klientlarini shu ilova orqali boshqaradi. Frontend Vue 3 da yozilgan, backend bilan REST API orqali muloqot qiladi.

---

## Texnik talablar

- **Til / Framework**: istalgan (Node.js + Express/Nest, Django, Laravel va h.k.)
- **Ma'lumotlar bazasi**: PostgreSQL yoki MySQL
- **Auth**: JWT (access token + refresh token)
- **SMS**: Eskiz.uz yoki Playmobile (O'zbekiston)
- **Port**: `3000` (development)
- **Base URL**: `/api/v1`

---

## Ma'lumotlar bazasi jadvallari

### `users`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| phone | VARCHAR(20) | Unique, +998XXXXXXXXX format |
| name | VARCHAR(100) | Nullable (onboarding da to'ldiriladi) |
| created_at | TIMESTAMP | |

### `otp_codes`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| phone | VARCHAR(20) | |
| code | VARCHAR(4) | |
| attempts | INT | Default 0 |
| expires_at | TIMESTAMP | Yaratilgandan 5 daqiqa keyin |
| used | BOOLEAN | Default false |

### `refresh_tokens`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| token | TEXT | Unique |
| expires_at | TIMESTAMP | 30 kun |
| revoked | BOOLEAN | Default false |

### `stadiums`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| owner_id | UUID | FK → users |
| name | VARCHAR(100) | |
| work_start | INT | Soat (0-23), masalan 6 |
| work_end | INT | Soat (0-23), masalan 24 |
| created_at | TIMESTAMP | |

### `fields`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| stadium_id | UUID | FK → stadiums |
| name | VARCHAR(100) | Masalan "1-Maydon" |
| price_per_hour | INT | So'mda (UZS) |
| color | VARCHAR(7) | Hex, masalan #16a34a. Nullable |

### `clients`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| stadium_id | UUID | FK → stadiums |
| name | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| created_at | TIMESTAMP | |

> Bir xil telefon raqam turli stadionlarda alohida client bo'lishi mumkin.

### `bookings`
| Ustun | Tur | Izoh |
|-------|-----|------|
| id | UUID | Primary key |
| field_id | UUID | FK → fields |
| stadium_id | UUID | FK → stadiums |
| client_id | UUID | FK → clients |
| client_name | VARCHAR(100) | Tez murojaat uchun denormalize |
| client_phone | VARCHAR(20) | Tez murojaat uchun denormalize |
| date | DATE | YYYY-MM-DD |
| start_time | TIME | HH:MM |
| end_time | TIME | HH:MM |
| duration_min | INT | Daqiqada |
| price | INT | So'mda |
| payment_status | ENUM | `paid` \| `unpaid` |
| payment_method | ENUM | `cash` \| `card` \| NULL |
| status | ENUM | `active` \| `cancelled` |
| notes | TEXT | Nullable |
| created_at | TIMESTAMP | |

---

## API Endpointlar

### Xatolar formati (barcha endpointlarda bir xil)

```json
{ "error": "machine_key", "message": "Inson o'qiy oladigan xabar" }
```

HTTP status kodlari: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`

---

### 1. Auth

#### `POST /api/v1/auth/send-otp`

Telefon raqamga OTP yuboradi.

**Request:**
```json
{ "phone": "+998901234567" }
```

**Response `200`:**
```json
{ "ok": true, "retryAfter": 60 }
```

**Qoidalar:**
- Telefon format tekshirish: `+998` bilan boshlanib, jami 13 ta belgi
- Avvalgi OTP ni o'chirib, yangi yaratish
- Bir raqamga 60 soniyada 1 martadan ko'p yuborish mumkin emas → `429` qaytarish
- Bir IP dan 5 daqiqada 10 tadan ko'p so'rov → `429`

**Xatolar:**
```json
{ "error": "invalid_phone" }
{ "error": "rate_limit", "message": "60 soniyadan keyin urinib ko'ring" }
```

---

#### `POST /api/v1/auth/verify-otp`

OTP ni tekshiradi, token qaytaradi.

**Request:**
```json
{ "phone": "+998901234567", "code": "1234" }
```

**Response `200`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "user": {
    "id": "uuid",
    "phone": "+998901234567",
    "name": "Sardor",
    "isNewUser": true
  }
}
```

**Qoidalar:**
- `isNewUser: true` → frontend onboarding ekranini ko'rsatadi
- `isNewUser: false` → to'g'ridan-to'g'ri Home
- 3 marta xato kiritsa OTP ni o'chirish → keyingi urinishda yangi OTP so'rash kerak
- OTP muddati 5 daqiqa
- OTP ishlatilgandan keyin `used = true` qilib o'chirish
- Access token: **15 daqiqa** amal qiladi
- Refresh token: **30 kun** amal qiladi

**Xatolar:**
```json
{ "error": "wrong_code" }
{ "error": "expired" }
{ "error": "too_many_attempts", "message": "Yangi OTP so'rang" }
```

---

#### `POST /api/v1/auth/refresh`

Access tokenni yangilaydi.

**Request:**
```json
{ "refreshToken": "abc123..." }
```

**Response `200`:**
```json
{ "accessToken": "eyJ..." }
```

**Xatolar:**
```json
{ "error": "invalid_token" }
{ "error": "token_expired" }
```

---

#### `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{ "refreshToken": "abc123..." }
```

**Response `200`:**
```json
{ "ok": true }
```

Refresh tokenni `revoked = true` qilish.

---

#### `PATCH /api/v1/auth/me`

Yangi foydalanuvchi onboarding da ism va birinchi stadion nomini saqlash uchun.

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{ "name": "Sardor", "stadiumName": "Sardor Stadion" }
```

**Response `200`:**
```json
{
  "user": { "id", "phone", "name" },
  "stadium": { "id", "name", "workStart": 6, "workEnd": 24, "fields": [] }
}
```

---

### 2. Stadionlar

> Barcha quyidagi endpointlar `Authorization: Bearer <token>` talab qiladi.
> Foydalanuvchi faqat o'zining stadionlarini ko'ra/o'zgartira oladi.

---

#### `GET /api/v1/stadiums`

Foydalanuvchining barcha stadionlari (maydonlar bilan birga).

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "name": "Sardor Stadion",
    "workStart": 6,
    "workEnd": 24,
    "fields": [
      { "id": "uuid", "name": "1-Maydon", "pricePerHour": 250000, "color": "#16a34a" }
    ]
  }
]
```

---

#### `POST /api/v1/stadiums`

**Request:**
```json
{ "name": "Yangi Stadion", "workStart": 6, "workEnd": 24 }
```

**Response `201`:** yangi stadion ob'ekti (fields: [] bilan)

---

#### `PATCH /api/v1/stadiums/:id`

**Request** (faqat o'zgartiriladigan maydonlar):
```json
{ "name": "Yangi nom", "workStart": 8, "workEnd": 23 }
```

**Response `200`:** yangilangan stadion ob'ekti

---

#### `DELETE /api/v1/stadiums/:id`

Stadion va unga tegishli barcha maydon, booking, klientlarni o'chirish.

**Response `200`:** `{ "ok": true }`

---

#### `POST /api/v1/stadiums/:id/fields`

**Request:**
```json
{ "name": "2-Maydon", "pricePerHour": 200000, "color": "#2563eb" }
```

**Response `201`:** yangi maydon ob'ekti

---

#### `PATCH /api/v1/stadiums/:stadiumId/fields/:fieldId`

**Request:**
```json
{ "name": "3-Maydon", "pricePerHour": 300000 }
```

**Response `200`:** yangilangan maydon ob'ekti

---

#### `DELETE /api/v1/stadiums/:stadiumId/fields/:fieldId`

**Response `200`:** `{ "ok": true }`

---

### 3. Bronlar (Bookings)

#### `GET /api/v1/bookings`

**Query parametrlar:**
| Parametr | Majburiy | Izoh |
|----------|----------|------|
| stadiumId | Ha | |
| date | Yo'q | YYYY-MM-DD — muayyan kun |
| fieldId | Yo'q | Muayyan maydon |
| status | Yo'q | `active` \| `cancelled` |
| paymentStatus | Yo'q | `paid` \| `unpaid` |

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "fieldId": "uuid",
    "stadiumId": "uuid",
    "clientId": "uuid",
    "clientName": "Jahongir",
    "clientPhone": "+998901234567",
    "date": "2025-06-15",
    "startTime": "18:00",
    "endTime": "19:30",
    "durationMin": 90,
    "price": 375000,
    "paymentStatus": "unpaid",
    "paymentMethod": null,
    "status": "active",
    "notes": "",
    "createdAt": "2025-06-15T10:00:00Z"
  }
]
```

---

#### `POST /api/v1/bookings`

**Request:**
```json
{
  "fieldId": "uuid",
  "stadiumId": "uuid",
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
```

**Qoidalar:**
- Server tomonida vaqt to'qnashuvi (conflict) tekshirish — bir maydon, bir kunda, vaqtlar kesishsa `409`
- `clientPhone` bo'yicha klientni topish yoki avtomatik yaratish (upsert)

**Response `201`:** yaratilgan bron ob'ekti

**Xatolar:**
```json
{ "error": "conflict", "message": "Bu vaqtda maydon band" }
```

---

#### `PATCH /api/v1/bookings/:id`

**Request** (faqat o'zgartiriladigan maydonlar):
```json
{ "startTime": "19:00", "endTime": "20:30", "durationMin": 90, "price": 375000, "notes": "..." }
```

- Vaqt o'zgartirilsa conflict qayta tekshirilsin (o'zini exclude qilib)

**Response `200`:** yangilangan bron ob'ekti

---

#### `POST /api/v1/bookings/:id/pay`

**Request:**
```json
{ "method": "cash" }
```

**Response `200`:** yangilangan bron ob'ekti (`paymentStatus: "paid"`)

---

#### `POST /api/v1/bookings/:id/cancel`

**Response `200`:** yangilangan bron ob'ekti (`status: "cancelled"`)

---

### 4. Klientlar

#### `GET /api/v1/clients`

**Query parametrlar:**
| Parametr | Majburiy | Izoh |
|----------|----------|------|
| stadiumId | Ha | |
| search | Yo'q | Ism yoki telefon bo'yicha qidirish |

**Response `200`:** klientlar ro'yxati

---

#### `GET /api/v1/clients/:id`

**Response `200`:**
```json
{
  "id": "uuid",
  "name": "Jahongir",
  "phone": "+998901234567",
  "createdAt": "...",
  "bookings": [ ...bron ob'ektlari, yangilaridan eskisiga... ]
}
```

---

#### `PATCH /api/v1/clients/:id`

Faqat ism o'zgartirish mumkin.

**Request:**
```json
{ "name": "Jahongir Olimov" }
```

**Response `200`:** yangilangan klient ob'ekti

---

### 5. Moliya

#### `GET /api/v1/finance/summary`

**Query parametrlar:**
| Parametr | Majburiy | Izoh |
|----------|----------|------|
| stadiumId | Ha | |
| from | Ha | YYYY-MM-DD |
| to | Ha | YYYY-MM-DD |

**Response `200`:**
```json
{
  "total": 3750000,
  "cash": 2500000,
  "card": 1250000,
  "bookingsCount": 15,
  "unpaidTotal": 500000
}
```

Faqat `status = active` va `paymentStatus = paid` bronlar hisoblanadi.

---

## Umumiy qoidalar

1. **Autentifikatsiya**: `/auth/*` dan tashqari barcha endpoint `Authorization: Bearer <token>` talab qiladi. Token yo'q yoki noto'g'ri bo'lsa → `401`

2. **Ruxsat**: Foydalanuvchi boshqaning stadioniga murojaat qilsa → `403`

3. **Mavjud emas**: So'ralgan resurs topilmasa → `404`

4. **Validatsiya**: Majburiy maydon bo'sh bo'lsa → `422`

5. **Barcha vaqtlar UTC** da saqlansin. `date` (DATE), `startTime`/`endTime` (TIME) alohida ustunlarda.

6. **Response kalitlari** camelCase bo'lsin (frontend shu formatda kutadi):
   - `stadium_id` → `stadiumId`
   - `work_start` → `workStart`
   - `created_at` → `createdAt`
   va h.k.

---

## Kelishish kerak bo'lgan narsalar

1. SMS provayder: Eskiz.uz yoki Playmobile?
2. Hosting: qaerda deploy qilinadi?
3. Development uchun base URL qanday bo'ladi?
4. CORS: frontend qaysi domendan ishlaydi?
