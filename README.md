# Savoura

India, beautifully served.

This repository contains the application foundation for Savoura. The first experience is a scroll-driven carousel of regional dishes, built from the supplied reference imagery and ingredient notes.

## Getting started

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Use `npm run build` to type-check and build for production, `npm run typecheck` for TypeScript alone, and `npm run preview` to preview the production build.

## Structure

- `src/app` — application shell and the shared motion provider.
- `src/components` — reusable presentation components.
- `src/features` — self-contained experience sections and their assets.
- `src/hooks` — reusable motion, accessibility, and WebGL hooks.
- `src/lib/animation` — shared GSAP and ScrollTrigger registration.
- `src/lib/three` — lazy-loaded React Three Fiber and optional Rapier entry points.
- `src/lib/webgl` — low-level shader helpers.
- `src/styles` — global styles and Tailwind design tokens.
- `public` — static files served without processing.

## Motion and rendering

`MotionProvider` owns the Lenis instance and drives it from GSAP's ticker, with scroll updates forwarded to ScrollTrigger. It tears down its listeners and instance on unmount, and switches to native scrolling when reduced motion is requested. Use `useGsapContext` for component-scoped animations; it reverts them on cleanup and skips them for reduced motion. Design the static state first so content remains accessible when animations are skipped. Pass captured reactive values in the hook's dependency list.

`SceneCanvas` loads the React Three Fiber runtime only when mounted; `PhysicsWorld` separately loads Rapier only where needed. Canvas pixel ratio is capped and reduced-motion scenes use demand rendering; physics pauses for reduced motion. Scene components should also respect `useReducedMotion` for their own animation and interactions. React Three Fiber manages resources it creates declaratively; explicitly dispose any resources created outside its ownership.

For raw shaders, `createProgram` compiles and links a program and cleans up intermediate shaders. The caller must delete the returned program and any buffers, textures, or other GPU resources it creates. `useWebGL` provides an effect lifecycle for a canvas; its setup callback receives the reduced-motion preference and should return a cleanup function that cancels animation frames and disposes resources. Effects should provide a non-WebGL fallback and handle context loss when the experience requires it. GLSL files can be imported as strings with Vite's `?raw` suffix.

The supplied transparent food artwork is converted to WebP in `public/images/dishes`; the original PNGs remain in `reference/dish-assets`. Carousel content lives in `src/features/culinary-carousel/dishes.ts`. Visitors can scroll or use the controls to explore, and hover, focus, or tap to reveal ingredients. Only the two brand colors are defined as UI colors; imagery supplies its own natural colors.
