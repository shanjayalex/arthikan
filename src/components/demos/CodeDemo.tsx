import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../../lib/motion'

type Tok = [string, string] // [className, text]
const lines: Tok[][] = [
  [['text-[#c792ea]', 'export function '], ['text-[#82aaff]', 'Cta'], ['', '() {']],
  [['text-[#c792ea]', '  const '], ['', '[on, setOn] = '], ['text-[#82aaff]', 'useState'], ['', '('], ['text-[#f78c6c]', 'false'], ['', ')']],
  [['text-[#c792ea]', '  return '], ['', '(']],
  [['text-[#89ddff]', '    <button']],
  [['text-[#ffcb6b]', '      onClick'], ['', '={() => setOn(true)}']],
  [['text-[#ffcb6b]', '      className'], ['', '={on ? '], ['text-[#c3e88d]', "'bg-lime'"], ['', ' : '], ['text-[#c3e88d]', "'bg-ink'"], ['', '}']],
  [['text-[#89ddff]', '    >']],
  [['', '      Find your potential ✳']],
  [['text-[#89ddff]', '    </button>']],
  [['', '  )']],
  [['', '}']],
]
const total = lines.reduce((n, l) => n + l.reduce((m, t) => m + t[1].length, 0) + 1, 0)

/** A React component typing itself on the left while its live preview renders on the right. */
export function CodeDemo({ active }: { active: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) return setN(total)
    let id: ReturnType<typeof setTimeout>
    const step = () => {
      setN((v) => {
        if (v >= total + 70) return 0 // hold, then loop
        return v + (v < total ? 2 : 1)
      })
      id = setTimeout(step, 28)
    }
    id = setTimeout(step, 300)
    return () => clearTimeout(id)
  }, [active])

  let left = n
  const done = n >= total
  const lit = n > total * 0.62

  return (
    <div aria-hidden="true" className="grid w-full max-w-[620px] overflow-hidden rounded-xl border border-white/10 bg-[#0d0f0c] text-[0.72rem] shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)] sm:grid-cols-[1.35fr_1fr]">
      <div className="border-white/10 p-4 font-mono leading-[1.7] text-[#d6deeb] sm:border-r">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[0.6rem] text-white/40">Cta.tsx</span>
        </div>
        <pre className="whitespace-pre">
          {lines.map((l, i) => {
            if (left <= 0) return <div key={i}>&nbsp;</div>
            const out = l.map(([cls, text], k) => {
              const shown = text.slice(0, Math.max(0, left))
              left -= text.length
              return (
                <span key={k} className={cls}>
                  {shown}
                </span>
              )
            })
            left -= 1
            return <div key={i}>{out}{left <= 0 && !done && <span className="caret" />}</div>
          })}
        </pre>
      </div>
      <div className="flex flex-col bg-[#f7f7f2] p-4 text-ink">
        <span className="mono text-[0.55rem] text-[#8a8a84]">localhost:5173 — preview</span>
        <div className="flex flex-1 items-center justify-center py-8">
          <span
            className={`rounded-full px-5 py-3 text-sm font-medium transition-all duration-500 ${
              lit ? 'scale-105 bg-lime text-ink shadow-[0_10px_30px_-5px_rgba(186,247,9,.8)]' : n > total * 0.3 ? 'bg-ink text-paper' : 'bg-transparent text-transparent'
            }`}
          >
            Find your potential ✳
          </span>
        </div>
        <span className="mono text-[0.55rem] text-[#8a8a84]">{done ? '✓ deployed to vercel' : 'compiling…'}</span>
      </div>
    </div>
  )
}
