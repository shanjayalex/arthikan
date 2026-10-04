import { useRef, useState } from 'react'
import { contact, contactCopy, site, socials } from '../data/content'
import { gsap, useGsap } from '../lib/motion'
import { toast } from '../lib/toast'
import { track } from '../lib/track'
import { WaveLine } from './WaveLine'

const SocialIcon = ({ label }: { label: string }) => {
  const p: Record<string, string> = {
    LinkedIn: 'M4 9h4v11H4zM6 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4M10 9h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V20h-4v-4.8c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V20h-4z',
    X: 'M17.7 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.2 21H2.1l7.2-8.3L1.6 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.2 4.7H5.4z',
    Instagram: 'M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4m0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6m6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0M12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1c.1-2.7 1.4-4 4.1-4.1 1.1-.1 1.4-.2 4.2-.2',
    Threads: 'M16.3 11.2c-.1 0-.2-.1-.3-.1-.2-3-1.8-4.7-4.5-4.7-1.6 0-3 .7-3.8 2l1.5 1c.6-.9 1.5-1.1 2.3-1.1 1 0 1.7.3 2.2.9.3.4.6 1 .7 1.7-.8-.1-1.6-.2-2.5-.1-2.5.1-4.1 1.6-4 3.6.1 1 .6 1.9 1.4 2.4.7.5 1.6.7 2.6.6 1.3-.1 2.3-.6 3-1.4.5-.7.9-1.5 1-2.6.6.4 1.1.9 1.3 1.5.4 1 .4 2.7-1 4.1-1.2 1.2-2.7 1.8-4.9 1.8-2.5 0-4.4-.8-5.6-2.4C4.6 16.9 4 14.8 4 12s.6-4.9 1.8-6.4C7 4 8.9 3.2 11.4 3.2s4.4.8 5.7 2.4c.6.8 1.1 1.7 1.4 2.8l1.8-.5c-.4-1.4-1-2.6-1.8-3.6-1.6-2-4-3.1-7.1-3.1-3.1 0-5.4 1-7 3.1C3 6.2 2.2 8.8 2.2 12s.8 5.8 2.3 7.7c1.6 2 4 3.1 7 3.1 2.7 0 4.6-.7 6.2-2.3 2.1-2.1 2-4.7 1.3-6.3-.5-1.2-1.4-2.2-2.7-3m-4.6 4.4c-1.1.1-2.2-.4-2.2-1.4 0-.8.6-1.6 2.3-1.7h.6c.6 0 1.2.1 1.7.2-.2 2.4-1.3 2.8-2.4 2.9',
    Facebook: 'M14 21v-8h2.7l.4-3.2H14V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H8V13h2.7v8z',
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d={p[label]} />
    </svg>
  )
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [types, setTypes] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useGsap(root, ({ motion, fine }) => {
    if (!motion) return
    gsap.from('[data-c-letter]', { yPercent: 110, duration: 1, stagger: 0.02, ease: 'expo.out', scrollTrigger: { trigger: '[data-c-head]', start: 'top 80%' } })
    gsap.from('[data-social]', {
      rotate: -140,
      transformOrigin: '50% 260%',
      opacity: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: '[data-socials]', start: 'top 90%' },
    })
    if (!fine) return
    // Headline letters lean away from the cursor (12px max) and settle.
    const head = root.current!.querySelector<HTMLElement>('[data-c-head]')!
    const letters = gsap.utils.toArray<HTMLElement>('[data-c-letter]', head)
    const movers = letters.map((l) => ({ l, x: gsap.quickTo(l, 'x', { duration: 0.5, ease: 'power3' }), y: gsap.quickTo(l, 'y', { duration: 0.5, ease: 'power3' }) }))
    const move = (e: PointerEvent) => {
      movers.forEach((m) => {
        const r = m.l.getBoundingClientRect()
        const dx = r.left + r.width / 2 - e.clientX
        const dy = r.top + r.height / 2 - e.clientY
        const dist = Math.hypot(dx, dy)
        const f = dist < 140 ? (1 - dist / 140) * 12 : 0
        m.x(dist ? (dx / dist) * f : 0)
        m.y(dist ? (dy / dist) * f : 0)
      })
    }
    const leave = () => movers.forEach((m) => (m.x(0), m.y(0)))
    head.addEventListener('pointermove', move)
    head.addEventListener('pointerleave', leave)
    return () => {
      head.removeEventListener('pointermove', move)
      head.removeEventListener('pointerleave', leave)
    }
  })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      toast('Copied ✳')
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
    track('email_copy')
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const data = { name: String(f.get('name')), email: String(f.get('email')), message: String(f.get('message')), types: types.join(', ') }
    track('contact_submit')
    if (!contact.formEndpoint) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})\nProject: ${data.types || 'n/a'}`
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`New project — ${data.types || 'hello'}`)}&body=${encodeURIComponent(body)}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(contact.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      setStatus('sent')
      form.reset()
      setTypes([])
    } catch {
      setStatus('error')
    }
  }

  const word = (w: string, cls = '') => (
    <span className={`inline-block whitespace-nowrap ${cls}`}>
      {Array.from(w).map((c, i) => (
        <span key={i} className="line-mask inline-block">
          <span data-c-letter className="inline-block">
            {c}
          </span>
        </span>
      ))}
    </span>
  )

  const field = 'w-full border-b border-[var(--line)] bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-[var(--muted)] focus:border-lime'

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="relative px-5 pt-24 md:px-10 md:pt-32">
      <p className="mono mb-6">11 / Contact</p>
      <h2 id="contact-title" data-c-head className="display text-[clamp(3rem,10.5vw,10rem)]" aria-label={`${contactCopy.lead} ${contactCopy.italic}`}>
        <span aria-hidden="true">
          {contactCopy.lead.split(' ').map((w, i) => (
            <span key={i}>{word(w)} </span>
          ))}
          <br />
          {contactCopy.italic.split(' ').map((w, i) => (
            <span key={i}>{word(w, 'serif-i text-lime [-webkit-text-stroke:1px_var(--fg)]')} </span>
          ))}
        </span>
      </h2>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <button onClick={copyEmail} className="group block text-left" data-cursor="COPY">
            <span className="mono muted block">Email · click to copy</span>
            <span className="u-link mt-2 inline-block text-[clamp(1.4rem,3vw,2.4rem)]">{contact.email}</span>
          </button>
          <div className="grid gap-6 sm:grid-cols-2">
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_click')} className="group block">
              <span className="mono muted block">WhatsApp / Phone</span>
              <span className="u-link mt-2 inline-block text-xl">{contact.phone}</span>
            </a>
            <div>
              <span className="mono muted block">Location</span>
              <span className="mt-2 block text-xl">{contact.location}</span>
            </div>
          </div>
          <a
            href={site.cv}
            download
            onClick={() => track('cv_download', { from: 'contact' })}
            className="inline-flex items-center gap-3 rounded-full bg-[var(--fg)] px-6 py-4 text-[var(--bg)] transition-colors hover:bg-lime hover:text-ink"
            data-magnetic
          >
            Download CV <span>↓</span>
          </a>

          <ul data-socials className="flex flex-wrap gap-3 pt-4" aria-label="Social profiles">
            {socials.map((s) => (
              <li key={s.label} data-social>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.label} — ${s.handle}`}
                  className="group flex flex-col items-center gap-2"
                  data-magnetic
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-[var(--line)] transition-colors group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
                    <SocialIcon label={s.label} />
                  </span>
                  <span className="mono text-[0.55rem] text-[var(--muted)]">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-6" aria-label="Contact form">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">Name</span>
              <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
            </label>
            <label className="block">
              <span className="sr-only">Email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
            </label>
          </div>
          <fieldset>
            <legend className="mono muted mb-3">Project type</legend>
            <div className="flex flex-wrap gap-2">
              {contactCopy.projectTypes.map((t) => {
                const on = types.includes(t)
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTypes((v) => (on ? v.filter((x) => x !== t) : [...v, t]))}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${on ? 'border-lime bg-lime text-ink' : 'border-[var(--line)] hover:border-[var(--fg)]'}`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <label className="block">
            <span className="sr-only">Message</span>
            <textarea name="message" required rows={4} placeholder="Tell me about it…" className={`${field} resize-none`} />
          </label>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={status === 'sending'} className="rounded-full bg-lime px-7 py-4 font-medium text-ink transition-transform hover:scale-105 disabled:opacity-50" data-magnetic>
              {status === 'sending' ? 'Sending…' : 'Send message ↗'}
            </button>
            <p className="text-sm" role="status">
              {status === 'sent' && 'Thanks! I’ll get back to you soon ✳'}
              {status === 'error' && <>Something went wrong. Email me at {contact.email}.</>}
            </p>
          </div>
        </form>
      </div>

      <div className="mt-24" aria-hidden="true">
        <WaveLine mode="heartbeat" height={80} base={2} gain={10} strokeWidth={2} />
      </div>
    </section>
  )
}
