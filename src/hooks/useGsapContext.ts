import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import { gsap } from '../lib/animation/gsap'
import { useReducedMotion } from './useReducedMotion'

/** Scope animations to a component and revert them on teardown or preference changes. */
export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  setup: () => void,
  dependencies: DependencyList = [],
) {
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion || !scope.current) return
    const context = gsap.context(setup, scope.current)
    return () => context.revert()
    // Callers supply the values captured by setup, just as with useLayoutEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, reducedMotion, ...dependencies])
}
