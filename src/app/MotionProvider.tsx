import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/animation/gsap'

type MotionProviderProps = { children: ReactNode }

/** Owns the single Lenis instance and keeps ScrollTrigger in sync with it. */
export function MotionProvider({ children }: MotionProviderProps) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({ autoRaf: false })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(tick)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return children
}
