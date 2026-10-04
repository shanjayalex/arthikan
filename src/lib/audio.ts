import { useSyncExternalStore } from 'react'
import { fyp } from '../data/content'
import { signal } from './signal'
import { track } from './track'

type Status = 'checking' | 'missing' | 'ready'
type State = { status: Status; playing: boolean; time: number; duration: number; playerVisible: boolean; dismissed: boolean }

let state: State = { status: 'checking', playing: false, time: 0, duration: 0, playerVisible: false, dismissed: false }
const listeners = new Set<() => void>()
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

let el: HTMLAudioElement | null = null
let ctx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let freq: Uint8Array<ArrayBuffer> | null = null
let probed = false

/** Checks once whether the trailer file exists (until you export it, the player shows "coming soon"). */
export async function probeTrailer() {
  if (probed) return
  probed = true
  try {
    const res = await fetch(fyp.trailer, { method: 'HEAD' })
    const type = res.headers.get('content-type') || ''
    set({ status: res.ok && type.startsWith('audio') ? 'ready' : 'missing' })
  } catch {
    set({ status: 'missing' })
  }
}

function ensureGraph() {
  if (el) return
  el = new Audio(fyp.trailer)
  el.preload = 'metadata'
  el.crossOrigin = 'anonymous'
  el.addEventListener('timeupdate', () => set({ time: el!.currentTime }))
  el.addEventListener('loadedmetadata', () => set({ duration: el!.duration }))
  el.addEventListener('ended', () => set({ playing: false, time: 0 }))
  el.addEventListener('pause', () => set({ playing: false }))
  el.addEventListener('play', () => set({ playing: true, dismissed: false }))
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  const source = ctx.createMediaElementSource(el)
  analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.8
  freq = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  analyser.connect(ctx.destination)
  loop()
}

function loop() {
  if (analyser && freq && state.playing) {
    analyser.getByteFrequencyData(freq)
    let sum = 0
    for (let i = 0; i < 48; i++) sum += freq[i]
    signal.audio = (sum / 48 / 255) * 1.4
  } else {
    signal.audio *= 0.9
  }
  requestAnimationFrame(loop)
}

export async function togglePlay() {
  if (state.status !== 'ready') return
  ensureGraph()
  if (ctx?.state === 'suspended') await ctx.resume()
  if (el!.paused) {
    await el!.play()
    track('trailer_play')
  } else el!.pause()
}

export function seek(t: number) {
  if (el) el.currentTime = t
  set({ time: t })
}

export const setPlayerVisible = (v: boolean) => state.playerVisible !== v && set({ playerVisible: v })
export const dismissMini = () => {
  el?.pause()
  set({ dismissed: true })
}

/**
 * Fills `out` with `n` bar heights (0..1). Real frequency data while the trailer plays,
 * otherwise a gentle simulated voice so the visualiser never looks dead.
 */
export function readBars(out: Float32Array, t: number) {
  const n = out.length
  if (analyser && freq && state.playing) {
    analyser.getByteFrequencyData(freq)
    for (let i = 0; i < n; i++) out[i] = freq[Math.floor((i / n) * 64)] / 255
    return
  }
  const speak = 0.55 + 0.45 * Math.sin(t * 1.7) * Math.sin(t * 0.63)
  for (let i = 0; i < n; i++) {
    const x = i / n
    const env = Math.sin(Math.PI * x) ** 0.8
    const v = 0.5 + 0.5 * Math.sin(t * 6 + i * 0.55) * Math.cos(t * 3.1 - i * 0.27)
    out[i] = Math.max(0.06, env * v * speak)
  }
}

export function useAudio() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
  )
}

export const fmtTime = (s: number) => {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
