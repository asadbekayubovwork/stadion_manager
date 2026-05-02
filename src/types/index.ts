export type PaymentMethod = 'cash' | 'card'
export type BookingStatus = 'active' | 'cancelled'
export type PaymentStatus = 'paid' | 'unpaid'
export type Lang = 'uz' | 'ru' | 'en'

export interface Stadium {
  id: string
  name: string
  ownerId: string
  workStart: number // hour 0-23
  workEnd: number   // hour 0-23
  fields: Field[]
}

export interface Field {
  id: string
  stadiumId: string
  name: string
  pricePerHour: number // in UZS
  color?: string
}

export interface Client {
  id: string
  name: string
  phone: string
  createdAt: string
}

export interface Booking {
  id: string
  fieldId: string
  stadiumId: string
  clientId: string
  clientName: string
  clientPhone: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
  durationMin: number
  price: number
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  status: BookingStatus
  notes?: string
  createdAt: string
}

export interface AuthUser {
  id: string
  phone: string
  name: string
  avatarUrl?: string
  stadiumIds: string[]
}
