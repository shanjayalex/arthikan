import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { hero, site } from '../data/content'
import { gsap, SplitText, ScrollTrigger, useGsap, isDesktop, prefersReducedMotion } from '../lib/motion'
import { onIntroDone } from '../lib/intro'
import { signal } from '../lib/signal'
import { scrollToTarget } from '../lib/smooth'
import { PersonaFlip } from './PersonaFlip'
import { RoleSwitcher } from './RoleSwitcher'
import { SignalFallback } from './SignalFallback'
import { Asterisk } from './Asterisk'
import { WaveLine } from './WaveLine'
import { useLocalTime } from '../lib/useLocalTime'

const SignalSphere = lazy(() => import('./SignalSphere'))

const webgl = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const [introDone, setIntroDone] = useState(false)
  const [sphere, setSphere] = useState(false)
  const time = useLocalTime()

  // Mount the 3D sphere only on desktop, with motion allowed, after the intro (keeps LCP fast).
  useEffect(
    () =>
      onIntroDone(() => {
        setIntroDone(true)
        if (isDesktop() && !prefersReducedMotion() && webgl()) {
          const idle = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 300))
          idle(() => setSphere(true))
        }
      }),
    [],
  )

  useGsap(root, ({ motion, desktop, fine }) => {
    const q = gsap.utils.selector(root)
    if (!motion) {
      gsap.from(q('[data-hero-fade]'), { opacity: 0, duration: 0.6, stagger: 0.05 })
      return
    }

    const name = SplitText.create(q('[data-name-line]'), { type: 'chars', mask: 'chars' })
    const eyebrow = SplitText.create(q('[data-eyebrow]'), { type: 'words,chars' })
    gsap.set(name.chars, { yPercent: 115 })
    gsap.set(eyebrow.chars, { opacity: 0 })
    gsap.set(q('[data-portrait]'), { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(q('[data-rise]'), { y: 30, opacity: 0 })
    gsap.set(q('[data-underline]'), { strokeDasharray: 400, strokeDashoffset: 400 })

    const play = () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(name.chars, { yPercent: 0, duration: 1.3, stagger: 0.04 })
        .to(q('[data-portrait]'), { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' }, 0.1)
        .from(q('[data-portrait] img'), { scale: 1.25, duration: 1.8 }, 0.1)
        .to(eyebrow.chars, { opacity: 1, duration: 0.01, stagger: 0.025, ease: 'none' }, 0.5)
        .to(q('[data-rise]'), { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.7)
        .to(q('[data-underline]'), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 1.2)
        .from(q('[data-sphere]'), { scale: 0.6, opacity: 0, duration: 1.6 }, 0.3)
    }
    const off = onIntroDone(play)

    // Scroll: headline shrinks up, portrait drifts slower, sphere flattens into the wave thread.
    gsap.to(q('[data-name]'), {
      scale: 0.86,
      yPercent: -18,
      transformOrigin: 'left top',
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    if (desktop) {
      gsap.to(q('[data-portrait-wrap]'), {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (s) => (signal.heroProgress = s.progress),
    })

    // Mouse parallax on three layers.
    let onMove: ((e: PointerEvent) => void) | undefined
    if (fine && desktop) {
      const layers = [
        { el: q('[data-name]'), k: 0.02 },
        { el: q('[data-portrait-wrap]'), k: 0.04 },
        { el: q('[data-sphere]'), k: 0.06 },
      ].map(({ el, k }) => ({ x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }), k }))
      onMove = (e) => {
        const nx = (e.clientX / innerWidth) * 2 - 1
        const ny = (e.clientY / innerHeight) * 2 - 1
        signal.pointer.x = nx
        signal.pointer.y = ny
        layers.forEach((l) => {
          l.x(-nx * innerWidth * l.k * 0.5)
          l.y(-ny * innerHeight * l.k * 0.5)
        })
      }
      window.addEventListener('pointermove', onMove)
    }
    return () => {
      off()
      if (onMove) window.removeEventListener('pointermove', onMove)
    }
  })

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-24 md:px-10 lg:pt-28" aria-labelledby="hero-title">
      <div className="hair-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_70%)]" aria-hidden="true" />

      {/* Sphere + portrait (absolute on desktop, in flow on mobile) */}
      <div
        data-sphere
        className="pointer-events-none absolute right-[-18vw] top-[4vh] hidden aspect-square w-[64vw] max-w-[1000px] lg:block xl:right-[-14vw] xl:w-[56vw]"
        aria-hidden="true"
      >
        {sphere ? (
          <Suspense fallback={<SignalFallback className="h-full w-full" />}>
            <SignalSphere />
          </Suspense>
        ) : (
          <SignalFallback className="h-full w-full" />
        )}
      </div>

      <div className="relative flex flex-1 flex-col">
        <p data-eyebrow className="mono mb-5 lg:mb-6" data-hero-fade>
          Digital Marketing Executive <span className="text-lime">✳</span> Web Developer
        </p>

        <h1 id="hero-title" data-name className="display relative z-20 text-[clamp(3.6rem,16vw,15.5rem)]" data-hero-fade>
          <span data-name-line className="block">
            {site.first}
          </span>
          <span data-name-line className="block lg:pl-[8vw]">
            {site.last}
          </span>
          <span className="sr-only">, Digital Marketing Executive and Web Developer</span>
        </h1>

        <div data-portrait-wrap className="relative z-30 mt-8 w-full max-w-[420px] self-end lg:absolute lg:right-[7vw] lg:top-[4vh] lg:mt-0 lg:w-[min(27vw,420px)] xl:right-[9vw]">
          <div data-portrait className="aspect-[4/5]">
            <PersonaFlip className="h-full" />
          </div>
        </div>

        <div className="relative z-10 mt-12 grid gap-8 lg:mt-auto lg:max-w-[48vw] lg:pt-10">
          <p data-rise className="display text-[clamp(1.6rem,3.4vw,3rem)] !leading-[1] !tracking-[-0.03em]" data-hero-fade>
            Digital <RoleSwitcher roles={hero.roles} start={introDone} />
          </p>
          <p data-rise className="max-w-xl text-lg leading-snug md:text-xl" data-hero-fade>
            {site.tagline.lead}{' '}
            <span className="relative inline-block">
              <span className="serif-i text-[1.3em]">{site.tagline.italic}</span>
              <svg className="absolute -bottom-1 left-0 h-3 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                <path data-underline d="M2 8 C 50 2, 120 12, 198 5" fill="none" stroke="var(--color-lime)" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>{' '}
            <span className="muted">{site.tagline.rest}</span>
          </p>
          <div data-rise className="flex flex-wrap gap-3" data-hero-fade>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#work')
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--fg)] px-6 py-3.5 text-[var(--bg)] transition-colors hover:bg-lime hover:text-ink"
              data-magnetic
            >
              {hero.ctaWork}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#fyp"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#fyp')
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--fg)] px-6 py-3.5 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
              data-magnetic
              data-cursor="PLAY"
            >
              {hero.ctaListen} <span className="text-xs">▶</span>
            </a>
          </div>
          <p data-rise className="mono muted flex flex-wrap items-center gap-x-3 gap-y-1" data-hero-fade>
            <span>{site.location}</span>
            <Asterisk className="h-2.5 w-2.5 text-lime" spin />
            <span>
              <time>{time}</time> local
            </span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex items-end gap-6">
        <button type="button" onClick={() => scrollToTarget('#what')} className="mono flex shrink-0 items-center gap-2" aria-label="Scroll to next section">
          Scroll <span className="inline-block animate-bounce">↓</span>
        </button>
        <WaveLine className="flex-1" height={36} base={2} gain={18} />
      </div>
    </section>
  )
}
