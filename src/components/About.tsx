import { useRef } from 'react'
import { about, hero } from '../data/content'
import { gsap, SplitText, useGsap } from '../lib/motion'
import { src, srcSet } from '../lib/img'

export function About() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const glare = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useGsap(root, ({ motion, fine }) => {
    if (!motion) return
    SplitText.create('[data-bio] p', {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '[data-bio]', start: 'top 80%' } }),
    })
    gsap.from(frame.current, { rotate: -14, y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: frame.current, start: 'top 85%' } })
    if (!fine) return
    const rx = gsap.quickTo(frame.current, 'rotationX', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(frame.current, 'rotationY', { duration: 0.6, ease: 'power3' })
    const el = frame.current!
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      ry((x - 0.5) * 16)
      rx(-(y - 0.5) * 16)
      gsap.set(glare.current, { background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(186,247,9,.35), transparent 55%)`, opacity: 1 })
    }
    const leave = () => {
      rx(0)
      ry(0)
      gsap.to(glare.current, { opacity: 0, duration: 0.4 })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  })

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="mx-auto w-full max-w-[440px] [perspective:1000px]">
          <div
            ref={frame}
            className="relative rotate-[-3deg] bg-white p-3 pb-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)] [transform-style:preserve-3d]"
            onPointerEnter={() => video.current?.play().catch(() => {})}
            onPointerLeave={() => video.current?.pause()}
          >
            <span className="absolute -top-4 left-8 h-8 w-24 rotate-[-8deg] bg-[#e9e4c9]/80 shadow-sm" aria-hidden="true" />
            <span className="absolute -top-3 right-6 h-8 w-20 rotate-[10deg] bg-[#e9e4c9]/80 shadow-sm" aria-hidden="true" />
            <div className="relative aspect-square overflow-hidden">
              <img src={src(hero.portraits.creator.src)} srcSet={srcSet(hero.portraits.creator.src)} sizes="440px" alt={hero.portraits.creator.alt} loading="lazy" className="h-full w-full object-cover" />
              {about.video && <video ref={video} src={about.video} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />}
              <div ref={glare} className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay" aria-hidden="true" />
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center font-serif text-xl italic text-ink">the person ✳</p>
          </div>
        </div>

        <div>
          <p className="mono mb-4">10 / About</p>
          <h2 id="about-title" className="display text-[clamp(3rem,8vw,7rem)]">
            The <span className="serif-i">person.</span>
          </h2>
          <div data-bio className="mt-8 max-w-2xl space-y-5 text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug">
            {about.bio.map((p, i) => (
              <p key={i} className={i === about.bio.length - 1 ? 'serif-i text-[1.25em]' : ''}>
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-10 flex flex-wrap gap-2">
            {about.chips.map((c) => (
              <li key={c.t} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm">
                <span aria-hidden="true">{c.icon}</span> {c.t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
