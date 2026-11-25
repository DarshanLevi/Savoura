import { lazy, Suspense, type ReactNode } from 'react'

const Canvas = lazy(() => import('./SceneCanvasRuntime'))

type SceneCanvasProps = {
  children: ReactNode
  className?: string
  fallback?: ReactNode
}

/** Loads Three.js only when a scene is actually mounted. */
export function SceneCanvas({ children, className, fallback = null }: SceneCanvasProps) {
  return (
    <Suspense fallback={fallback}>
      <Canvas className={className}>{children}</Canvas>
    </Suspense>
  )
}
