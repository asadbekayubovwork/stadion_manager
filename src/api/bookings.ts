import { http } from './http'
import type { Booking, ScheduleResponse } from '../types'

export function getSchedule(date: string) {
  return http.get<ScheduleResponse>('/bookings/getschedule', { date })
}

export function getBookings(params: { date?: string; fieldId?: number } = {}) {
  return http.get<Booking[]>('/bookings/getlist', params)
}

export function getBooking(id: number) {
  return http.get<Booking>(`/bookings/get/${id}`)
}

export interface CreateBookingPayload {
  fieldId: number
  customerId?: number | null
  customerName?: string | null
  customerPhone?: string | null
  startTime: string // ISO datetime
  endTime: string   // ISO datetime
  isPaid: boolean
  paymentMethodId?: number | null
  notes?: string | null
}

export function createBooking(payload: CreateBookingPayload) {
  return http.post<Booking>('/bookings/create', payload)
}

export interface UpdateBookingPayload {
  id: number
  customerId?: number | null
  customerName?: string | null
  customerPhone?: string | null
  startTime?: string | null
  endTime?: string | null
  notes?: string | null
}

export function updateBooking(payload: UpdateBookingPayload) {
  return http.post<Booking>('/bookings/update', payload)
}

export function deleteBooking(id: number) {
  return http.post<void>('/bookings/delete', { id })
}

export function payBooking(id: number, paymentMethodId: number) {
  return http.post<Booking>('/bookings/pay', { id, paymentMethodId })
}
