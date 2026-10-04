// Shared "signal" state. The podcast audio, scroll velocity and section beats all feed
// into one number, so every wave on the page reacts to the same thing.
export const signal = {
  velocity: 0, // Lenis scroll velocity
  audio: 0, // 0..1 loudness from the trailer analyser
  beat: 0, // short pulses (panel lock-ins, easter egg); decays every frame
  heroProgress: 0, // 0..1 while the hero scrolls away (flattens the sphere)
  pointer: { x: 0, y: 0 }, // -1..1 normalised mouse position
}

export function pulse(amount = 1) {
  signal.beat = Math.min(1.5, signal.beat + amount)
}

/** 0..~1.5 energy used to drive wave amplitude. */
export function energy() {
  return Math.min(1.2, Math.abs(signal.velocity) / 35) + signal.audio + signal.beat
}

if (typeof window !== 'undefined') {
  const decay = () => {
    signal.beat *= 0.93
    if (signal.beat < 0.001) signal.beat = 0
    requestAnimationFrame(decay)
  }
  requestAnimationFrame(decay)
}
