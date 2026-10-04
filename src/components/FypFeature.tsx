import { useRef } from 'react'
import { fyp } from '../data/content'
import { gsap, ScrollTrigger, useGsap } from '../lib/motion'
import { pulse } from '../lib/signal'
import { track } from '../lib/track'
import { Countdown } from './Countdown'
import { TrailerPlayer } from './TrailerPlayer'
import { MicSequence } from './MicSequence'
import { WaveLine } from './WaveLine'
import { useGo } from './PageTransition'

/** The emotional centre of the site. The whole page turns studio-dark while it's on screen. */
export function FypFeature() {
  const root = useRef<HTMLElement>(null)
  const onair = useRef<HTMLDivElement>(null)
  const go = useGo()
  const words = fyp.headline.split(' ')

  useGsap(root, ({ motion, desktop }) => {
    const q = gsap.utils.selector(root)
    const html = document.documentElement
    const meta = document.querySelector('meta[name="theme-color"]')

    // Page colour switch (body transitions its colours in CSS). Called after the pin
    // below is created, so the end position includes the pin spacing.
    const zone = () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (s) => {
          html.classList.toggle('in-fyp', s.isActive)
          meta?.setAttribute('content', s.isActive ? '#10120F' : '#F7F7F2')
        },
      })
      // ON AIR flickers on when the section is half in view
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top center',
        onEnter: () => q('[data-onair-sign]')[0]?.classList.add('is-on'),
        onLeaveBack: () => q('[data-onair-sign]')[0]?.classList.remove('is-on'),
      })
    }

    if (!motion) {
      zone()
      return () => html.classList.remove('in-fyp')
    }

    if (desktop) {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: onair.current,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      })
      let shown = 0
      tl.fromTo(q('[data-bigword]'), { xPercent: 15 }, { xPercent: -45, duration: 1 }, 0)
        .fromTo(q('[data-fyp-logo]'), { scale: 1.25 }, { scale: 0.85, yPercent: -30, duration: 0.6 }, 0)
        .fromTo(
          q('[data-hw]'),
          { opacity: 0.08, y: 20, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.06,
            duration: 0.12,
            onUpdate() {
              const n = q('[data-hw]').filter((w) => Number(gsap.getProperty(w, 'opacity')) > 0.9).length
              if (n > shown) pulse(0.6)
              shown = n
            },
          },
          0.15,
        )
        .fromTo(q('[data-idea="0"]'), { x: '-55vw', y: '-35vh', rotate: -24 }, { x: 0, y: 0, rotate: -3, duration: 0.5, ease: 'power2.out' }, 0.35)
        .fromTo(q('[data-idea="1"]'), { y: '60vh', rotate: 12 }, { y: 0, rotate: 0, duration: 0.5, ease: 'power2.out' }, 0.42)
        .fromTo(q('[data-idea="2"]'), { x: '55vw', y: '-35vh', rotate: 24 }, { x: 0, y: 0, rotate: 3, duration: 0.5, ease: 'power2.out' }, 0.49)
    } else {
      gsap.from(q('[data-hw]'), { opacity: 0, y: 16, stagger: 0.06, duration: 0.6, scrollTrigger: { trigger: q('[data-fyp-headline]')[0], start: 'top 85%' } })
      gsap.from(q('[data-idea]'), { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: q('[data-idea]')[0], start: 'top 90%' } })
    }
    gsap.from(q('[data-fyp-rise]'), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: q('[data-fyp-body]')[0], start: 'top 80%' } })
    zone()
    return () => html.classList.remove('in-fyp')
  })

  const links = fyp.links.filter((l) => l.href)

  return (
    <section ref={root} id="fyp" aria-labelledby="fyp-title" className="relative text-paper">
      <MicSequence />

      {/* On-air pin */}
      <div ref={onair} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-24 lg:h-screen lg:py-0">
        <p data-bigword className="display outline-text pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[30vw] text-paper/[0.07]" aria-hidden="true">
          Potential · Potential
        </p>
        <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="sound-ring h-[38vmin] w-[38vmin]" style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
        </div>

        <div data-onair-sign className="onair mono absolute right-5 top-24 flex items-center gap-2 rounded-md border border-onair/70 px-3 py-2 text-onair md:right-10" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-onair" /> On air
        </div>
        <p className="mono absolute left-5 top-24 text-paper/60 md:left-10">06 / The podcast</p>

        <img data-fyp-logo src={fyp.logo} alt="FYP — Find Your Potential" width={640} height={300} className="relative w-[min(56vw,320px)]" loading="lazy" />

        <h2 id="fyp-title" data-fyp-headline className="relative mt-8 max-w-4xl text-center font-serif text-[clamp(2.2rem,5.6vw,5rem)] italic leading-[1.02]">
          {words.map((w, i) => (
            <span key={i} data-hw className="mr-[0.25em] inline-block">
              {w}
            </span>
          ))}
        </h2>

        <ul className="relative mt-12 grid w-full max-w-5xl gap-4 md:grid-cols-3" aria-label={`Episode ${fyp.episode.number} ideas`}>
          {fyp.episode.ideas.map((idea, i) => (
            <li key={idea.k} data-idea={i} className="rounded-2xl border border-white/10 bg-[#181b16] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
              <p className="mono text-lime">Idea {idea.k}</p>
              <p className="mt-3 text-xl">{idea.t}</p>
              <p className="mt-1 text-sm text-paper/60">{idea.d}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Story + episode */}
      <div data-fyp-body className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 pb-28 pt-10 md:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p data-fyp-rise className="serif-i text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] text-lime">
            {fyp.sub}
          </p>
          <p data-fyp-rise className="mt-6 max-w-lg text-lg text-paper/80">
            {fyp.body}
          </p>
          <ul data-fyp-rise className="mt-8 flex flex-wrap gap-2" aria-label="My role">
            {fyp.roles.map((r) => (
              <li key={r} className="mono rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] text-paper/80">
                {r}
              </li>
            ))}
          </ul>
          <div data-fyp-rise className="mt-10 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => track('fyp_click', { to: l.label })}
                className={`rounded-full px-5 py-3 text-sm transition-colors ${i === 0 ? 'bg-lime text-ink hover:bg-paper' : 'border border-white/20 hover:border-lime hover:text-lime'}`}
                data-magnetic
              >
                {l.label} ↗
              </a>
            ))}
          </div>
          <button data-fyp-rise onClick={() => go('/work/fyp')} className="u-link mono mt-10 inline-block text-paper/70" data-cursor="VIEW">
            Read the FYP case study →
          </button>
        </div>

        <div id="fyp-player" className="min-w-0 space-y-8">
          <div data-fyp-rise>
            <p className="mono text-paper/60">
              Episode {fyp.episode.number} · Arriving {fyp.episode.launchLabel}
            </p>
            <p className="mt-2 text-2xl md:text-3xl">“{fyp.episode.title}”</p>
          </div>
          <div data-fyp-rise>
            <Countdown to={fyp.episode.launch} liveHref={fyp.links[1].href} />
          </div>
          <div data-fyp-rise>
            <TrailerPlayer />
          </div>
        </div>
      </div>
      <WaveLine height={50} base={3} gain={22} />
    </section>
  )
}
