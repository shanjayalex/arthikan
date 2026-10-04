import { useEffect, useRef, useState } from 'react'
import { fyp, site, works } from '../data/content'
import { gsap, ScrollTrigger, useGsap } from '../lib/motion'
import { src, srcSet } from '../lib/img'
import { toast } from '../lib/toast'
import { track } from '../lib/track'
import { Lightbox } from '../components/Lightbox'
import { WaveLine } from '../components/WaveLine'
import { Footer } from '../components/Footer'
import { useGo } from '../components/PageTransition'

const work = works.find((w) => w.id === 'fyp')!

// EDIT: this case-study copy is a first draft written from the FYP artwork and site.
// Rewrite it in your own words (especially the "Idea" and "What’s next" parts).
const chapters = [
  {
    n: '01',
    t: 'Challenge',
    body: [
      'Start a podcast from nothing: no audience, no budget, no studio. It needed to feel like a real show from the very first post, and it needed to be something I would still be proud of at episode fifty.',
      'The audience is people in their late teens and twenties who quietly feel a step behind: students, first-jobbers, people mid-switch. The brand had to feel calm and honest, not loud “hustle” content.',
    ],
  },
  {
    n: '02',
    t: 'Idea',
    body: [
      'FYP reads two ways: “Find Your Potential”, and the “For You Page” where most of us compare ourselves to everyone else. The show lives in that tension.',
      'The lime dot above the y is the spark: one small point of light, the person, the potential. Everything else in the system grows from that dot.',
    ],
  },
]

const plan = [
  { k: 'Teaser 01', t: 'The spark', d: 'A single glowing dot on black. No explanation, just “It starts with a spark.”' },
  { k: 'Teaser 02', t: 'The signal', d: 'The dot becomes a sound wave. The name appears: Find Your Potential.' },
  { k: 'Reveal', t: 'Episode 01 key art', d: 'The first question, the host’s face, and the release date.' },
  { k: 'Launch', t: 'Trailer + countdown', d: 'A 30–45s trailer on Reels/Shorts and a live countdown on the site.' },
]

export default function FypCase() {
  const root = useRef<HTMLDivElement>(null)
  const [lb, setLb] = useState<number | null>(null)
  const go = useGo()

  useEffect(() => {
    document.documentElement.classList.add('in-fyp')
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('in-fyp')
    }
  }, [])

  useGsap(root, ({ motion }) => {
    if (!motion) return
    gsap.from('[data-case-rise]', { y: 50, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.2 })
    gsap.utils.toArray<HTMLElement>('[data-case-block]').forEach((el) =>
      gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }),
    )
    gsap.fromTo('[data-construct]', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.15, ease: 'power2.inOut', scrollTrigger: { trigger: '[data-logo-build]', start: 'top 75%' } })
    gsap.to('[data-hero-img]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '[data-hero-img]', start: 'top top', end: 'bottom top', scrub: true } })
  })

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      toast(`${hex} copied ✳`)
    } catch {
      toast(hex)
    }
  }

  return (
    <div ref={root} className="text-paper">
      <title>FYP — Find Your Potential · Case study · Arthikan Vettivel</title>
      <meta name="description" content="How Arthikan Vettivel built FYP — Find Your Potential, a podcast brand, from zero: identity, artwork, launch campaign and website." />
      <link rel="canonical" href={`${site.url}/work/fyp`} />

      <main id="main">
        {/* Hero */}
        <header className="relative grid min-h-[100svh] items-end gap-10 overflow-hidden px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <button onClick={() => go('/#work')} className="u-link mono mb-10 inline-block text-paper/70" data-case-rise>
              ← All work
            </button>
            <p className="mono text-lime" data-case-rise>
              Case study · {work.year}
            </p>
            <h1 className="display mt-4 text-[clamp(3.4rem,10vw,9.5rem)]" data-case-rise>
              Find your
              <br />
              <span className="serif-i text-lime">potential.</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl text-paper/80" data-case-rise>
              {work.italic} {work.result}
            </p>
            <dl className="mono mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 text-[0.62rem]" data-case-rise>
              <div>
                <dt className="text-paper/50">Role</dt>
                <dd className="mt-1">{work.role}</dd>
              </div>
              <div>
                <dt className="text-paper/50">Scope</dt>
                <dd className="mt-1">Brand · Art · Web · Social</dd>
              </div>
              <div>
                <dt className="text-paper/50">Launch</dt>
                <dd className="mt-1">EP.01 · {fyp.episode.launchLabel}</dd>
              </div>
            </dl>
          </div>
          <div className="vt-fyp-hero relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-2xl">
            <img data-hero-img src={src(work.cover.src, 1400)} srcSet={srcSet(work.cover.src)} sizes="(min-width:1024px) 40vw, 92vw" alt={work.cover.alt} fetchPriority="high" className="h-[112%] w-full object-cover object-top" />
          </div>
        </header>

        <WaveLine height={50} base={3} gain={20} />

        {/* Chapters */}
        <div className="mx-auto max-w-[1300px] space-y-28 px-5 py-28 md:px-10">
          {chapters.map((c) => (
            <section key={c.n} data-case-block className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]" aria-labelledby={`ch-${c.n}`}>
              <h2 id={`ch-${c.n}`} className="display text-[clamp(2.4rem,5vw,4.5rem)]">
                <span className="mono mb-3 block text-lime">{c.n}</span>
                {c.t}
              </h2>
              <div className="space-y-5 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug text-paper/85">
                {c.body.map((b) => (
                  <p key={b}>{b}</p>
                ))}
              </div>
            </section>
          ))}

          {/* Brand identity */}
          <section data-case-block aria-labelledby="ch-brand" className="space-y-12">
            <h2 id="ch-brand" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              <span className="mono mb-3 block text-lime">03</span>
              Brand identity
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <div data-logo-build className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c0a]">
                <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <line data-construct pathLength={1} x1="0" y1="190" x2="400" y2="190" stroke="#BAF709" strokeOpacity=".45" strokeDasharray="1" />
                  <line data-construct pathLength={1} x1="0" y1="112" x2="400" y2="112" stroke="#BAF709" strokeOpacity=".45" />
                  <line data-construct pathLength={1} x1="0" y1="232" x2="400" y2="232" stroke="#BAF709" strokeOpacity=".3" />
                  <circle data-construct pathLength={1} cx="198" cy="114" r="34" fill="none" stroke="#BAF709" strokeOpacity=".6" />
                  <line data-construct pathLength={1} x1="198" y1="0" x2="198" y2="300" stroke="#fff" strokeOpacity=".15" />
                </svg>
                <img src={fyp.logo} alt="FYP logo with construction lines" className="relative w-[58%]" loading="lazy" />
                <span className="mono absolute bottom-4 left-4 text-[0.58rem] text-paper/50">Logo construction · the spark sits on the y</span>
              </div>
              <div className="grid gap-6">
                <div className="grid grid-cols-3 gap-3">
                  {fyp.palette.map((c) => (
                    <button key={c.hex} onClick={() => copy(c.hex)} className="group text-left" data-cursor="COPY" aria-label={`Copy ${c.name} ${c.hex}`}>
                      <div className="aspect-[3/4] rounded-xl border border-white/10 transition-transform group-hover:-translate-y-1" style={{ background: c.hex }} />
                      <p className="mt-2 text-sm">{c.name}</p>
                      <p className="mono text-[0.6rem] text-paper/50">{c.hex}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 p-6">
                  <p className="mono text-paper/50">Typography</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">FIND YOUR POTENTIAL</p>
                  <p className="mt-1 text-sm text-paper/60">Geometric sans, wide-tracked caps for labels: clean and modern</p>
                  <p className="mt-5 font-serif text-4xl italic">Why do we feel behind?</p>
                  <p className="mt-1 text-sm text-paper/60">High-contrast serif for episode questions: warm and human</p>
                </div>
              </div>
            </div>
          </section>

          {/* Artwork */}
          <section data-case-block aria-labelledby="ch-art" className="space-y-10">
            <h2 id="ch-art" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              <span className="mono mb-3 block text-lime">04</span>
              Artwork
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {work.gallery
                .filter((g) => !g.src.includes('banner'))
                .map((g) => {
                  const i = work.gallery.indexOf(g)
                  return (
                    <button key={g.src} onClick={() => setLb(i)} className="group text-left" data-cursor="VIEW">
                      <div className="aspect-[4/5] overflow-hidden rounded-xl">
                        <img src={src(g.src)} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 text-xs text-paper/60">{g.label}</p>
                    </button>
                  )
                })}
            </div>
          </section>

          {/* Website */}
          <section data-case-block aria-labelledby="ch-web" className="space-y-10">
            <h2 id="ch-web" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              <span className="mono mb-3 block text-lime">05</span>
              Website & channels
            </h2>
            <button onClick={() => setLb(work.gallery.findIndex((g) => g.src.includes('banner')))} className="block w-full overflow-hidden rounded-2xl border border-white/10" data-cursor="VIEW">
              <img src={src('/work/fyp-banner', 1400)} alt="FYP Podcast channel banner" loading="lazy" className="w-full" />
            </button>
            <div className="flex flex-wrap gap-3">
              {fyp.links
                .filter((l) => l.href)
                .map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer" onClick={() => track('fyp_click', { from: 'case', to: l.label })} className="rounded-full border border-white/20 px-5 py-3 text-sm hover:border-lime hover:bg-lime hover:text-ink" data-magnetic>
                    {l.label} ↗
                  </a>
                ))}
            </div>
          </section>

          {/* Social plan */}
          <section data-case-block aria-labelledby="ch-social" className="space-y-10">
            <h2 id="ch-social" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              <span className="mono mb-3 block text-lime">06</span>
              Launch plan
            </h2>
            <ol className="grid gap-4 md:grid-cols-4">
              {plan.map((p, i) => (
                <li key={p.k} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <span className="mono text-lime">{p.k}</span>
                  <p className="mt-3 text-xl">{p.t}</p>
                  <p className="mt-2 text-sm text-paper/60">{p.d}</p>
                  {i < plan.length - 1 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-lime md:block">→</span>}
                </li>
              ))}
            </ol>
          </section>

          {/* What's next */}
          <section data-case-block aria-labelledby="ch-next" className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
            <h2 id="ch-next" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              <span className="mono mb-3 block text-lime">07</span>
              What’s next
            </h2>
            <div className="space-y-5 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug text-paper/85">
              <p>Episode 01, “{fyp.episode.title}”, lands on {fyp.episode.launchLabel}. After that: a steady release rhythm, short clips for Reels and Shorts, guest conversations, and episodes in Tamil as well as English.</p>
              <p className="serif-i text-lime">{fyp.sub}</p>
            </div>
          </section>
        </div>

        {/* Next project */}
        <button onClick={() => go('/#work')} className="group block w-full border-t border-white/10 px-5 py-20 text-left md:px-10" data-cursor="VIEW">
          <span className="mono text-paper/50">Next</span>
          <span className="display mt-3 block text-[clamp(3rem,9vw,8rem)] transition-colors group-hover:text-lime">More work →</span>
        </button>
      </main>
      <Footer />
      <Lightbox items={work.gallery} index={lb} onChange={setLb} />
    </div>
  )
}
