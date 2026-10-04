import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Asterisk } from './Asterisk'
import { prefersReducedMotion } from '../lib/motion'

type Go = (to: string) => void
const Ctx = createContext<Go>(() => {})
export const useGo = () => useContext(Ctx)

/** Route changes: a lime panel wipes up, the ✳ spins once, then the next page is revealed. */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle')
  const pending = useRef('')

  const go = useCallback<Go>(
    (to) => {
      if (prefersReducedMotion()) return navigate(to)
      pending.current = to
      setPhase('cover')
    },
    [navigate],
  )

  const y = phase === 'cover' ? '0%' : phase === 'reveal' ? '-100%' : '100%'
  return (
    <Ctx.Provider value={go}>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[180] flex items-center justify-center bg-lime text-ink"
        initial={false}
        animate={{ y }}
        transition={phase === 'idle' ? { duration: 0 } : { duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (phase === 'cover') {
            navigate(pending.current)
            requestAnimationFrame(() => setPhase('reveal'))
          } else if (phase === 'reveal') setPhase('idle')
        }}
      >
        <motion.div animate={{ rotate: phase === 'cover' ? 180 : 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <Asterisk className="h-16 w-16" />
        </motion.div>
      </motion.div>
    </Ctx.Provider>
  )
}
