import { useEffect, useState, type RefObject } from 'react'

export function useInView(ref: RefObject<Element | null>, threshold = 0.4, rootMargin = '0px') {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold, rootMargin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref, threshold, rootMargin])
  return inView
}
