import { useRef } from 'react'
import { ribbon } from '../data/content'
import { gsap, ScrollTrigger, useGsap } from '../lib/motion'
import { Asterisk } from './Asterisk'

/** Two crossing marquees. Speed and direction follow scroll velocity; hover pauses. */
export function Ribbon() {
  const root = useRef<HTMLElement>(null)

  useGsap(root, ({ motion }) => {
    if (!motion) return
    const rows = gsap.utils.toArray<HTMLElement>('[data-track]', root.current)
    const loops = rows.map((row, i) => {
      const dir = i === 0 ? -1 : 1
      const tween = gsap.fromTo(row, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 })
      return { tween, hovered: false }
    })
    rows.forEach((row, i) => {
      row.parentElement!.addEventListener('mouseenter', () => {
        loops[i].hovered = true
        gsap.to(loops[i].tween, { timeScale: 0, duration: 0.5 })
      })
      row.parentElement!.addEventListener('mouseleave', () => (loops[i].hovered = false))
    })
    let direction = 1
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        direction = self.direction
        const boost = 1 + Math.min(6, Math.abs(self.getVelocity()) / 400)
        loops.forEach((l) => {
          if (l.hovered) return
          gsap.to(l.tween, { timeScale: direction * boost, duration: 0.3, overwrite: true })
          gsap.to(l.tween, { timeScale: direction, duration: 1.2, delay: 0.3 })
        })
      },
    })
  })

  const Row = ({ dark }: { dark?: boolean }) => (
    <div data-track className="flex w-max">
      {[0, 1].map((k) => (
        <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {ribbon.map((w) => (
            <li key={w} className="display flex items-center gap-6 px-6 text-[clamp(1.8rem,4.6vw,4.2rem)] !leading-none">
              {w}
              <Asterisk className={`h-[0.5em] w-[0.5em] ${dark ? 'text-lime' : 'text-[var(--fg)]'}`} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )

  return (
    <section ref={root} id="what" aria-label="What I do" className="relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 -mx-6 rotate-[-3deg] border-y border-[var(--line)] bg-[var(--bg)] py-4 md:py-5">
        <Row />
      </div>
      <div className="relative -mx-6 -mt-2 rotate-[3deg] bg-ink py-4 text-lime md:-mt-4 md:py-5">
        <Row dark />
      </div>
    </section>
  )
}
