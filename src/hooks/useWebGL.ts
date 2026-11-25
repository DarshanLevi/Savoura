import { useEffect, type DependencyList, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

type WebGLSetup = (gl: WebGLRenderingContext, reducedMotion: boolean) => void | (() => void)

/** Owns a canvas context's setup and cleanup; effects own their GPU resources and RAFs. */
export function useWebGL(
  canvas: RefObject<HTMLCanvasElement | null>,
  setup: WebGLSetup,
  dependencies: DependencyList = [],
) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const gl = canvas.current?.getContext('webgl')
    if (!gl) return
    return setup(gl, reducedMotion)
    // Callers supply the values captured by setup, just as with useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, reducedMotion, ...dependencies])
}
