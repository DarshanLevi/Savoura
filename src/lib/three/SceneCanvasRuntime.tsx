import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function SceneCanvasRuntime({ children, className }: { children: ReactNode; className?: string }) {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas className={className} dpr={[1, 1.5]} frameloop={reducedMotion ? 'demand' : 'always'}>
      {children}
    </Canvas>
  )
}
