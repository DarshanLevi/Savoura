import { useRef, useState, type CSSProperties } from 'react'
import { dishes } from '../culinary-carousel/dishes'
import { useGsapContext } from '../../hooks/useGsapContext'
import { gsap } from '../../lib/animation/gsap'
import { PlateLettering } from './PlateLettering'
import './dish-display.css'

// Left to right across the plate in the Figma composition.
const regions = [
  'Maharashtra', 'West Bengal', 'Tamil Nadu', 'Indo-Chinese', 'Gujarat',
  'Kerala', 'Andhra Pradesh', 'Punjab', 'Uttar Pradesh', 'Rajasthan',
]
const frames = regions.map(region => dishes.find(dish => dish.region === region)!)

export function DishDisplay() {
  const [active, setActive] = useState<number | null>(null)

  const section = useRef<HTMLDivElement>(null)
  useGsapContext(section, () => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: .35,
      },
    })
    timeline
      .from('.dish-display-serving', { x: () => window.innerWidth * .82, yPercent: 18,
        duration: 1.15, ease: 'power2.inOut' })
      .fromTo('.dish-display-contact-shadow', { opacity: 0 }, {
        opacity: 1, duration: .3, ease: 'sine.inOut',
      }, .85)
      .to('.dish-display-contact-shadow', { opacity: 0, duration: .12, ease: 'power2.out' }, '+=.35')
      .to('.dish-display-hand', { y: () => window.innerHeight,
        duration: .8, ease: 'sine.inOut' }, '<')
      .from('.dish-display-cut', {
        yPercent: index => index % 2 === 0 ? -100 : 100,
        duration: .7, stagger: .09, ease: 'power2.inOut',
      })
      .addLabel('write')

    // Keep both layouts at the same point in the sentence during a resize.
    section.current!.querySelectorAll('.plate-lettering').forEach(svg => {
      const strokes = svg.querySelectorAll(':scope > g path')
      gsap.set(strokes, { strokeDasharray: '1 1', strokeDashoffset: 1, visibility: 'hidden' })
      strokes.forEach((stroke, index) => {
        const start = 'write+=' + index * .055
        timeline.fromTo(stroke, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: .065, ease: 'sine.out',
        }, start)
          .to(stroke, { strokeDashoffset: 0, duration: .22, ease: 'sine.inOut' }, start)
      })
    })

    timeline.addLabel('closeUp', '+=.75')
      .to('.plate-lettering', { opacity: 0, duration: .65 }, 'closeUp')
      .to('.dish-display-plate', { scale: 1.65, duration: 2.4, ease: 'sine.inOut' }, 'closeUp')
      .to('.dish-display-frames', { filter: 'blur(8px)', duration: 1.2 }, 'closeUp')
      .to('.dish-display-cut', {
        autoAlpha: 0, duration: .65, stagger: .045, ease: 'sine.inOut',
      }, 'closeUp+=.48')
      .to('.dish-display-brand', { autoAlpha: 1, duration: .9 }, 'closeUp+=1.05')
      .to('.dish-display-stage', { backgroundColor: '#F4EDE0', duration: 1 }, 'closeUp+=1.7')
      .to('.dish-display-figure', { autoAlpha: 0, duration: 1 }, 'closeUp+=1.7')
      .to('.dish-display-brand img', { '--dock': 1, duration: 1.15, ease: 'sine.inOut' }, '+=.2')
  })

  return (
    <div ref={section} id="next-section" className="dish-display">
      <section className="dish-display-stage" aria-label="One plate from India, many stories. Ten regional dishes">
        <figure className="dish-display-figure">
          <PlateLettering />
          <div className="dish-display-serving">
          <div className="dish-display-plate">
            <div className="dish-display-frames"
            onPointerLeave={event => { if (event.pointerType !== 'touch') setActive(null) }}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(null) }}>
            {frames.map((frame, index) => (
              <button key={frame.region} type="button" className="dish-display-cut"
                aria-label={frame.name + ', ' + frame.region}
                data-active={active === index}
                onPointerEnter={event => { if (event.pointerType !== 'touch') setActive(index) }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                style={{ '--cut-position': index / (frames.length - 1) * 100 + '%' } as CSSProperties}>
                <img src={frame.image} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
            </div>
          </div>
          <span className="dish-display-contact-shadow" aria-hidden="true" />
          <img className="dish-display-hand" src="/serving-hand.webp" alt="" />
          </div>
        </figure>
      </section>
      <section className="dish-display-brand" aria-label="Savoura">
        <img src="/savoura-logo.png" alt="Savoura" />
      </section>
    </div>
  )
}
