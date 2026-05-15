const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'sm_token'

export class ApiError extends Error {
  status: number
  data: any
  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null
export function setUnauthorizedHandler(h: UnauthorizedHandler) {
  onUnauthorized = h
}

interface RequestOptions {
  method?: string
  body?: any
  query?: Record<string, any>
  signal?: AbortSignal
  auth?: boolean
}

function buildUrl(path: string, query?: Record<string, any>): string {
  const url = new URL(BASE_URL + path)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal, auth = true } = opts
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (e: any) {
    throw new ApiError(e?.message || 'Network error', 0)
  }

  if (response.status === 204) return undefined as T

  let data: any = null
  const text = await response.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null)
      onUnauthorized?.()
    }
    const message =
      (data && typeof data === 'object' && (data.message || data.error || data.title)) ||
      (typeof data === 'string' && data) ||
      response.statusText ||
      'Request failed'
    throw new ApiError(String(message), response.status, data)
  }

  return data as T
}

export const http = {
  get<T = any>(path: string, query?: Record<string, any>) {
    return request<T>(path, { method: 'GET', query })
  },
  post<T = any>(path: string, body?: any) {
    return request<T>(path, { method: 'POST', body })
  },
}
