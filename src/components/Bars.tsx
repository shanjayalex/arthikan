import { useEffect, useRef } from 'react'
import { readBars } from '../lib/audio'
import { prefersReducedMotion } from '../lib/motion'

/** Frequency visualiser. Real analyser data while playing; a simulated voice otherwise. */
export function Bars({ count = 48, className = '', color = 'var(--color-lime)' }: { count?: number; className?: string; color?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const bars = Array.from(wrap.current!.children) as HTMLElement[]
    const data = new Float32Array(count)
    let raf = 0
    let visible = false
    const still = prefersReducedMotion()
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(draw)
    })
    io.observe(wrap.current!)
    function draw(now: number) {
      raf = 0
      if (!visible) return
      readBars(data, still ? 1 : now / 1000)
      for (let i = 0; i < count; i++) bars[i].style.transform = `scaleY(${data[i].toFixed(3)})`
      if (!still) raf = requestAnimationFrame(draw)
    }
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [count])
  return (
    <div ref={wrap} className={`flex items-center gap-[2px] ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="h-full flex-1 origin-center rounded-full" style={{ background: color, transform: 'scaleY(0.1)' }} />
      ))}
    </div>
  )
}
