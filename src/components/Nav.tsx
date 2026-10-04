import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { nav, site } from '../data/content'
import { Logo } from './Logo'
import { Asterisk } from './Asterisk'
import { ThemeToggle } from './ThemeToggle'
import { scrollToTarget } from '../lib/smooth'
import { useGo } from './PageTransition'
import { track } from '../lib/track'

export function Nav() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const go = useGo()

  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      setScrolled(y > 40)
      setHidden(y > 300 && y > last + 4 ? true : y < last - 4 ? false : (h) => h)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const jump = (href: string) => {
    setOpen(false)
    if (pathname !== '/') return go('/' + href)
    scrollToTarget(href)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[110] transition-transform duration-500 ease-[var(--ease-expo)] ${hidden && !open ? '-translate-y-full' : ''}`}
      >
        <div
          className={`mx-auto flex items-center justify-between gap-4 px-5 py-4 transition-[background-color,backdrop-filter] duration-500 md:px-10 ${
            scrolled && !open ? 'bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] backdrop-blur-md' : ''
          }`}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              if (pathname !== '/') go('/')
              else scrollToTarget(0)
            }}
            className="group flex items-center gap-1.5"
            aria-label="Arthikan Vettivel, home"
          >
            <Logo className="h-6 w-auto" />
            <Asterisk className="h-3.5 w-3.5 text-lime transition-transform duration-700 group-hover:rotate-180" />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault()
                  jump(n.href)
                }}
                className="u-link text-sm"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {site.openToWork && (
              <span className="mono hidden items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-[0.62rem] sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Open to work
              </span>
            )}
            <ThemeToggle />
            <a
              href={site.cv}
              download
              onClick={() => track('cv_download', { from: 'nav' })}
              className="hidden rounded-full bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-lime hover:text-ink md:inline-block"
              data-magnetic
            >
              Download CV
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-2.5 w-4">
                <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform ${open ? '-translate-y-[4px] -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[105] flex flex-col justify-between bg-[var(--bg)] px-5 pb-10 pt-24"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }}
            animate={{ clipPath: 'circle(150% at 95% 4%)' }}
            exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {nav.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => {
                    e.preventDefault()
                    jump(n.href)
                  }}
                  className="display text-[15vw] leading-[0.95]"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <a href={site.cv} download className="mono rounded-full bg-lime px-5 py-4 text-center text-ink" onClick={() => track('cv_download', { from: 'menu' })}>
              Download CV ↓
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
