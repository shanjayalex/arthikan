import { useRef } from 'react'
import { site } from '../data/content'
import { gsap, SplitText, useGsap } from '../lib/motion'
import { scrollToTarget } from '../lib/smooth'
import { pulse } from '../lib/signal'
import { useLocalTime } from '../lib/useLocalTime'
import { Asterisk } from './Asterisk'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const time = useLocalTime()
  useGsap(root, ({ motion }) => {
    if (!motion) return
    const s = SplitText.create('[data-wordmark]', { type: 'chars', mask: 'chars' })
    gsap.from(s.chars, { yPercent: 110, duration: 1.2, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 85%' } })
  })
  return (
    <footer ref={root} className="overflow-hidden px-5 pb-6 pt-16 md:px-10">
      <p data-wordmark className="display w-full whitespace-nowrap text-center text-[17vw] !leading-[0.8]" aria-hidden="true">
        {site.first}
      </p>
      <div className="mono mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-[0.62rem] md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Built with React & Vercel</span>
        <span>Sri Lanka · {time}</span>
        <button
          onClick={() => {
            pulse(1.2)
            scrollToTarget(0)
          }}
          className="u-link self-start md:self-auto"
        >
          Back to top ↑
        </button>
      </div>
      <p className="mt-6 flex items-center justify-center gap-2 text-center font-serif text-lg italic text-[var(--muted)]">
        Find your potential. <Asterisk className="h-3 w-3 text-lime" spin />
      </p>
    </footer>
  )
}
