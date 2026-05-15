export type Lang = 'uz' | 'ru' | 'en'
export type PaymentMethod = 'cash' | 'card'
export type BookingStatus = 'active' | 'cancelled'
export type PaymentStatus = 'paid' | 'unpaid'

// 1 = cash, 2 = card (mapped from backend PaymentMethodId)
export const PAYMENT_METHOD_CASH = 1
export const PAYMENT_METHOD_CARD = 2

export interface AuthUser {
  id: number
  phone: string
  name: string
}

export interface Settings {
  name: string
  phone?: string
  tariffId?: number
  language: Lang | string
  workStartHour: number
  workEndHour: number
  averagePricePerHour?: number
  fields?: Field[]
}

export interface Field {
  id: number
  name: string
  pricePerHour: number
  isActive?: boolean
  color?: string // assigned locally for UI rendering
}

export interface Customer {
  id: number
  name: string
  phone: string
  createdAt?: string
  bookingsCount?: number
  totalSpent?: number
  lastBookingAt?: string
}

export interface CustomerDetail extends Customer {
  bookings?: Booking[]
}

// Normalized booking used throughout the UI.
// Raw ISO times from API are kept in *Iso fields.
export interface Booking {
  id: number
  fieldId: number
  fieldName?: string
  customerId: number | null
  customerName: string
  customerPhone: string
  date: string          // YYYY-MM-DD
  startTime: string     // HH:MM
  endTime: string       // HH:MM
  startTimeIso: string  // original ISO from API
  endTimeIso: string    // original ISO from API
  durationMin: number
  price: number
  isPaid: boolean
  paymentStatus: PaymentStatus
  paymentMethodId: number | null
  paymentMethod?: PaymentMethod
  status: BookingStatus
  notes?: string | null
  createdAt?: string
}

export interface ScheduleField {
  id: number
  name: string
  pricePerHour?: number
  bookings: Booking[]
}

export interface ScheduleResponse {
  workStartHour?: number
  workEndHour?: number
  date?: string
  fields?: ScheduleField[]
  bookings?: Booking[]
}

export interface DashboardScheduleHour {
  hour: number
  isBusy: boolean
}
export interface DashboardData {
  todayIncome: number
  incomeChangePercent: number
  todayBookingsCount: number
  unpaidBookingsCount: number
  busyHours: number
  totalHours: number
  todaySchedule: DashboardScheduleHour[]
  recentBookings: Booking[]
  [k: string]: any
}

export interface FinanceDailyIncome {
  date: string      // YYYY-MM-DD
  dayLabel: string  // e.g. "Du"
  amount: number
}
export interface FinanceData {
  totalIncome: number
  changePercent: number
  cashAmount: number
  cardAmount: number
  cashPercent: number
  cardPercent: number
  unpaidCount: number
  totalUnpaid: number
  dailyIncomes: FinanceDailyIncome[]
  unpaidBookings: Booking[]
  [k: string]: any
}
