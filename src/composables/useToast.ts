import { ref } from 'vue'

export type ToastKind = 'error' | 'success' | 'info'

export interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

const toasts = ref<ToastItem[]>([])
let nextId = 1

function push(message: string, kind: ToastKind, durationMs = 3500) {
  const id = nextId++
  toasts.value.push({ id, kind, message })
  window.setTimeout(() => dismiss(id), durationMs)
  return id
}

function dismiss(id: number) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

export function useToast() {
  return {
    toasts,
    error: (msg: string, ms?: number) => push(msg, 'error', ms),
    success: (msg: string, ms?: number) => push(msg, 'success', ms),
    info: (msg: string, ms?: number) => push(msg, 'info', ms),
    dismiss,
  }
}

export function extractApiErrorMessage(data: any, fallback: string): string {
  if (data && typeof data === 'object') {
    const errs = data.errors
    if (errs && typeof errs === 'object') {
      for (const key of Object.keys(errs)) {
        const v = errs[key]
        if (Array.isArray(v) && v.length && typeof v[0] === 'string') return v[0]
        if (typeof v === 'string') return v
      }
    }
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
    if (typeof data.title === 'string' && data.title !== 'One or more validation errors occurred.') return data.title
  }
  return fallback
}
