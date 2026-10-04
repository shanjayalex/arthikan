// The hero waits for the preloader before it plays its intro.
let done = false
const listeners = new Set<() => void>()

export function finishIntro() {
  if (done) return
  done = true
  listeners.forEach((l) => l())
  listeners.clear()
}

export function onIntroDone(cb: () => void) {
  if (done) {
    cb()
    return () => {}
  }
  listeners.add(cb)
  return () => listeners.delete(cb)
}
