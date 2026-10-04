import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../lib/toast'

export function Toast() {
  const msg = useToast()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[150] flex justify-center">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="mono rounded-full bg-lime px-5 py-3 text-ink shadow-lg"
          >
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
