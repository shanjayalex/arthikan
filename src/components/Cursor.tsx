import { useEffect, useRef, useState } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion'

/**
 * Dot + ring cursor. Any element with data-cursor="PLAY|VIEW|DRAG|COPY|OPEN" changes the
 * ring into a lime label. Elements with data-magnetic get pulled toward the pointer.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [hover, setHover] = useState(false)
  const [enabled] = useState(() => isFinePointer())

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const reduce = prefersReducedMotion()
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: reduce ? 0.01 : 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: reduce ? 0.01 : 0.45, ease: 'power3' })
    let magnet: HTMLElement | null = null

    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY, opacity: 1 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      if (magnet && !reduce) {
        const r = magnet.getBoundingClientRect()
        gsap.to(magnet, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.3,
          y: (e.clientY - (r.top + r.height / 2)) * 0.3,
          duration: 0.4,
          ease: 'power3',
        })
      }
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      const interactive = t.closest('a, button, input, textarea, label, [role="button"]')
      let l = labelled?.dataset.cursor || ''
      if (!l && interactive?.matches('a[target="_blank"]')) l = 'OPEN'
      setLabel(l)
      setHover(!!interactive || !!labelled)
      const m = t.closest<HTMLElement>('[data-magnetic]')
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        magnet = m
      }
    }
    const leaveWindow = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 })
    const enterWindow = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 })
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leaveWindow)
    document.addEventListener('pointerenter', enterWindow)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leaveWindow)
      document.removeEventListener('pointerenter', enterWindow)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      <div ref={dot} className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full bg-white opacity-0 mix-blend-difference" />
      <div ref={ring} className="absolute left-0 top-0 opacity-0">
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-expo)]"
          style={{
            width: label ? 84 : hover ? 56 : 40,
            height: label ? 84 : hover ? 56 : 40,
            background: label ? 'var(--color-lime)' : 'transparent',
            borderColor: label ? 'var(--color-lime)' : 'color-mix(in oklab, var(--fg) 45%, transparent)',
          }}
        >
          {label && <span className="mono text-[0.62rem] font-medium text-ink">{label}</span>}
        </div>
      </div>
    </div>
  )
}
