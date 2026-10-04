import { useEffect, useRef, useState } from 'react'
import { bilingualCaption } from '../../data/content'
import { Logo } from '../Logo'
import { prefersReducedMotion } from '../../lib/motion'

/** A social post that comes alive: likes tick up, reach graph draws, caption types EN → Tamil. */
export function SocialDemo({ active }: { active: boolean }) {
  const [likes, setLikes] = useState(0)
  const [caption, setCaption] = useState('')
  const [lang, setLang] = useState<'en' | 'ta'>('en')
  const [cycle, setCycle] = useState(0)
  const graph = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!active) return
    const reduce = prefersReducedMotion()
    if (reduce) {
      setLikes(1284)
      setCaption(bilingualCaption.ta)
      setLang('ta')
      return
    }
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)))
    const type = async (text: string) => {
      const chars = Array.from(text)
      for (let i = 1; i <= chars.length && !cancelled; i++) {
        setCaption(chars.slice(0, i).join(''))
        await wait(45)
      }
    }
    const erase = async () => {
      let cur = Array.from(caption || bilingualCaption.en)
      while (cur.length && !cancelled) {
        cur = cur.slice(0, -1)
        setCaption(cur.join(''))
        await wait(18)
      }
    }
    ;(async () => {
      setLikes(0)
      setCaption('')
      setLang('en')
      if (graph.current) {
        graph.current.style.transition = 'none'
        graph.current.style.strokeDashoffset = '300'
        requestAnimationFrame(() => {
          if (!graph.current) return
          graph.current.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.16,1,.3,1)'
          graph.current.style.strokeDashoffset = '0'
        })
      }
      const start = performance.now()
      const tick = () => {
        if (cancelled) return
        const p = Math.min(1, (performance.now() - start) / 2600)
        setLikes(Math.round(1284 * (1 - (1 - p) ** 3)))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      await type(bilingualCaption.en)
      await wait(1400)
      await erase()
      setLang('ta')
      await type(bilingualCaption.ta)
      await wait(2600)
      if (!cancelled) setCycle((c) => c + 1)
    })()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, cycle])

  return (
    <div className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)]" aria-hidden="true">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-lime">
          <Logo className="h-3.5 w-auto" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">the.fyppodcast</p>
          <p className="text-[0.7rem] muted">Sponsored · Jaffna</p>
        </div>
        <span className="ml-auto text-lg muted">···</span>
      </div>
      <div className="relative aspect-[5/4] overflow-hidden bg-studio">
        <img src="/work/fyp-coming-soon-spark-720.webp" alt="" className="h-full w-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/55 p-3 backdrop-blur-sm">
          <div className="mono flex justify-between text-[0.6rem] text-paper/70">
            <span>Reach</span>
            <span className="text-lime">▲ 7 days</span>
          </div>
          <svg viewBox="0 0 200 50" className="mt-1 h-10 w-full">
            <path ref={graph} d="M0 46 C 20 44, 30 40, 45 38 S 70 30, 85 32 S 110 20, 125 18 S 150 12, 165 8 S 190 4, 200 2" fill="none" stroke="#BAF709" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300" />
          </svg>
        </div>
      </div>
      <div className="space-y-1.5 px-4 py-3">
        <div className="flex items-center gap-3 text-xl">
          <span className="text-onair">♥</span>
          <span>💬</span>
          <span>↗</span>
          <span className="mono ml-auto text-[0.65rem] tracking-normal">{likes.toLocaleString()} likes</span>
        </div>
        <p className={`min-h-[3em] text-sm leading-snug ${lang === 'ta' ? 'tamil' : ''}`}>
          <span className="font-semibold">the.fyppodcast</span> <span className="caret">{caption}</span>
        </p>
        <p className="mono text-[0.6rem] muted">{lang === 'en' ? 'EN' : 'தமிழ்'} · bilingual caption</p>
      </div>
    </div>
  )
}
