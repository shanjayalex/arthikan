import { useSyncExternalStore } from 'react'
import { prefersReducedMotion } from './motion'

type Theme = 'light' | 'dark'
const listeners = new Set<() => void>()
const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(next: Theme) {
  const root = document.documentElement
  if (next === 'dark') root.dataset.theme = 'dark'
  else delete root.dataset.theme
  try {
    localStorage.setItem('theme', next)
  } catch {
    /* private mode */
  }
  listeners.forEach((l) => l())
}

/** Toggle with a circular view-transition reveal from the click point. */
export function toggleTheme(x = window.innerWidth - 40, y = 40) {
  const next: Theme = read() === 'dark' ? 'light' : 'dark'
  const root = document.documentElement
  if (!document.startViewTransition || prefersReducedMotion()) return apply(next)
  root.classList.add('theme-switching')
  const vt = document.startViewTransition(() => apply(next))
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  vt.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
  vt.finished.finally(() => root.classList.remove('theme-switching'))
}

export function useTheme() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    read,
    () => 'light' as Theme,
  )
}
