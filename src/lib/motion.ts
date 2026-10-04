import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export const MOTION = '(prefers-reduced-motion: no-preference)'
export const REDUCE = '(prefers-reduced-motion: reduce)'
export const DESKTOP = '(min-width: 1024px)'
export const FINE = '(hover: hover) and (pointer: fine)'

export type Conditions = { motion: boolean; reduce: boolean; desktop: boolean; fine: boolean }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(REDUCE).matches
export const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP).matches
export const isFinePointer = () => typeof window !== 'undefined' && window.matchMedia(FINE).matches

/**
 * Every animation on the site goes through this hook. It scopes selectors to `scope`,
 * re-runs when motion/desktop preferences change, and reverts everything on unmount —
 * so reduced-motion users get the plain (fade-only) branch automatically.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  cb: (c: Conditions) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return
    const mm = gsap.matchMedia(scope.current)
    mm.add({ motion: MOTION, reduce: REDUCE, desktop: DESKTOP, fine: FINE }, (ctx) =>
      cb(ctx.conditions as Conditions),
    )
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
