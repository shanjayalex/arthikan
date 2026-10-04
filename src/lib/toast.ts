import { useSyncExternalStore } from 'react'

let message: { id: number; text: string } | null = null
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setTimeout> | undefined

export function toast(text: string) {
  message = { id: Date.now(), text }
  listeners.forEach((l) => l())
  clearTimeout(timer)
  timer = setTimeout(() => {
    message = null
    listeners.forEach((l) => l())
  }, 2200)
}

export function useToast() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => message,
  )
}
