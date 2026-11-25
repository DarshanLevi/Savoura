import { useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { dishes } from '../dishes'
// State boundaries projected and simplified from github.com/udit-001/india-maps-data.
import states from './states.json'
import './india-map.css'

const stateFor = (region: string) => ({ Chettinad: 'Tamil Nadu', 'Indo-Chinese': 'West Bengal' })[region] ?? region
const stateNames = dishes.map(dish => stateFor(dish.region))

type Props = {
  initial: number
  onPreview: (index: number) => void
  onFinish: (index: number) => void
}

export default function IndiaMap({ initial, onPreview, onFinish }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const [preview, setPreview] = useState(initial)
  const [lifted, setLifted] = useState(false)
  const dish = dishes[preview]
  const state = states.find(item => item.name === stateNames[preview])!
  const anchor = state.anchor!

  useLayoutEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => element.close()
  }, [])

  async function closeMap(index: number) {
    if (closing.current) return
    closing.current = true
    const element = dialog.current!
    element.dataset.closing = 'true'
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const fade = element.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 250, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards',
      })
      await fade.finished
    }
    onFinish(index)
  }

  function show(index: number) {
    if (closing.current) return
    setPreview(index)
    setLifted(true)
    onPreview(index)
  }

  return <dialog ref={dialog} className="atlas" data-lenis-prevent aria-labelledby="atlas-title"
    onCancel={event => { event.preventDefault(); closeMap(preview) }}
    onClick={event => { if (event.target === event.currentTarget) closeMap(preview) }}>
    <section className="atlas-sheet">
      <header className="atlas-header">
        <h2 id="atlas-title">Explore India</h2>
        <button autoFocus type="button" className="atlas-close" aria-label="Close map" onClick={() => closeMap(preview)}><X size={18} /></button>
      </header>
      <p className="atlas-legend">Select a highlighted state to visit its dish.</p>
      <svg className="atlas-map" viewBox="0 0 410 450" aria-label="Map of India by state" role="group"
        onPointerMove={event => {
          if (event.pointerType === 'mouse' && event.target === event.currentTarget) setLifted(false)
        }}
        onPointerLeave={event => { if (event.pointerType === 'mouse') setLifted(false) }}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setLifted(false) }}>
        {states.map(item => {
          const first = stateNames.indexOf(item.name)
          const available = first >= 0
          const target = item.name === state.name ? preview : first
          return <path key={item.name} d={item.path} className={available ? 'has-dishes' : ''}
            data-lifted={lifted && item.name === state.name || undefined}
            role={available ? 'button' : undefined} aria-label={item.name} tabIndex={available ? 0 : undefined}
            onPointerEnter={event => { if (available && event.pointerType === 'mouse') show(target) }}
            onFocus={() => available && show(target)}
            onClick={() => available && closeMap(target)}
            onKeyDown={event => {
              if (available && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                closeMap(target)
              }
            }} />
        })}
        <g key={state.name} className="atlas-lift" data-visible={lifted} aria-hidden="true">
          <path d={state.path} className="atlas-edge" />
          <path d={state.path} className="atlas-face" />
          <image href={dish.image} x={anchor[0]-15} y={anchor[1]-25} width="30" height="30" />
        </g>
      </svg>
      <div className="atlas-selection" aria-live="polite">
        <img src={dish.image} alt="" width="52" height="52" />
        <div><small>{state.name}</small><p>{dish.name}</p></div>
      </div>
    </section>
  </dialog>
}
