import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/animation/gsap'

import { ScrollContext } from '../lib/animation/scrollContext'

type MotionProviderProps = { children: ReactNode }

/** Owns the single Lenis instance and keeps ScrollTrigger in sync with it. */
export function MotionProvider({ children }: MotionProviderProps) {
  const scroll = useRef<Lenis | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({ autoRaf: false })
    scroll.current = lenis
    const updateScrollTrigger = () => ScrollTrigger.update()
    const tick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(tick)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', updateScrollTrigger)
      scroll.current = null
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [reducedMotion])

  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>
}
