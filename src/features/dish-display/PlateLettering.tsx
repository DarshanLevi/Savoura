// A single-stroke alphabet keeps the elongated letters close to the painted reference.
// Each point is mapped between the straight outer edge and the circular plate rim.
const strokes: Record<string, number[][][]> = {
  O: [[[.5,0],[.82,.04],[1,.19],[1,.8],[.83,.96],[.5,1],[.17,.96],[0,.8],[0,.19],[.18,.04],[.5,0]]],
  F: [[[0,1],[0,0],[1,0]],[[0,.46],[.8,.46]]],
  D: [[[0,1],[0,0],[.55,0],[.94,.1],[1,.32],[1,.74],[.86,.94],[.5,1],[0,1]]],
  N: [[[0,1],[0,0],[1,1],[1,0]]],
  E: [[[1,0],[0,0],[0,1],[1,1]],[[0,.48],[.78,.48]]],
  P: [[[0,1],[0,0],[.63,0],[.96,.07],[1,.27],[.88,.4],[.6,.46],[0,.46]]],
  L: [[[0,0],[0,1],[1,1]]],
  A: [[[0,1],[.46,0],[.55,0],[1,1]],[[.2,.63],[.8,.63]]],
  T: [[[0,0],[1,0]],[[.5,0],[.5,1]]],
  M: [[[0,1],[0,0],[.5,.57],[1,0],[1,1]]],
  Y: [[[0,0],[.5,.49],[1,0]],[[.5,.49],[.5,1]]],
  S: [[[1,.07],[.78,0],[.3,0],[.06,.09],[0,.28],[.12,.39],[.83,.58],[1,.7],[.96,.88],[.78,.98],[.3,1],[0,.93]]],
  R: [[[0,1],[0,0],[.62,0],[.94,.08],[1,.24],[.87,.39],[.58,.46],[0,.46]],[[.44,.46],[1,1]]],
  I: [[[.5,0],[.5,1]]],
}

function letteringRow(words: string, below: boolean, width: number) {
  const advance = (letter: string) => letter === ' ' ? .52 : letter === 'I' ? .44 : 1
  const unit = (width - 40) / [...words].reduce((sum, letter) => sum + advance(letter), 0)
  let cursor = 20

  return [...words].map((letter, index) => {
    const start = cursor
    cursor += advance(letter) * unit
    if (letter === ' ') return null
    const project = ([u, v]: number[]) => {
      const x = start + (cursor - start) * (.18 + .64 * u)
      const edge = 332 - Math.max(15, Math.sqrt(Math.max(0, 258 ** 2 - (x - width / 2) ** 2)))
      const y = below ? 664 - edge + v * (edge - 18) : 18 + v * (edge - 18)
      return [x, y]
    }
    const letterStrokes = strokes[letter].map((points, strokeIndex) => {
      const coords = points.map(project)
      // Round each bend with a quadratic segment while retaining long upright stems.
      let path = 'M' + coords[0].join(',')
      for (let i = 1; i < coords.length - 1; i++) {
        const corner = coords[i]
        const toward = (neighbor: number[]) => corner.map((value, axis) =>
          value + (neighbor[axis] - value) * .32)
        path += ' L' + toward(coords[i - 1]).join(',')
        path += ' Q' + corner.join(',') + ' ' + toward(coords[i + 1]).join(',')
      }
      path += ' L' + coords[coords.length - 1].join(',')
      return <path key={index + '-' + strokeIndex} d={path} pathLength={1}
        className={below && index < 5 ? (index < 2 ? 'india-saffron' : index > 2 ? 'india-green' : undefined) : undefined} />
    })
    return letterStrokes
  })
}

export function PlateLettering() {
  return [1000, 680].map(width => (
    <svg key={width} className={'plate-lettering plate-lettering-' + (width === 680 ? 'compact' : 'wide')}
      viewBox={`0 0 ${width} 664`} aria-hidden="true">
      <g>{letteringRow('ONE PLATE FROM', false, width)}</g>
      <g>{letteringRow('INDIA MANY STORIES', true, width)}</g>
    </svg>
  ))
}
