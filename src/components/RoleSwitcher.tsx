import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { prefersReducedMotion } from '../lib/motion'

/** Slot-machine roll through the roles every 2.4s. */
export function RoleSwitcher({ roles, start = true }: { roles: string[]; start?: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!start || prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2400)
    return () => clearInterval(id)
  }, [roles.length, start])

  return (
    <span className="relative inline-grid overflow-hidden align-bottom" aria-live="off">
      {/* invisible longest role reserves the width so the line doesn't jump */}
      <span className="invisible col-start-1 row-start-1">{roles.reduce((a, b) => (b.length > a.length ? b : a))}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={roles[i]}
          className="col-start-1 row-start-1"
          initial={{ y: '110%', rotateX: -60, opacity: 0 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1 }}
          exit={{ y: '-110%', rotateX: 60, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
