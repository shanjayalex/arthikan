import { useRef, useState } from 'react'
import { hero } from '../data/content'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { srcSet, src } from '../lib/img'

type Mode = 'executive' | 'creator'
const other = (m: Mode): Mode => (m === 'executive' ? 'creator' : 'executive')

/**
 * Signature interaction: a 180px spotlight follows the cursor and reveals the other
 * persona underneath. Click / tap flips fully. Label reads MODE: EXECUTIVE ↔ CREATOR.
 */
export function PersonaFlip({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('executive')
  const [peek, setPeek] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const local = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || busy.current) return
    const { x, y } = local(e)
    gsap.to(top.current, { '--x': `${x}px`, '--y': `${y}px`, duration: 0.35, ease: 'power3' })
  }
  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || busy.current) return
    const { x, y } = local(e)
    gsap.set(top.current, { '--x': `${x}px`, '--y': `${y}px` })
    gsap.to(top.current, { '--r': '180px', duration: 0.6, ease: 'expo.out' })
    setPeek(true)
  }
  const leave = () => {
    if (busy.current) return
    gsap.to(top.current, { '--r': '0px', duration: 0.5, ease: 'expo.inOut' })
    setPeek(false)
  }
  const flip = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (busy.current) return
    busy.current = true
    const r = box.current!.getBoundingClientRect()
    const p = 'clientX' in e && e.clientX ? local(e) : { x: r.width / 2, y: r.height / 2 }
    const full = Math.hypot(r.width, r.height) + 40
    gsap.set(top.current, { '--x': `${p.x}px`, '--y': `${p.y}px` })
    gsap.to(top.current, {
      '--r': `${full}px`,
      duration: prefersReducedMotion() ? 0.01 : 0.7,
      ease: 'expo.inOut',
      onComplete: () => {
        setMode((m) => other(m))
        setPeek(false)
        gsap.set(top.current, { '--r': '0px' })
        busy.current = false
      },
    })
  }

  const shown = peek ? other(mode) : mode
  const mask = 'radial-gradient(circle var(--r) at var(--x) var(--y), #000 98%, transparent 100%)'
  const Img = ({ m, priority }: { m: Mode; priority?: boolean }) => (
    <img
      src={src(hero.portraits[m].src)}
      srcSet={srcSet(hero.portraits[m].src)}
      sizes="(min-width: 1024px) 32vw, 86vw"
      alt={hero.portraits[m].alt}
      width={1254}
      height={1254}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
      draggable={false}
    />
  )

  return (
    <div className={className}>
      <div
        ref={box}
        role="button"
        tabIndex={0}
        aria-label={`Portrait, ${mode} mode. Press to switch to ${other(mode)} mode.`}
        aria-pressed={mode === 'creator'}
        onPointerMove={move}
        onPointerEnter={enter}
        onPointerLeave={leave}
        onClick={flip}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), flip(e))}
        className="relative h-full w-full select-none overflow-hidden rounded-t-[999px] rounded-b-[28px] bg-[#cfd0cc]"
        data-cursor="FLIP"
      >
        <Img m={mode} priority={mode === 'executive'} />
        <div ref={top} className="absolute inset-0" style={{ ['--r' as string]: '0px', ['--x' as string]: '50%', ['--y' as string]: '50%', WebkitMaskImage: mask, maskImage: mask }}>
          <Img m={other(mode)} />
        </div>
        <div className="mono pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between text-[0.6rem] text-white">
          <span className="rounded-full bg-black/55 px-2.5 py-1.5 backdrop-blur">
            MODE: <span className="text-lime">{shown.toUpperCase()}</span>
          </span>
          <span className="hidden rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur sm:inline">Hover · tap to flip</span>
        </div>
      </div>
    </div>
  )
}
