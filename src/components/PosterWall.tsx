import { useMemo, useRef, useState } from 'react'
import { works, type Img } from '../data/content'
import { gsap, useGsap } from '../lib/motion'
import { src } from '../lib/img'
import { Lightbox } from './Lightbox'

/** "Creative archive": every poster in one draggable strip. Drag on desktop, swipe on touch. */
export function PosterWall() {
  const root = useRef<HTMLElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 })

  const items = useMemo(() => {
    const seen = new Set<string>()
    const out: Img[] = []
    for (const w of works) for (const g of w.gallery) if (w.coverStyle === 'poster' && !g.src.includes('banner') && !seen.has(g.src)) (seen.add(g.src), out.push(g))
    return out
  }, [])

  useGsap(root, ({ motion }) => {
    if (!motion) return
    gsap.from('[data-poster]', {
      y: 80,
      rotate: (i) => (i % 2 ? 4 : -4),
      opacity: 0,
      duration: 1,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: { trigger: strip.current, start: 'top 85%' },
    })
  })

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { down: true, x: e.clientX, left: strip.current!.scrollLeft, moved: 0 }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.clientX - d.x
    d.moved = Math.max(d.moved, Math.abs(dx))
    strip.current!.scrollLeft = d.left - dx
  }
  const onUp = () => (drag.current.down = false)

  return (
    <section ref={root} aria-labelledby="archive-title" className="py-20 md:py-28">
      <div className="flex items-end justify-between gap-6 px-5 md:px-10">
        <div>
          <p className="mono mb-3">Creative archive</p>
          <h2 id="archive-title" className="display text-[clamp(2.4rem,6vw,5.5rem)]">
            Posters & <span className="serif-i">concepts</span>
          </h2>
        </div>
        <p className="mono muted hidden md:block">← Drag →  ·  {items.length} pieces</p>
      </div>
      <div
        ref={strip}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="no-scrollbar mt-10 cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing"
        data-cursor="DRAG"
        data-lenis-prevent-wheel
        tabIndex={0}
        aria-label="Poster archive, scroll horizontally"
      >
        <div data-poster-row className="flex w-max gap-4 px-5 pb-4 md:gap-6 md:px-10">
          {items.map((it, i) => (
            <button
              key={it.src}
              data-poster
              onClick={() => drag.current.moved < 6 && setLb(i)}
              className="group w-[62vw] shrink-0 text-left sm:w-[38vw] md:w-[24vw] lg:w-[19vw]"
              aria-label={`Open ${it.label || it.alt}`}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[var(--card)] shadow-[0_20px_40px_-25px_rgba(0,0,0,.4)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                <img src={src(it.src)} alt={it.alt} loading="lazy" draggable={false} className="h-full w-full object-cover object-top" />
              </div>
              <p className="mt-3 line-clamp-1 text-xs text-[var(--muted)]">
                {it.label}
                {it.concept && <span className="mono ml-1 text-[0.55rem]">· concept</span>}
              </p>
            </button>
          ))}
        </div>
      </div>
      <Lightbox items={items} index={lb} onChange={setLb} />
    </section>
  )
}
