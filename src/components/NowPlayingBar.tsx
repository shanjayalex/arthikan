import { AnimatePresence, motion } from 'framer-motion'
import { fyp } from '../data/content'
import { dismissMini, togglePlay, useAudio } from '../lib/audio'
import { scrollToTarget } from '../lib/smooth'
import { Bars } from './Bars'

/** Docks to the bottom when the trailer is playing and the player has scrolled away. */
export function NowPlayingBar() {
  const a = useAudio()
  const show = a.playing && !a.playerVisible && !a.dismissed
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-4 left-1/2 z-[130] flex w-[min(92vw,440px)] -translate-x-1/2 items-center gap-3 rounded-full bg-studio py-2 pl-2 pr-3 text-paper shadow-2xl ring-1 ring-white/10"
          role="region"
          aria-label="Now playing"
        >
          <button onClick={togglePlay} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-ink" aria-label={a.playing ? 'Pause' : 'Play'}>
            {a.playing ? '❚❚' : '▶'}
          </button>
          <button onClick={() => scrollToTarget('#fyp-player')} className="min-w-0 flex-1 text-left">
            <span className="mono block text-[0.55rem] text-lime">Now playing · FYP</span>
            <span className="block truncate text-sm">{fyp.episode.title}</span>
          </button>
          <Bars count={12} className="h-6 w-16" />
          <button onClick={dismissMini} className="px-1 text-paper/60 hover:text-paper" aria-label="Stop and close">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
