import { lazy, Suspense, useCallback, useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/animation/gsap'
import { dishes } from './dishes'
import './culinary-carousel.css'

import { ScrollContext } from '../../lib/animation/scrollContext'

const IndiaMap = lazy(() => import('./map/IndiaMap'))
const step = 360 / dishes.length

export function CulinaryCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progressArc, setProgressArc] = useState('')
  const orbitRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [heroVisible, setHeroVisible] = useState(true)
  const [detail, setDetail] = useState<number | null>(null)
  const [mapStart, setMapStart] = useState<number | null>(null)
  const mapOpen = useRef(false)
  const positionRef = useRef({ value: 0 })
  const tween = useRef<gsap.core.Tween | null>(null)
  const scroll = useContext(ScrollContext)
  const reducedMotion = useReducedMotion()

  const updateOrbit = useCallback((position: number) => {
    positionRef.current.value = position
    sectionRef.current?.style.setProperty('--dish-progress', String((position + 1) / dishes.length))
    orbitRef.current?.style.setProperty('--orbit-rotation', `${-position * step}deg`)
    const next = Math.max(0, Math.min(dishes.length - 1, Math.round(position)))
    if (activeRef.current !== next) {
      activeRef.current = next
      setActive(next)
      setDetail(null)
    }
  }, [])

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    if (reducedMotion) {
      updateOrbit(activeRef.current)
      return
    }
    const context = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (dishes.length - 1) * 0.6}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (!mapOpen.current) updateOrbit(self.progress * (dishes.length - 1)) },
      })
    }, sectionRef)
    return () => {
      triggerRef.current = null
      context.revert()
    }
  }, [reducedMotion, updateOrbit])

  useLayoutEffect(() => () => { tween.current?.kill() }, [reducedMotion])

  useLayoutEffect(() => {
    const track = trackRef.current
    const stage = track?.parentElement
    if (!track || !stage) return

    function fitProgressArc() {
      if (!track || !stage) return
      const bounds = stage.getBoundingClientRect()
      const circle = track.getBoundingClientRect()
      const outerRadius = circle.width / 2
      const x = circle.left - bounds.left + outerRadius
      const y = circle.top - bounds.top + outerRadius
      const radius = Math.max(outerRadius * .69, Math.hypot(bounds.width - x, y) + 12)
      const rightY = y + Math.sqrt(radius ** 2 - (bounds.width - x) ** 2)
      const topX = x - Math.sqrt(radius ** 2 - y ** 2)
      setProgressArc(`M ${bounds.width} ${rightY} A ${radius} ${radius} 0 0 1 ${topX} 0`)
    }

    fitProgressArc()
    const observer = new ResizeObserver(fitProgressArc)
    observer.observe(stage)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])


  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.01 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(dishes.length - 1, index))
    const trigger = triggerRef.current
    setDetail(null)
    if (trigger && !reducedMotion) {
      const target = trigger.start + (next / (dishes.length - 1)) * (trigger.end - trigger.start)
      if (scroll?.current) scroll.current.scrollTo(target, { immediate: true, force: true })
      else trigger.scroll(target)
      ScrollTrigger.update()
    } else {
      updateOrbit(next)
    }
  }

  function openMap() {
    mapOpen.current = true
    scroll?.current?.scrollTo(window.scrollY, { immediate: true, force: true })
    setDetail(null)
    setMapStart(active)
  }

  function previewDish(index: number) {
    tween.current?.kill()
    if (reducedMotion) return updateOrbit(index)
    tween.current = gsap.to(positionRef.current, {
      value: index, duration: .48, ease: 'power3.out',
      onUpdate: () => updateOrbit(positionRef.current.value),
    })
  }

  function finishMap(index: number) {
    tween.current?.kill()
    mapOpen.current = false
    goTo(index)
    updateOrbit(index)
    setMapStart(null)
  }

  function scrollToNext(revealHalf: boolean) {
    const nextSection = document.getElementById('next-section')
    if (!nextSection) return
    const target = nextSection.getBoundingClientRect().top + window.scrollY
      - (revealHalf ? window.innerHeight / 2 : 0)
    if (scroll?.current) {
      scroll.current.scrollTo(target, { duration: 1.5, easing: (progress) => 1 - Math.pow(1 - progress, 3) })
    } else {
      window.scrollTo({ top: target, behavior: reducedMotion ? 'instant' : 'smooth' })
    }
  }

  const shown = dishes[detail ?? active]

  return (
    <section className="culinary-hero" ref={sectionRef} aria-label="Explore regional Indian dishes">
      <main className="hero-main" id="top">
        <div className="carousel-stage" aria-label="Regional dishes carousel">
          <svg className="orbit-progress" aria-hidden="true">
            <path className="orbit-progress-track" d={progressArc} pathLength="1" />
            <path className="orbit-progress-fill" d={progressArc} pathLength="1" />
          </svg>
          <div className="orbit-track" ref={trackRef} aria-hidden="true"><div /></div>
          <div className="orbit" ref={orbitRef}>
            {dishes.map((dish, index) => {
              return (
                <div className="dish-position" key={dish.name} style={{ '--dish-angle': `${index * step}deg` } as CSSProperties}>
                  <button
                    className={`dish-button ${index === active ? 'is-active' : ''}`}
                    type="button"
                    tabIndex={index === active ? 0 : -1}
                    aria-label={`${dish.name}, ${dish.region}. ${index === active ? 'Show ingredients' : 'Select dish'}`}
                    onMouseEnter={() => setDetail(index)}
                    onMouseLeave={() => setDetail(null)}
                    onFocus={() => setDetail(index)}
                    onBlur={() => setDetail(null)}
                    onClick={() => index === active ? setDetail(index) : goTo(index)}
                  >
                    <img src={dish.image} alt="" loading={index === 0 || index === 1 || index === dishes.length - 1 ? 'eager' : 'lazy'} decoding="async" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <img className="hero-wordmark" src="/savoura-logo.png" alt="Savoura" />

        <div className="dish-caption" aria-live="polite" aria-atomic="true">
          <div className="dish-caption-content" key={shown.name}>
            <p className="caption-region"><span>A taste of {shown.region}</span></p>
            <h1>{shown.name}</h1>
            <p className="ingredient-label" id="ingredient-label">Main ingredients</p>
            <ul className="ingredient-list" aria-labelledby="ingredient-label">
              {shown.ingredients.map(ingredient => <li key={ingredient}><span>{ingredient}</span></li>)}
            </ul>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="carousel-controls" aria-label="Carousel controls">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous dish"><ArrowLeft size={17} strokeWidth={1.4} /></button>
            <span><strong>{String(active + 1).padStart(2, '0')}</strong><i />{String(dishes.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === dishes.length - 1} aria-label="Next dish"><ArrowRight size={17} strokeWidth={1.4} /></button>
          </div>
          <button className="atlas-trigger" type="button" aria-label="Explore the India map" aria-haspopup="dialog" aria-expanded={mapStart !== null} onClick={openMap}>
            <svg className="atlas-trigger-icon" viewBox="0 0 512 512" aria-hidden="true">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
            Explore
          </button>
        </div>
      </main>
      {heroVisible && mapStart === null && createPortal(
        <button
          className="next-section-button"
          type="button"
          aria-label="Continue to the next section"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse' && !reducedMotion) scrollToNext(true)
          }}
          onClick={() => scrollToNext(false)}
        >
          <ArrowDown size={22} strokeWidth={1.5} />
        </button>,
        document.body,
      )}
      {mapStart !== null && <Suspense fallback={null}>
        <IndiaMap initial={mapStart} onPreview={previewDish} onFinish={finishMap} />
      </Suspense>}
    </section>
  )
}
