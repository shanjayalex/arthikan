import { useEffect, useRef, useState } from 'react'
import { journey } from '../data/content'
import { gsap, useGsap } from '../lib/motion'

/** Vertical timeline. The lime wave is the spine and draws itself as you scroll. */
export function Journey() {
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [h, setH] = useState(1200)

  useEffect(() => {
    const ro = new ResizeObserver(() => list.current && setH(list.current.offsetHeight))
    ro.observe(list.current!)
    return () => ro.disconnect()
  }, [])

  // gentle vertical sine for the spine
  let d = 'M20 0'
  for (let y = 0; y <= h; y += 10) d += ` L${(20 + Math.sin(y / 60) * 8).toFixed(1)} ${y}`

  useGsap(
    root,
    ({ motion, desktop }) => {
      if (!motion) return
      gsap.fromTo('[data-spine]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: list.current, start: 'top 70%', end: 'bottom 70%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-item]', root.current).forEach((el, i) => {
        gsap.from(el.querySelector('[data-card]'), {
          x: desktop ? (i % 2 ? 80 : -80) : 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        })
        gsap.fromTo(el.querySelector('[data-year-fill]'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true } })
        const stamp = el.querySelector('[data-stamp]')
        if (stamp) gsap.from(stamp, { scale: 1.6, opacity: 0, rotate: 8, duration: 0.7, ease: 'back.out(2.5)', scrollTrigger: { trigger: el, start: 'top 70%' } })
        const trophy = el.querySelector('[data-trophy]')
        if (trophy) gsap.from(trophy, { rotateY: 360, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 70%' } })
      })
    },
  )

  return (
    <section ref={root} id="journey" aria-labelledby="journey-title" className="px-5 py-24 md:px-10 md:py-32">
      <p className="mono mb-4">09 / Journey</p>
      <h2 id="journey-title" className="display text-[clamp(3rem,8vw,7rem)]">
        So <span className="serif-i">far.</span>
      </h2>

      <div className="relative mt-16">
        <svg className="absolute left-0 top-0 w-10 overflow-visible lg:left-1/2 lg:-translate-x-1/2" height={h} aria-hidden="true">
          <path d={d} fill="none" stroke="var(--line)" strokeWidth="2" />
          <path data-spine pathLength={1} d={d} fill="none" stroke="var(--color-lime)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <ol ref={list} className="relative space-y-14 lg:space-y-6">
          {journey.map((j, i) => {
            const right = i % 2 === 1
            return (
              <li key={j.title + j.when} data-item className={`relative pl-14 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0`}>
                <span className="absolute left-[14px] top-3 h-3 w-3 rounded-full border-2 border-lime bg-[var(--bg)] lg:left-1/2 lg:-translate-x-1/2" aria-hidden="true" />
                <div className={`${right ? 'lg:col-start-2' : 'lg:text-right'}`}>
                  <div data-card className="relative inline-block max-w-md text-left">
                    <div className="relative mb-1 inline-block" aria-hidden="true">
                      <span className="display outline-text text-[clamp(3rem,6vw,5rem)] opacity-40">{j.year}</span>
                      <span data-year-fill className="display absolute inset-0 text-[clamp(3rem,6vw,5rem)]">
                        {j.year}
                      </span>
                    </div>
                    <p className="mono muted">{j.when}</p>
                    <h3 className="mt-2 text-2xl font-semibold leading-tight">
                      {j.title}
                      {j.award && (
                        <span data-trophy className="ml-2 inline-block text-lime" aria-label="Award">
                          🏆
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-[var(--muted)]">{j.org}</p>
                    {j.now && (
                      <span data-stamp className="mono absolute right-0 -top-2 rotate-[-6deg] rounded-md border-2 border-lime bg-lime px-2 py-1 text-ink md:-right-16">
                        Now
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
