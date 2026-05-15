import dayjs from 'dayjs'
import type { Booking, PaymentMethod } from '../types'
import { PAYMENT_METHOD_CASH, PAYMENT_METHOD_CARD } from '../types'

function methodFromId(id: number | null | undefined): PaymentMethod | undefined {
  if (id === PAYMENT_METHOD_CARD) return 'card'
  if (id === PAYMENT_METHOD_CASH) return 'cash'
  return undefined
}

export function methodToId(method: PaymentMethod): number {
  return method === 'card' ? PAYMENT_METHOD_CARD : PAYMENT_METHOD_CASH
}

// Normalize a raw booking from API into our UI shape.
// Accepts the loose backend shape (ISO datetimes, isPaid, etc.) and
// produces the rich Booking with date/HH:MM splits and derived flags.
export function normalizeBooking(raw: any): Booking {
  const startIso = raw.startTime ?? raw.start ?? raw.startAt
  const endIso = raw.endTime ?? raw.end ?? raw.endAt
  const start = dayjs(startIso)
  const end = dayjs(endIso)
  const durationMin =
    typeof raw.durationMin === 'number'
      ? raw.durationMin
      : Math.max(0, Math.round(end.diff(start, 'minute')))

  const isPaid = !!(raw.isPaid ?? raw.paid ?? raw.paymentStatus === 'paid')
  const status: 'active' | 'cancelled' =
    raw.status === 'cancelled' || raw.isCancelled ? 'cancelled' : 'active'
  const paymentMethodId =
    raw.paymentMethodId ?? raw.paymentMethod?.id ?? null

  return {
    id: Number(raw.id),
    fieldId: Number(raw.fieldId ?? raw.field?.id ?? 0),
    fieldName: raw.fieldName ?? raw.field?.name,
    customerId: raw.customerId ?? raw.customer?.id ?? null,
    customerName: raw.customerName ?? raw.customer?.name ?? '',
    customerPhone: raw.customerPhone ?? raw.customer?.phone ?? '',
    date: start.isValid() ? start.format('YYYY-MM-DD') : '',
    startTime: start.isValid() ? start.format('HH:mm') : '',
    endTime: end.isValid() ? end.format('HH:mm') : '',
    startTimeIso: startIso,
    endTimeIso: endIso,
    durationMin,
    price: Number(raw.price ?? 0),
    isPaid,
    paymentStatus: isPaid ? 'paid' : 'unpaid',
    paymentMethodId,
    paymentMethod: methodFromId(paymentMethodId),
    status,
    notes: raw.notes ?? null,
    createdAt: raw.createdAt,
  }
}

// Build ISO datetime in local timezone for sending to the API:
// e.g. ('2025-06-15', '18:00') → '2025-06-15T18:00:00'
export function buildIso(date: string, hhmm: string): string {
  return `${date}T${hhmm}:00`
}

export function parseScheduleBookings(resp: any): Booking[] {
  if (!resp) return []
  if (Array.isArray(resp)) return resp.map(normalizeBooking)
  if (Array.isArray(resp.bookings)) return resp.bookings.map(normalizeBooking)
  if (Array.isArray(resp.fields)) {
    const out: Booking[] = []
    for (const f of resp.fields) {
      const fid = f.fieldId ?? f.id
      const fname = f.fieldName ?? f.name
      if (Array.isArray(f.bookings)) {
        for (const b of f.bookings) {
          out.push(normalizeBooking({ ...b, fieldId: b.fieldId ?? fid, fieldName: b.fieldName ?? fname }))
        }
      }
    }
    return out
  }
  return []
}
