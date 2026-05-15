import { http } from './http'
import type { Customer, CustomerDetail } from '../types'

export function getCustomers(search?: string) {
  return http.get<Customer[]>('/customers/getlist', search ? { search } : undefined)
}

export function getCustomer(id: number) {
  return http.get<CustomerDetail>(`/customers/get/${id}`)
}

export function createCustomer(payload: { name: string; phone: string }) {
  return http.post<Customer>('/customers/create', payload)
}

export function updateCustomer(payload: { id: number; name?: string; phone?: string }) {
  return http.post<Customer>('/customers/update', payload)
}

export function deleteCustomer(id: number) {
  return http.post<void>('/customers/delete', { id })
}
