import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '../types'
import * as authApi from '../api/auth'
import { setToken, getToken } from '../api/http'

const USER_KEY = 'sm_user'

function pickToken(resp: any): string | null {
  return resp?.token ?? resp?.accessToken ?? resp?.jwt ?? null
}
function pickExpireAt(resp: any): string | null {
  return resp?.expireAt ?? resp?.expiresAt ?? null
}
function pickUser(resp: any): AuthUser | null {
  // Backend returns user fields at top level: { id, name, phone, token, expireAt }
  const u = resp?.user ?? resp
  if (!u || typeof u !== 'object') return null
  if (u.id === undefined && u.phone === undefined && u.name === undefined) return null
  return {
    id: Number(u.id ?? 0),
    name: u.name ?? '',
    phone: u.phone ?? '',
  }
}

const TOKEN_EXPIRE_KEY = 'sm_token_expire'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(getToken())
  const isLoggedIn = computed(() => !!token.value)

  function init() {
    const saved = localStorage.getItem(USER_KEY)
    if (saved) {
      try { user.value = JSON.parse(saved) } catch {}
    }
    token.value = getToken()
  }

  function persistUser(u: AuthUser | null) {
    user.value = u
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }

  function persistToken(t: string | null) {
    token.value = t
    setToken(t)
  }

  function persistExpireAt(v: string | null) {
    if (v) localStorage.setItem(TOKEN_EXPIRE_KEY, v)
    else localStorage.removeItem(TOKEN_EXPIRE_KEY)
  }

  async function login(phone: string, password: string) {
    const resp = await authApi.login({ phone, password })
    const t = pickToken(resp)
    if (t) persistToken(t)
    persistExpireAt(pickExpireAt(resp))
    const u = pickUser(resp) ?? { id: 0, name: '', phone }
    persistUser(u)
    return u
  }

  async function register(name: string, phone: string, password: string) {
    const resp = await authApi.register({ name, phone, password })
    const t = pickToken(resp)
    if (t) persistToken(t)
    persistExpireAt(pickExpireAt(resp))
    const u = pickUser(resp) ?? { id: 0, name, phone }
    persistUser(u)
    return u
  }

  function updateProfile(patch: Partial<AuthUser>) {
    if (!user.value) return
    persistUser({ ...user.value, ...patch })
  }

  function logout() {
    persistToken(null)
    persistUser(null)
    persistExpireAt(null)
  }

  return { user, token, isLoggedIn, init, login, register, updateProfile, logout }
})
