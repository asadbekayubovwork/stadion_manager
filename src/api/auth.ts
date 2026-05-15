import { http } from './http'

export interface LoginPayload {
  phone: string
  password: string
}
export interface RegisterPayload {
  name: string
  phone: string
  password: string
}

export interface AuthResponse {
  token?: string
  accessToken?: string
  user?: {
    id: number
    name: string
    phone: string
  }
  // Some backends return user fields at top level — keep loose
  [k: string]: any
}

export function login(payload: LoginPayload) {
  return http.post<AuthResponse>('/auth/login', payload)
}

export function register(payload: RegisterPayload) {
  return http.post<AuthResponse>('/auth/register', payload)
}
