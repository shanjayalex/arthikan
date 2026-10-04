import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { works, type Category, type Work } from '../data/content'
import { gsap, useGsap } from '../lib/motion'
import { src } from '../lib/img'
import { startScroll, stopScroll } from '../lib/smooth'
import { track } from '../lib/track'
import { WorkCover } from './WorkCover'
import { Lightbox } from './Lightbox'

const filters: ('All' | Category)[] = ['All', 'Marketing', 'Design', 'Web', 'Podcast']

function Card({ w, onOpen }: { w: Work; onOpen: (w: Work) => void }) {
  const pill = useRef<HTMLSpanElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const qx = useRef<gsap.QuickToFunc | null>(null)
  const qy = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    qx.current = gsap.quickTo(pill.current, 'x', { duration: 0.35, ease: 'power3' })
    qy.current = gsap.quickTo(pill.current, 'y', { duration: 0.35, ease: 'power3' })
  }, [])

  const move = (e: React.PointerEvent) => {
    const r = card.current!.getBoundingClientRect()
    qx.current?.(e.clientX - r.left)
    qy.current?.(e.clientY - r.top)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
      data-card
    >
      <button
        type="button"
        onClick={() => onOpen(w)}
        className="block w-full text-left"
        aria-label={`${w.title}: ${w.italic} Open case`}
        data-cursor="VIEW"
      >
        <div ref={card} onPointerMove={move} data-reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--card)]">
          <motion.div layoutId={`cover-${w.id}`} className={`h-full w-full ${w.id === 'fyp' ? 'vt-fyp-hero' : ''}`}>
            <div data-zoom className="h-full w-full transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-105">
              <WorkCover w={w} />
            </div>
          </motion.div>
          <span
            ref={pill}
            className="mono pointer-events-none absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-lime px-4 py-2 text-ink opacity-0 transition-[opacity,scale] duration-300 group-hover:scale-100 group-hover:opacity-100 md:block"
            aria-hidden="true"
          >
            View ↗
          </span>
          <span className="mono absolute left-3 top-3 rounded-full bg-[var(--bg)]/85 px-3 py-1.5 text-[0.58rem] backdrop-blur">{w.tag}</span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="display text-[clamp(1.5rem,2.4vw,2.2rem)] !leading-[0.95] transition-[font-variation-settings] duration-500 ease-[var(--ease-expo)] [font-variation-settings:'wdth'_100] group-hover:[font-variation-settings:'wdth'_125]">
              {w.title}
            </h3>
            <p className="serif-i mt-1 text-xl">{w.italic}</p>
          </div>
          <span className="mono muted max-w-[8.5rem] shrink-0 pt-1 text-right text-[0.6rem] leading-relaxed">
            {w.role}
            <br />
            {w.year}
          </span>
        </div>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{w.result}</p>
      </button>
    </motion.article>
  )
}

function CaseModal({ w, onClose }: { w: Work; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  useEffect(() => {
    stopScroll()
    close.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && lb === null && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
    }
  }, [onClose, lb])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      className="fixed inset-0 z-[140] overflow-y-auto bg-[var(--bg)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      data-lenis-prevent
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--bg)]/90 px-5 py-4 backdrop-blur md:px-10">
        <span className="mono">{w.tag}</span>
        <button ref={close} onClick={onClose} className="mono rounded-full border border-[var(--line)] px-4 py-2 hover:bg-lime hover:text-ink" data-magnetic>
          Close ✕
        </button>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-24 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div layoutId={`cover-${w.id}`} className="overflow-hidden rounded-2xl lg:sticky lg:top-24 lg:self-start">
          <div className="aspect-[4/5]">
            <WorkCover w={w} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.6 } }}>
          <p className="mono muted">
            {w.role} · {w.year}
          </p>
          <h2 id="case-title" className="display mt-3 text-[clamp(2.6rem,6vw,5.5rem)]">
            {w.title}
          </h2>
          <p className="serif-i mt-2 text-3xl">{w.italic}</p>
          <p className="mt-6 max-w-xl text-lg">{w.result}</p>
          {w.details.length > 0 && (
            <ul className="mt-8 space-y-3 border-t border-[var(--line)] pt-6">
              {w.details.map((d) => (
                <li key={d} className="flex gap-3 text-[var(--muted)]">
                  <span className="text-lime">✳</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
          {w.gallery.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4">
              {w.gallery.map((g, i) => (
                <button key={g.src + i} onClick={() => setLb(i)} className="group text-left" data-cursor="VIEW">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--card)]">
                    <img src={src(g.src)} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {g.label}
                    {g.concept && <span className="mono ml-1 text-[0.55rem]">· concept</span>}
                  </p>
                </button>
              ))}
            </div>
          )}
          {w.link && (
            <a href={w.link.href} target="_blank" rel="noreferrer" className="mt-10 inline-flex rounded-full bg-[var(--fg)] px-6 py-3 text-[var(--bg)] hover:bg-lime hover:text-ink">
              {w.link.label} ↗
            </a>
          )}
        </motion.div>
      </div>
      <Lightbox items={w.gallery} index={lb} onChange={setLb} />
    </motion.div>
  )
}

export function WorkGrid() {
  const root = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [open, setOpen] = useState<Work | null>(null)
  const navigate = useNavigate()
  const list = filter === 'All' ? works : works.filter((w) => w.categories.includes(filter))

  useGsap(root, ({ motion }) => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-reveal]', root.current)
    if (!motion) return
    cards.forEach((c) => {
      gsap.fromTo(c, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: c, start: 'top 88%', once: true } })
      gsap.fromTo(c.querySelector('[data-zoom]'), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom 60%', scrub: true } })
    })
    gsap.from('[data-work-title] > *', { yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '[data-work-title]', start: 'top 85%' } })
  })

  const openWork = (w: Work) => {
    if (w.route) {
      track('fyp_click', { from: 'work' })
      navigate(w.route, { viewTransition: true })
      return
    }
    setOpen(w)
  }

  return (
    <section ref={root} id="work" className="px-5 py-24 md:px-10 md:py-32" aria-labelledby="work-title">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="mono mb-4">02 / Selected work</p>
          <h2 id="work-title" data-work-title className="display text-[clamp(3rem,10vw,9rem)]">
            <span className="line-mask block">
              <span className="block">Work that</span>
            </span>
            <span className="line-mask block">
              <span className="block">
                <span className="serif-i">gets shared.</span>
              </span>
            </span>
          </h2>
        </div>
        <LayoutGroup id="filters">
          <div role="tablist" aria-label="Filter work" className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] p-1">
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:py-2 sm:text-sm ${filter === f ? 'text-ink' : ''}`}
              >
                {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <LayoutGroup id="work">
        <motion.div layout className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((w) => (
              <Card key={w.id} w={w} onOpen={openWork} />
            ))}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>{open && <CaseModal w={open} onClose={() => setOpen(null)} />}</AnimatePresence>
      </LayoutGroup>
    </section>
  )
}
