import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Client } from '../types'
import { nanoid } from '../utils/nanoid'

const STORAGE_KEY = 'sm_clients'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      clients.value = JSON.parse(saved)
    } else {
      // demo clients
      clients.value = [
        { id: 'c1', name: 'Jahongir Olimov', phone: '+998901234567', createdAt: new Date().toISOString() },
        { id: 'c2', name: "Laziz To'rayev", phone: '+998902345678', createdAt: new Date().toISOString() },
        { id: 'c3', name: 'Doniyor Hasanov', phone: '+998903456789', createdAt: new Date().toISOString() },
      ]
      persist()
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients.value))
  }

  function findByPhone(phone: string) {
    return clients.value.find(c => c.phone === phone)
  }

  function findById(id: string) {
    return clients.value.find(c => c.id === id)
  }

  function upsert(name: string, phone: string): Client {
    const existing = findByPhone(phone)
    if (existing) {
      if (existing.name !== name) {
        existing.name = name
        persist()
      }
      return existing
    }
    const client: Client = { id: nanoid(), name, phone, createdAt: new Date().toISOString() }
    clients.value.push(client)
    persist()
    return client
  }

  return { clients, init, findByPhone, findById, upsert }
})
