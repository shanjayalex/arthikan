import { useEffect, useRef } from 'react'
import { signal } from '../lib/signal'

/** A thin lime wave across the top: its length is scroll progress, its wiggle is scroll speed. */
export function ScrollProgress() {
  const path = useRef<SVGPathElement>(null)
  const clip = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    let amp = 0
    const draw = (now: number) => {
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, scrollY / max) : 0
      clip.current!.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`
      amp += (Math.min(5, Math.abs(signal.velocity) * 0.35 + signal.audio * 4) - amp) * 0.15
      const w = innerWidth
      let d = 'M0 6'
      for (let x = 0; x <= w; x += 8) d += ` L${x} ${(6 + Math.sin(x * 0.05 + now / 140) * amp).toFixed(1)}`
      path.current!.setAttribute('d', d)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div ref={clip} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-3">
      <svg className="h-3 w-full overflow-visible">
        <path ref={path} fill="none" stroke="var(--color-lime)" strokeWidth="2" />
      </svg>
    </div>
  )
}
