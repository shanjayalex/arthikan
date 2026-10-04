import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Img } from '../data/content'
import { src } from '../lib/img'
import { startScroll, stopScroll } from '../lib/smooth'

type Props = { items: Img[]; index: number | null; onChange: (i: number | null) => void }

export function Lightbox({ items, index, onChange }: Props) {
  const close = useRef<HTMLButtonElement>(null)
  const open = index !== null

  useEffect(() => {
    if (!open) return
    stopScroll()
    const prev = document.activeElement as HTMLElement | null
    close.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % items.length)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      startScroll()
      prev?.focus()
    }
  }, [open, index, items.length, onChange])

  const item = open ? items[index] : null
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.label || item.alt}
          className="fixed inset-0 z-[170] flex flex-col bg-studio/95 p-4 text-paper backdrop-blur md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
          data-lenis-prevent
        >
          <div className="mono flex items-center justify-between">
            <span>
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button ref={close} onClick={() => onChange(null)} className="rounded-full border border-white/20 px-4 py-2 hover:bg-lime hover:text-ink">
              Close ✕
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={item.src}
                src={src(item.src, 1400)}
                alt={item.alt}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => onChange(((index ?? 0) - 1 + items.length) % items.length)} className="mono rounded-full border border-white/20 px-4 py-2 hover:bg-white/10" aria-label="Previous image">
              ← Prev
            </button>
            <p className="text-center text-sm">
              {item.label}
              {item.concept && <span className="mono ml-2 text-[0.6rem] text-white/50">Unofficial concept</span>}
            </p>
            <button onClick={() => onChange(((index ?? 0) + 1) % items.length)} className="mono rounded-full border border-white/20 px-4 py-2 hover:bg-white/10" aria-label="Next image">
              Next →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
