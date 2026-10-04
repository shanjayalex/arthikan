import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { days: Math.floor(s / 86400), hrs: Math.floor((s % 86400) / 3600), min: Math.floor((s % 3600) / 60), sec: s % 60 }
}

function Digit({ d }: { d: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={d}
          className="absolute inset-0 text-center"
          initial={{ y: '-100%', rotateX: 80, opacity: 0 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1 }}
          exit={{ y: '100%', rotateX: -80, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Flip-digit countdown to the episode launch; switches to NOW STREAMING afterwards. */
export function Countdown({ to, liveHref }: { to: string; liveHref: string }) {
  const target = new Date(to).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const left = target - now

  if (left <= 0)
    return (
      <a href={liveHref} target="_blank" rel="noreferrer" className="mono inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-ink">
        <span className="h-2 w-2 animate-pulse rounded-full bg-onair" /> Now streaming ↗
      </a>
    )

  const p = parts(left)
  const label = `${p.days} days, ${p.hrs} hours, ${p.min} minutes until launch`
  return (
    <div role="timer" aria-label={label} className="flex items-end gap-3 sm:gap-5">
      {(Object.entries(p) as [string, number][]).map(([k, v], i) => (
        <div key={k} className="flex items-end gap-3 sm:gap-5">
          <div>
            <div className="font-mono text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-none tabular-nums text-lime" aria-hidden="true">
              {String(v)
                .padStart(2, '0')
                .split('')
                .map((d, j) => (
                  <Digit key={j} d={d} />
                ))}
            </div>
            <div className="mono mt-2 text-[0.58rem] text-paper/50">{k}</div>
          </div>
          {i < 3 && <span className="pb-6 font-mono text-2xl text-paper/30" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  )
}
