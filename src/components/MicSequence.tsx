import { useEffect, useRef } from 'react'
import { fyp } from '../data/content'
import { gsap, ScrollTrigger, isDesktop, prefersReducedMotion } from '../lib/motion'

const frameSrc = (i: number) => `/fyp/mic/frame_${String(i + 1).padStart(3, '0')}.webp`

/**
 * Scroll-scrubbed canvas of the exploding podcast mic (Part B · B4).
 * Renders nothing until you export the frames and set `fyp.micFrames`.
 */
export function MicSequence() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const count = fyp.micFrames

  useEffect(() => {
    if (!count || !isDesktop() || prefersReducedMotion()) return
    const ctx = canvas.current!.getContext('2d')!
    const imgs = Array.from({ length: count }, (_, i) => {
      const im = new Image()
      im.src = frameSrc(i)
      return im
    })
    const state = { f: 0 }
    const render = () => {
      const im = imgs[Math.round(state.f)]
      if (!im?.complete) return
      const c = canvas.current!
      c.width = c.clientWidth * devicePixelRatio
      c.height = c.clientHeight * devicePixelRatio
      const s = Math.max(c.width / im.width, c.height / im.height)
      ctx.drawImage(im, (c.width - im.width * s) / 2, (c.height - im.height * s) / 2, im.width * s, im.height * s)
    }
    imgs[0].onload = render
    const tween = gsap.to(state, {
      f: count - 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: { trigger: wrap.current, start: 'top top', end: '+=200%', pin: true, scrub: 0.5 },
    })
    gsap.fromTo('[data-mic-headline]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, scrollTrigger: { trigger: wrap.current, start: 'top+=150% top', end: 'top+=190% top', scrub: true } })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      ScrollTrigger.refresh()
    }
  }, [count])

  if (!count) return null
  return (
    <div ref={wrap} className="relative h-screen overflow-hidden">
      <p className="display outline-text pointer-events-none absolute inset-0 flex items-center justify-center text-center text-[14vw] text-paper/20" aria-hidden="true">
        Find your potential
      </p>
      <canvas ref={canvas} className="absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true" />
      <video className="absolute inset-0 h-full w-full object-cover lg:hidden" src="/fyp/mic/mic.mp4" muted playsInline autoPlay aria-hidden="true" />
      <p data-mic-headline className="serif-i absolute inset-x-0 bottom-[12vh] text-center text-[clamp(2rem,4vw,3.5rem)] text-paper">
        {fyp.headline}
      </p>
    </div>
  )
}
