import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

/** A poster assembling itself, like watching a Figma file get built. */
export function PosterDemo({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const q = gsap.utils.selector(root)
    const t = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6, defaults: { ease: 'expo.out' } })
    t.set(q('[data-flood]'), { clipPath: 'inset(100% 0 0 0)' })
      .set(q('[data-word] span'), { opacity: 0 })
      .fromTo(q('[data-gv]'), { scaleY: 0 }, { scaleY: 1, duration: 0.8, stagger: 0.05, transformOrigin: 'top' })
      .fromTo(q('[data-gh]'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.05, transformOrigin: 'left' }, '<0.1')
      .fromTo(q('[data-circle]'), { y: -260, scale: 0.6 }, { y: 0, scale: 1, duration: 1, ease: 'bounce.out' }, '-=0.3')
      .fromTo(
        q('[data-word] span'),
        { x: () => gsap.utils.random(-60, 60), y: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-25, 25), opacity: 0 },
        { x: 0, y: 0, rotate: 0, opacity: 1, duration: 0.7, stagger: 0.03, ease: 'back.out(2)' },
        '-=0.4',
      )
      .to(q('[data-flood]'), { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'expo.inOut' }, '+=0.2')
      .fromTo(q('[data-meta]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
      .to({}, { duration: 1.4 })
      .to(q('[data-gv], [data-gh]'), { opacity: 0, duration: 0.4 }, '<')
      .set(q('[data-gv], [data-gh]'), { opacity: 1 })
    tl.current = t
    if (prefersReducedMotion()) t.progress(0.85).pause()
    return () => {
      t.kill()
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (active) tl.current?.play()
    else tl.current?.pause()
  }, [active])

  const word = (w: string) => (
    <span data-word className="block">
      {Array.from(w).map((c, i) => (
        <span key={i} className="inline-block">
          {c}
        </span>
      ))}
    </span>
  )

  return (
    <div ref={root} aria-hidden="true" className="relative aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)] shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)]">
      <div data-flood className="absolute inset-0 bg-ink" />
      {[1, 2, 3].map((i) => (
        <span key={`v${i}`} data-gv className="absolute inset-y-0 w-px bg-[#ff4fd8]/60" style={{ left: `${i * 25}%` }} />
      ))}
      {[1, 2, 3, 4].map((i) => (
        <span key={`h${i}`} data-gh className="absolute inset-x-0 h-px bg-[#ff4fd8]/60" style={{ top: `${i * 20}%` }} />
      ))}
      <div data-circle className="absolute right-[12%] top-[14%] h-[34%] w-[45%] rounded-full bg-lime shadow-[0_0_80px_rgba(186,247,9,.5)]" />
      <div className="display absolute bottom-[16%] left-[8%] text-[2.6rem] !leading-[0.88] text-[var(--fg)] mix-blend-difference [color:#fff]">
        {word('FIND')}
        {word('YOUR')}
        {word('POTENTIAL')}
      </div>
      <div className="mono absolute inset-x-[8%] bottom-[6%] flex justify-between text-[0.55rem] text-paper/80">
        <span data-meta>EP.01</span>
        <span data-meta>Oct 25</span>
        <span data-meta>fyp ✳</span>
      </div>
      <span className="mono absolute left-2 top-2 rounded bg-[#ff4fd8] px-1.5 py-0.5 text-[0.5rem] text-white">Frame 1 · 1080×1350</span>
    </div>
  )
}
