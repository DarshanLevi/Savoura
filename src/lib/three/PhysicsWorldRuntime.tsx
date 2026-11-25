import { Physics } from '@react-three/rapier'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function PhysicsWorldRuntime({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  return <Physics paused={reducedMotion}>{children}</Physics>
}
