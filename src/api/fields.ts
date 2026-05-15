import { http } from './http'
import type { Field } from '../types'

export function getFields() {
  return http.get<Field[]>('/fields/getlist')
}

export function createField(payload: { name: string; pricePerHour: number }) {
  return http.post<Field>('/fields/create', payload)
}

export function updateField(payload: {
  id: number
  name?: string
  pricePerHour?: number
  isActive?: boolean
}) {
  return http.post<Field>('/fields/update', payload)
}

export function deleteField(id: number) {
  return http.post<void>('/fields/delete', { id })
}
