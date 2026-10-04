import { useEffect, useRef } from 'react'
import { energy, signal } from '../lib/signal'
import { prefersReducedMotion } from '../lib/motion'

type Props = {
  className?: string
  height?: number
  /** idle amplitude in px */
  base?: number
  /** how strongly the global signal (scroll, audio, beats) moves this line */
  gain?: number
  mode?: 'wave' | 'heartbeat'
  color?: string
  strokeWidth?: number
}

/**
 * The lime "signal" thread. A single SVG path redrawn every frame while on screen;
 * its amplitude follows scroll velocity, the trailer audio and section beats.
 */
export function WaveLine({ className = '', height = 48, base = 3, gain = 14, mode = 'wave', color = 'var(--color-lime)', strokeWidth = 1.5 }: Props) {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = svg.current!
    let w = el.clientWidth
    let raf = 0
    let visible = false
    let amp = base
    const still = prefersReducedMotion()
    const ro = new ResizeObserver(() => (w = el.clientWidth))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(draw)
    })
    io.observe(el)
    const mid = height / 2

    function draw(now: number) {
      raf = 0
      if (!visible) return
      const t = still ? 0 : now / 1000
      amp += (base + energy() * gain - amp) * 0.12
      let d = `M0 ${mid}`
      const step = 6
      if (mode === 'heartbeat') {
        // flat line with a periodic heartbeat blip travelling across
        const period = 2.4
        const head = ((t % period) / period) * (w + 200) - 100
        for (let x = 0; x <= w; x += step) {
          const dx = x - head
          let y = Math.sin(x * 0.02 + t * 2) * amp * 0.25
          if (Math.abs(dx) < 60) y -= Math.sin((dx / 60) * Math.PI * 2) * (mid * 0.85) * Math.exp(-((dx / 30) ** 2))
          d += ` L${x} ${(mid + y).toFixed(1)}`
        }
      } else {
        for (let x = 0; x <= w; x += step) {
          const k = x / w
          const env = Math.sin(Math.PI * k) * 0.7 + 0.3
          const y =
            Math.sin(x * 0.018 + t * 2.2) * 0.6 +
            Math.sin(x * 0.041 - t * 3.1) * 0.3 +
            Math.sin(x * 0.007 + t * 0.9 + signal.velocity * 0.01) * 0.4
          d += ` L${x} ${(mid + y * amp * env).toFixed(1)}`
        }
      }
      path.current!.setAttribute('d', d)
      if (!still) raf = requestAnimationFrame(draw)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [base, gain, height, mode])

  return (
    <svg ref={svg} className={`block w-full overflow-visible ${className}`} height={height} aria-hidden="true">
      <path ref={path} d={`M0 ${height / 2} L4000 ${height / 2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}
