import { lazy, Suspense, useCallback, useContext, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Map as MapIcon } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../../lib/animation/gsap'
import { dishes } from './dishes'
import './culinary-carousel.css'

import { ScrollContext } from '../../lib/animation/scrollContext'

const IndiaMap = lazy(() => import('./map/IndiaMap'))
const step = 360 / dishes.length

export function CulinaryCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [detail, setDetail] = useState<number | null>(null)
  const [mapStart, setMapStart] = useState<number | null>(null)
  const mapOpen = useRef(false)
  const positionRef = useRef({ value: 0 })
  const tween = useRef<gsap.core.Tween | null>(null)
  const scroll = useContext(ScrollContext)
  const reducedMotion = useReducedMotion()

  const updateOrbit = useCallback((position: number) => {
    positionRef.current.value = position
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

  const shown = dishes[detail ?? active]

  return (
    <section className="culinary-hero" ref={sectionRef} aria-label="Explore regional Indian dishes">
      <main className="hero-main" id="top">
        <div className="carousel-stage" aria-label="Regional dishes carousel">
          <div className="orbit-track" aria-hidden="true"><div /></div>
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

        <p className="hero-wordmark">savoura.</p>

        <div className="dish-caption" aria-live="polite" aria-atomic="true">
          <p className="caption-region">A taste of {shown.region}</p>
          <h1>{shown.name}</h1>
          <p className="ingredient-label" id="ingredient-label">Main ingredients</p>
          <ul className="ingredient-list" aria-labelledby="ingredient-label">
            {shown.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}
          </ul>
        </div>

        <div className="hero-bottom">
          <div className="carousel-controls" aria-label="Carousel controls">
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous dish"><ArrowLeft size={17} strokeWidth={1.4} /></button>
            <span><strong>{String(active + 1).padStart(2, '0')}</strong><i />{String(dishes.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => goTo(active + 1)} disabled={active === dishes.length - 1} aria-label="Next dish"><ArrowRight size={17} strokeWidth={1.4} /></button>
          </div>
          <button className="atlas-trigger" type="button" aria-haspopup="dialog" aria-expanded={mapStart !== null} onClick={openMap}>
            <MapIcon size={18} strokeWidth={1.5} /> India map
          </button>
        </div>
      </main>
      {mapStart !== null && <Suspense fallback={null}>
        <IndiaMap initial={mapStart} onPreview={previewDish} onFinish={finishMap} />
      </Suspense>}
    </section>
  )
}
