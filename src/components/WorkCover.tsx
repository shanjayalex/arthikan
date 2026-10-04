import type { Work } from '../data/content'
import { src, srcSet } from '../lib/img'
import { Logo } from './Logo'
import { Asterisk } from './Asterisk'

/** Card artwork. Real posters where they exist, designed placeholders where work is under NDA or still to add. */
export function WorkCover({ w, className = '' }: { w: Work; className?: string }) {
  if (w.coverStyle === 'poster')
    return (
      <img
        src={src(w.cover.src)}
        srcSet={srcSet(w.cover.src)}
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
        alt={w.cover.alt}
        loading="lazy"
        decoding="async"
        width={720}
        height={900}
        className={`h-full w-full object-cover object-top ${className}`}
      />
    )
  if (w.coverStyle === 'logo')
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-6 bg-white p-10 ${className}`}>
        <img src={src(w.cover.src)} alt={w.cover.alt} loading="lazy" className="w-[80%] object-contain" />
        <div className="grid w-[80%] grid-cols-3 gap-2" aria-hidden="true">
          {['Open day', 'Study UK', 'Webinar'].map((t, i) => (
            <div key={t} className={`mono flex aspect-[4/5] items-end rounded-md p-2 text-[0.5rem] ${i === 1 ? 'bg-[#1450a8] text-white' : 'bg-[#eef2f8] text-[#1450a8]'}`}>
              {t}
            </div>
          ))}
        </div>
      </div>
    )
  if (w.coverStyle === 'site')
    return (
      <div className={`flex h-full w-full items-center justify-center bg-cream p-8 ${className}`}>
        <div className="w-full overflow-hidden rounded-xl border border-hair bg-white shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-hair px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-hair" />
            <span className="h-2 w-2 rounded-full bg-hair" />
            <span className="h-2 w-2 rounded-full bg-hair" />
            <span className="mono ml-3 text-[0.55rem] text-grey">arthikan.click</span>
          </div>
          <div className="relative p-5 text-ink">
            <div className="flex items-center gap-1">
              <Logo className="h-4 w-auto" />
              <Asterisk className="h-2.5 w-2.5 text-lime" />
            </div>
            <p className="display mt-6 text-[2.6rem]">Arthikan</p>
            <p className="display text-[2.6rem]">Vettivel</p>
            <p className="mt-2 text-xs">
              Strategy <span className="serif-i text-base">with soul.</span>
            </p>
            <div className="mt-4 h-1 w-16 bg-lime" />
            <Asterisk className="spin-slow absolute bottom-5 right-5 h-14 w-14 text-lime" />
          </div>
        </div>
      </div>
    )
  if (w.coverStyle === 'ui')
    return (
      <div className={`grid h-full w-full grid-cols-[1fr_1.2fr] gap-3 bg-[#eceef0] p-8 ${className}`} aria-hidden="true">
        <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow">
          <div className="h-3 w-1/2 rounded bg-[#d7dade]" />
          <div className="aspect-video rounded-lg bg-[#e3e6ea]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#e3e6ea]" />
              <div className="h-2 flex-1 rounded bg-[#e3e6ea]" />
            </div>
          ))}
          <div className="mt-auto h-7 rounded-full bg-ink" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-white p-3 shadow">
            <div className="mono text-[0.5rem] text-grey">USER FLOW</div>
            <div className="mt-2 flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-1 items-center gap-1">
                  <div className={`h-6 flex-1 rounded ${i === 2 ? 'bg-lime' : 'bg-[#e3e6ea]'}`} />
                  {i < 3 && <span className="text-[0.5rem] text-grey">→</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-xl border-2 border-dashed border-[#c9cdd2] p-3">
            <div className="mono text-[0.5rem] text-grey">WIREFRAME</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded bg-[#dfe2e6]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  // award
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-ink text-paper ${className}`}>
      <svg viewBox="0 0 120 120" className="w-[38%] text-lime" aria-hidden="true">
        <path d="M38 18h44v22a22 22 0 0 1-44 0z" fill="currentColor" />
        <path d="M38 24H24a14 14 0 0 0 14 18M82 24h14a14 14 0 0 1-14 18" fill="none" stroke="currentColor" strokeWidth="5" />
        <rect x="55" y="62" width="10" height="20" fill="currentColor" />
        <rect x="40" y="82" width="40" height="10" rx="2" fill="currentColor" />
      </svg>
      <p className="display mt-6 text-6xl">2nd</p>
      <p className="mono mt-2 text-paper/60">Runner-up · UI/UX</p>
      <Asterisk className="spin-slow absolute -right-10 -top-10 h-40 w-40 text-white/5" />
    </div>
  )
}
