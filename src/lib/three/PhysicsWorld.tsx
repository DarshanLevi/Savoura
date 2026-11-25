import { lazy, Suspense, type ReactNode } from 'react'

const Physics = lazy(() => import('./PhysicsWorldRuntime'))

/** Physics is loaded separately, only for scenes that need it. */
export function PhysicsWorld({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}><Physics>{children}</Physics></Suspense>
}
