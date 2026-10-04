import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { stats, testimonials } from '../data/content'
import { gsap, useGsap } from '../lib/motion'

const sparks = ['M0 30 L20 26 L40 28 L60 18 L80 20 L100 8 L120 4', 'M0 20 L30 20 L30 10 L60 10 L60 4 L120 4', 'M0 30 C 30 30, 50 6, 120 4', 'M0 28 L25 22 L50 24 L75 12 L100 14 L120 2']

export function Stats() {
  const root = useRef<HTMLElement>(null)
  const [t, setT] = useState(0)

  useGsap(root, ({ motion }) => {
    const nums = gsap.utils.toArray<HTMLElement>('[data-num]', root.current)
    if (!motion) return
    nums.forEach((el) => {
      const target = Number(el.dataset.num)
      const o = { v: 0 }
      gsap.to(o, {
        v: target,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => (el.textContent = String(Math.round(o.v))),
      })
    })
    gsap.utils.toArray<SVGPathElement>('[data-spark]', root.current).forEach((p) => {
      const len = p.getTotalLength()
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: p, start: 'top 90%', once: true } })
    })
  })

  return (
    <section ref={root} aria-label="Results and numbers" className="border-y border-[var(--line)] px-5 py-20 md:px-10 md:py-28">
      <p className="mono mb-12">07 / By the numbers</p>
      <dl className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="border-t border-[var(--line)] pt-6">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="display block text-[clamp(4rem,8vw,7.5rem)] tabular-nums">
                {s.prefix}
                <span data-num={s.value}>{s.value}</span>
                <span className="text-lime [-webkit-text-stroke:1px_var(--fg)]">{s.suffix}</span>
              </span>
              <svg viewBox="0 0 120 34" className="mt-3 h-8 w-32" aria-hidden="true">
                <path data-spark d={sparks[i % sparks.length]} fill="none" stroke="var(--color-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mono muted mt-3 block max-w-[22ch] leading-relaxed">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      {testimonials.length > 0 && (
        <figure className="mx-auto mt-24 max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.blockquote key={t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="serif-i text-[clamp(1.6rem,3vw,2.6rem)] leading-tight">
              “{testimonials[t].quote}”
            </motion.blockquote>
          </AnimatePresence>
          <figcaption className="mono mt-6">
            {testimonials[t].name} · {testimonials[t].role}
          </figcaption>
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setT(i)} aria-label={`Testimonial ${i + 1}`} className={`h-2 rounded-full transition-all ${i === t ? 'w-8 bg-lime' : 'w-2 bg-[var(--line)]'}`} />
            ))}
          </div>
        </figure>
      )}
    </section>
  )
}
