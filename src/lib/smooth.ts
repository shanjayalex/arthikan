import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'
import { signal } from './signal'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false })
  lenis.on('scroll', (l: Lenis) => {
    signal.velocity = l.velocity
    ScrollTrigger.update()
  })
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const offset = opts.offset ?? -72
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: opts.immediate, duration: 1.4 })
    return
  }
  if (typeof target === 'number') return window.scrollTo({ top: target, behavior: opts.immediate ? 'auto' : 'smooth' })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
