import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUser } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isLoggedIn = ref(false)

  function init() {
    const saved = localStorage.getItem('sm_user')
    if (saved) {
      user.value = JSON.parse(saved)
      isLoggedIn.value = true
    }
  }

  function login(u: AuthUser) {
    user.value = u
    isLoggedIn.value = true
    localStorage.setItem('sm_user', JSON.stringify(u))
  }

  function logout() {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('sm_user')
  }

  return { user, isLoggedIn, init, login, logout }
})
