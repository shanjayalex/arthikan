import { useRef, useState } from 'react'
import { languages, skillGroups } from '../data/content'
import { gsap, useGsap } from '../lib/motion'
import { Asterisk } from './Asterisk'

const RADII = [0.36, 0.62, 0.9] // fraction of the half-size
const SPEED = [70, 95, 120] // seconds per revolution

export function SkillOrbit() {
  const root = useRef<HTMLElement>(null)
  const [ring, setRing] = useState<number | null>(null)
  const [tool, setTool] = useState<{ t: string; how: string } | null>(null)

  useGsap(root, ({ motion }) => {
    if (!motion) return
    gsap.from('[data-ring]', { scale: 0.4, opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '[data-orbit]', start: 'top 75%' } })
    gsap.from('[data-skill-rise]', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
  })

  return (
    <section ref={root} id="skills" aria-labelledby="skills-title" className="px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="mono mb-4">08 / Skills & tools</p>
          <h2 id="skills-title" data-skill-rise className="display text-[clamp(3rem,8vw,7rem)]">
            The <span className="serif-i">toolkit</span>
          </h2>

          {/* Desktop: legend that drives the orbit. Mobile: accordions. */}
          <ul className="mt-10 hidden space-y-2 lg:block">
            {skillGroups.map((g, i) => (
              <li key={g.name} data-skill-rise>
                <button
                  onMouseEnter={() => setRing(i)}
                  onMouseLeave={() => setRing(null)}
                  onFocus={() => setRing(i)}
                  onBlur={() => setRing(null)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${ring === i ? 'border-lime bg-lime/10' : 'border-[var(--line)]'}`}
                >
                  <span className="mono">
                    Ring {i + 1} · {g.name}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{g.skills.join(' · ')}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-2 lg:hidden">
            {skillGroups.map((g) => (
              <details key={g.name} className="group rounded-xl border border-[var(--line)] p-4 open:border-lime">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="display text-2xl">{g.name}</span>
                  <span className="text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)]">{g.skills.join(' · ')}</p>
                <ul className="mt-4 space-y-2">
                  {g.tools.map((t) => (
                    <li key={t.t} className="text-sm">
                      <span className="font-medium">{t.t}</span> <span className="muted">— {t.how}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          <div className="mt-10 space-y-4" data-skill-rise>
            <p className="mono">Languages</p>
            {languages.map((l) => (
              <div key={l.name}>
                <div className="flex justify-between text-sm">
                  <span className={l.name === 'Tamil' ? 'tamil' : ''}>{l.name === 'Tamil' ? 'தமிழ் · Tamil' : l.name}</span>
                  <span className="mono muted">{l.level}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                  <div className="h-full rounded-full bg-lime" style={{ width: `${l.value * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orbit (desktop) */}
        <div data-orbit className="relative mx-auto hidden aspect-square w-full max-w-[min(78vh,760px)] lg:block" aria-label="Skill orbit" role="group">
          {skillGroups.map((g, gi) => {
            const r = RADII[gi] * 50 // % of container
            const paused = ring === gi
            const dim = ring !== null && ring !== gi
            return (
              <div key={g.name} data-ring className="pointer-events-none absolute inset-0">
                <div className={`absolute inset-0 transition-opacity duration-500 ${dim ? 'opacity-25' : ''}`}>
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-colors ${paused ? 'border-lime' : 'border-[var(--line)]'}`}
                    style={{ width: `${r * 2}%`, height: `${r * 2}%` }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ animation: `spin ${SPEED[gi]}s linear infinite ${gi % 2 ? 'reverse' : 'normal'}`, animationPlayState: paused ? 'paused' : 'running' }}
                  >
                    {g.tools.map((t, ti) => {
                      const a = (ti / g.tools.length) * Math.PI * 2 + gi
                      return (
                        <div key={t.t} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + Math.cos(a) * r}%`, top: `${50 + Math.sin(a) * r}%` }}>
                          <div style={{ animation: `spin ${SPEED[gi]}s linear infinite ${gi % 2 ? 'normal' : 'reverse'}`, animationPlayState: paused ? 'paused' : 'running' }}>
                            <button
                              onMouseEnter={() => (setTool(t), setRing(gi))}
                              onMouseLeave={() => (setTool(null), setRing(null))}
                              onFocus={() => (setTool(t), setRing(gi))}
                              onBlur={() => (setTool(null), setRing(null))}
                              className={`pointer-events-auto whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                              tool?.t === t.t ? 'border-lime bg-lime text-ink' : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--fg)]'
                            }`}
                            >
                              {t.t}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <Asterisk className="h-16 w-16 text-lime" spin />
            <p className="mono mt-4 min-h-[1.2em]">{tool ? tool.t : ring !== null ? skillGroups[ring].name : 'Hover a tool'}</p>
            <p className="mt-1 min-h-[3em] text-xs text-[var(--muted)]" aria-live="polite">
              {tool?.how}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
