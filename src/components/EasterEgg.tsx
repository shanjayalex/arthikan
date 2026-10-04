import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pulse } from '../lib/signal'

/** Type "fyp" anywhere (outside form fields) for a sound-wave burst. */
export function EasterEgg() {
  const [show, setShow] = useState(0)
  useEffect(() => {
    let buf = ''
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey) return
      buf = (buf + e.key.toLowerCase()).slice(-3)
      if (buf === 'fyp') {
        buf = ''
        pulse(1.5)
        setShow(Date.now())
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => setShow(0), 1600)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key={show}
          className="pointer-events-none fixed inset-0 z-[160] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[50vh] w-full -translate-y-1/2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.path
                key={i}
                d={`M0 200 ${Array.from({ length: 50 }, (_, k) => `L${k * 20 + 20} ${200 + Math.sin(k * 0.9 + i) * (40 + i * 28) * Math.sin((k / 50) * Math.PI)}`).join(' ')}`}
                fill="none"
                stroke="#BAF709"
                strokeWidth={2 - i * 0.3}
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>
          <motion.p
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="relative rounded-full bg-ink px-7 py-4 text-paper"
          >
            <span className="serif-i text-3xl">Find your potential</span> <span className="text-lime">✳</span>
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
