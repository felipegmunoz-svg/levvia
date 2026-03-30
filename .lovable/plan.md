

# Full SVG Rewrite of FlowSilhouette — Pure Organic Paths

## Strategy

Replace the PNG-based silhouette with a **pure SVG** feminine body drawn using organic `<path>` curves. No images, no geometric primitives. The silhouette will use glassmorphism aesthetics, and heat zones will be internal paths that glow **inside** the body.

## Architecture

The component keeps the same props interface (`painAreas`, `onAreaClick`, `showHydrationWave`, `className`) and the legacy wrapper for `Progress.tsx`. Only the rendering changes.

```text
┌──────────────────────────────┐
│  SVG viewBox="0 0 200 500"   │
│                              │
│  1. Body outline path        │
│     fill: white/0.1          │
│     stroke: white/0.3        │
│                              │
│  2. Heat zone paths (×9)     │
│     Clipped inside body      │
│     Glow via radialGradient  │
│     Pulsing via motion.path  │
│                              │
│  3. Dashed zone outlines     │
│     Visible affordance       │
│                              │
│  4. Optional hydration wave  │
│     Animated gradient fill   │
└──────────────────────────────┘
```

## Changes — `src/components/FlowSilhouette.tsx`

Full rewrite:

1. **Body outline**: A single `<path>` with organic cubic Bézier curves forming a feminine silhouette (head, neck, shoulders, arms, torso with waist curve, hips, legs, calves, feet). `viewBox="0 0 200 500"`. Filled `white` at `0.1` opacity, stroked `white` at `0.3` opacity.

2. **clipPath**: The body outline doubles as a `<clipPath>` so all heat effects are confined inside the silhouette — glowing "inside the glass."

3. **9 heat zone paths**: Each area (`braco_esq`, `braco_dir`, `abdomen`, `quadril_esq/dir`, `coxa_esq/dir`, `panturrilha_esq/dir`) is an organic `<path>` that follows the body contour in that region. When `intensity > 0`:
   - Filled with a `<radialGradient>` (yellow → orange → red based on intensity)
   - Blurred via `<feGaussianBlur stdDeviation="6">`
   - Pulsing opacity via `motion.path`
   - All clipped to stay inside the body

4. **Zone affordance**: Each zone has a subtle dashed outline (`stroke: rgba(200,200,200,0.25)`) so users know where to tap.

5. **Glassmorphism**: The container `<div>` gets `backdrop-filter: blur(10px)` and a subtle background. The SVG body itself has the frosted-glass appearance via low-opacity white fill.

6. **Hydration wave** (when `showHydrationWave=true`): A horizontal animated gradient that rises from the feet upward inside the body clipPath, simulating water filling.

7. **Legacy wrapper** and `calculateFlowScore` preserved exactly as-is.

## Why this fixes scaling

Since everything is pure SVG with a fixed `viewBox`, it scales perfectly to any container size. No image loading, no alignment issues, no `preserveAspectRatio` hacks.

## Files modified
- `src/components/FlowSilhouette.tsx` — full rewrite (pure SVG)

No other files modified.

