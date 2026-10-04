import { useRef, useState } from 'react'
import { disciplines } from '../data/content'
import { gsap, useGsap } from '../lib/motion'
import { pulse } from '../lib/signal'
import { useInView } from '../lib/useInView'
import { WaveLine } from './WaveLine'
import { SocialDemo } from './demos/SocialDemo'
import { PosterDemo } from './demos/PosterDemo'
import { CodeDemo } from './demos/CodeDemo'

function Panel({ d, index }: { d: (typeof disciplines)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useInView(ref, 0.55)
  const [before] = d.line.split(d.italic)
  return (
    <article
      ref={ref}
      data-panel
      className="relative flex min-h-[100svh] w-full shrink-0 flex-col justify-center gap-10 px-5 py-24 md:px-10 lg:h-screen lg:w-screen lg:flex-row lg:items-center lg:gap-16 lg:py-0"
      aria-labelledby={`disc-${d.n}`}
    >
      <div className="relative max-w-xl lg:w-[44%]">
        <span className="display outline-text pointer-events-none absolute -left-2 -top-[0.6em] text-[clamp(7rem,18vw,16rem)] opacity-30" aria-hidden="true">
          {d.n}
        </span>
        <p className="mono relative mb-4">
          {d.n} / {String(disciplines.length).padStart(2, '0')}
        </p>
        <h3 id={`disc-${d.n}`} className="display relative text-[clamp(3.2rem,9vw,8.5rem)]">
          {d.title}
        </h3>
        <p className="relative mt-5 text-2xl md:text-3xl">
          {before}
          <span className="serif-i text-[1.15em] text-[var(--fg)]">{d.italic}</span>
        </p>
        <p className="relative mt-4 max-w-md text-[var(--muted)]">{d.body}</p>
        <ul className="relative mt-6 flex flex-wrap gap-2" aria-label={`${d.title} tools`}>
          {d.tools.map((t) => (
            <li key={t} className="mono rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.62rem]">
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-1 items-center justify-center" data-demo={index}>
        {d.demo === 'social' && <SocialDemo active={active} />}
        {d.demo === 'poster' && <PosterDemo active={active} />}
        {d.demo === 'code' && <CodeDemo active={active} />}
      </div>
    </article>
  )
}

/** Market · Design · Build — pinned horizontal scroll on desktop, stacked on mobile. */
export function Disciplines() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useGsap(root, ({ motion, desktop }) => {
    if (!motion || !desktop) return
    const el = track.current!
    const distance = () => el.scrollWidth - innerWidth
    let last = 0
    gsap.to(el, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.current,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (disciplines.length - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power2.inOut', delay: 0.1 },
        onUpdate: (s) => {
          const i = Math.round(s.progress * (disciplines.length - 1))
          if (i !== last) {
            last = i
            setCurrent(i)
            pulse(1)
          }
          gsap.set('[data-progress-fill]', { scaleX: s.progress })
        },
      },
    })
  })

  return (
    <section ref={root} id="disciplines" aria-label="Three disciplines" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-5 top-6 z-10 hidden items-center gap-3 md:inset-x-10 lg:flex" aria-hidden="true">
        {disciplines.map((d, i) => (
          <div key={d.n} className="flex flex-1 items-center gap-3 last:flex-none">
            <span className={`mono transition-colors ${i <= current ? 'text-[var(--fg)]' : 'muted'}`}>
              {d.n} {d.title}
            </span>
            {i < disciplines.length - 1 && (
              <span className="relative h-px flex-1 bg-[var(--line)]">
                <span className="absolute inset-0 origin-left bg-lime transition-transform duration-500" style={{ transform: `scaleX(${i < current ? 1 : 0})` }} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div ref={track} className="relative flex flex-col lg:w-max lg:flex-row">
        {disciplines.map((d, i) => (
          <Panel key={d.n} d={d} index={i} />
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-[9vh] hidden lg:block" aria-hidden="true">
          <WaveLine height={60} base={4} gain={30} />
        </div>
      </div>
      <span data-progress-fill className="absolute bottom-0 left-0 hidden h-[2px] w-full origin-left scale-x-0 bg-lime lg:block" aria-hidden="true" />
    </section>
  )
}
