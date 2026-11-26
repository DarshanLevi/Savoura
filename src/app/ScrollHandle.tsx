import { useContext, useLayoutEffect, useRef } from 'react'
import { ScrollContext } from '../lib/animation/scrollContext'

const progressSteps = 1000

function scrollDistance() {
  const root = document.documentElement
  return Math.max(0, root.scrollHeight - root.clientHeight)
}

export function ScrollHandle() {
  const inputRef = useRef<HTMLInputElement>(null)
  const scroll = useContext(ScrollContext)

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return

    const sync = () => {
      const distance = scrollDistance()
      input.hidden = distance === 0
      input.value = String(distance ? (window.scrollY / distance) * progressSteps : 0)
    }

    const observer = new ResizeObserver(sync)
    observer.observe(document.body)
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    sync()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return (
    <input
      ref={inputRef}
      className="page-scroll-handle"
      type="range"
      aria-label="Page scroll position"
      aria-orientation="vertical"
      min={0}
      max={progressSteps}
      defaultValue={0}
      onChange={(event) => {
        const target = (event.currentTarget.valueAsNumber / progressSteps) * scrollDistance()
        if (scroll?.current) scroll.current.scrollTo(target, { immediate: true })
        else window.scrollTo({ top: target, behavior: 'instant' })
      }}
    />
  )
}
