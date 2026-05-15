import { http } from './http'
import type { Settings } from '../types'

export function getSettings() {
  return http.get<Settings>('/settings/get')
}

export function updateSettings(payload: {
  name?: string
  workStartHour?: number
  workEndHour?: number
  language?: string
}) {
  return http.post<Settings>('/settings/update', payload)
}
