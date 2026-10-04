import { useEffect, useRef } from 'react'
import { fyp } from '../data/content'
import { fmtTime, probeTrailer, seek, setPlayerVisible, togglePlay, useAudio } from '../lib/audio'
import { src } from '../lib/img'
import { Bars } from './Bars'

export function TrailerPlayer() {
  const a = useAudio()
  const card = useRef<HTMLDivElement>(null)
  const ready = a.status === 'ready'

  useEffect(() => {
    probeTrailer()
    const io = new IntersectionObserver(([e]) => setPlayerVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(card.current!)
    return () => {
      io.disconnect()
      setPlayerVisible(false)
    }
  }, [])

  return (
    <div
      ref={card}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-5"
      data-cursor={ready ? 'PLAY' : undefined}
      onKeyDown={(e) => {
        if (e.key === ' ' && e.target === e.currentTarget) {
          e.preventDefault()
          togglePlay()
        }
      }}
      tabIndex={-1}
    >
      <div className="flex items-center gap-4">
        <img src={src(fyp.episode.cover)} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover object-top sm:h-20 sm:w-20" loading="lazy" />
        <div className="min-w-0 flex-1">
          <p className="mono text-[0.6rem] text-lime">Episode {fyp.episode.number} · Trailer</p>
          <p className="truncate text-lg text-paper">{fyp.episode.title}</p>
          <p className="mono mt-1 text-[0.58rem] text-paper/50">{ready ? `${fmtTime(a.time)} / ${fmtTime(a.duration)}` : a.status === 'checking' ? 'Loading…' : 'Trailer coming soon'}</p>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          aria-label={a.playing ? 'Pause trailer' : ready ? 'Play trailer' : 'Trailer coming soon'}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lime text-xl text-ink transition-transform enabled:hover:scale-110 disabled:opacity-40"
          data-magnetic
        >
          {a.playing ? '❚❚' : '▶'}
        </button>
      </div>
      <Bars className="mt-5 h-14" />
      {ready && (
        <input
          type="range"
          min={0}
          max={a.duration || 0}
          step={0.1}
          value={a.time}
          onChange={(e) => seek(Number(e.target.value))}
          aria-label="Seek trailer"
          className="mt-3 w-full accent-[#BAF709]"
        />
      )}
    </div>
  )
}
