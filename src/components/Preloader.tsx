import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { finishIntro } from '../lib/intro'
import { stopScroll, startScroll } from '../lib/smooth'

const KEY = 'av-tuned-in'

/**
 * "Tuning in": a flat lime line becomes a live sound wave as the counter climbs,
 * collapses to a dot, and the dot opens a circular window onto the site.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const el = root.current!
    let seen = false
    try {
      seen = sessionStorage.getItem(KEY) === '1'
    } catch {
      /* ignore */
    }
    const done = () => {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      startScroll()
      setGone(true)
      finishIntro()
    }
    if (prefersReducedMotion()) return done()
    if (seen) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.05, onComplete: done })
      return
    }

    stopScroll()
    const state = { p: 0, amp: 0, squash: 1, t: 0 }
    const W = 1000
    const draw = () => {
      state.t += 0.06
      let d = ''
      for (let x = 0; x <= W; x += 5) {
        const k = x / W
        const env = Math.sin(Math.PI * k) ** 1.5
        const n = Math.sin(x * 0.045 + state.t * 3) * 0.6 + Math.sin(x * 0.11 - state.t * 5) * 0.3 + Math.sin(x * 0.013 + state.t) * 0.4
        const px = 500 + (x - 500) * state.squash
        d += `${x === 0 ? 'M' : 'L'}${px.toFixed(1)} ${(100 + n * state.amp * env).toFixed(1)}`
      }
      path.current?.setAttribute('d', d)
    }
    gsap.ticker.add(draw)

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.ticker.remove(draw)
        done()
      },
    })
    tl.to(state, {
      p: 100,
      amp: 70,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(state.p)).padStart(3, '0')
      },
    })
      .to(state, { amp: 0, duration: 0.25, ease: 'power2.in' })
      .to(state, { squash: 0, duration: 0.25, ease: 'expo.in' }, '<0.05')
      .set(path.current, { opacity: 0 })
      .fromTo(ring.current, { scale: 0, opacity: 1 }, { scale: 1, duration: 0.12 })
      .to(el, {
        '--r': `${Math.hypot(innerWidth, innerHeight) / 2 + 40}px`,
        duration: 0.75,
        ease: 'expo.inOut',
      })
      .to(ring.current, { width: Math.hypot(innerWidth, innerHeight) + 80, height: Math.hypot(innerWidth, innerHeight) + 80, borderWidth: 1, duration: 0.75, ease: 'expo.inOut' }, '<')
      .to(el, { opacity: 0, duration: 0.15 }, '-=0.1')
    return () => {
      tl.kill()
      gsap.ticker.remove(draw)
    }
  }, [])

  if (gone) return null
  const mask = 'radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1px))'
  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[300] bg-studio text-paper"
      style={{ ['--r' as string]: '0px', WebkitMaskImage: mask, maskImage: mask }}
    >
      <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[30vh] w-full -translate-y-1/2" aria-hidden="true">
        <path ref={path} d="M0 100 L1000 100" fill="none" stroke="#BAF709" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div
        ref={ring}
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full border-[8px] border-lime"
        aria-hidden="true"
      />
      <span className="mono absolute bottom-6 left-5 text-paper/70 md:left-10">Tuning in — arthikan.click</span>
      <span ref={count} className="mono absolute bottom-6 right-5 text-2xl tracking-normal text-lime md:right-10">
        000
      </span>
    </div>
  )
}
