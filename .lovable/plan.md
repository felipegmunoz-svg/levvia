

# FlowSilhouette: Image-Based with HTML Glow Zones

## Strategy

Abandon SVG body drawing entirely. Use the real PNG images as the visual base and overlay invisible `<div>` touch zones positioned with CSS percentages. When tapped, zones glow using CSS `box-shadow` / `filter: drop-shadow()` — creating the illusion of light emanating from inside the silhouette.

## Architecture

```text
┌─ Container (relative, aspect-[3/4]) ──────────┐
│                                                │
│  <img> — flow_silhouette_base/full.png         │
│         object-contain, z-0                    │
│                                                │
│  ┌─ Overlay (absolute inset-0, z-10) ────────┐ │
│  │                                           │ │
│  │  9 × <div> touch zones                    │ │
│  │    positioned via top/left/width/height %  │ │
│  │    rotated via CSS transform              │ │
│  │    invisible by default                   │ │
│  │    on click → glow via box-shadow         │ │
│  │    dashed border in onboarding mode       │ │
│  └───────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

## Changes — `src/components/FlowSilhouette.tsx`

Full rewrite:

### 1. Zone config — user's exact coordinates
```ts
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "28%", left: "18%", width: "12%", height: "25%", rotate: "15deg" },
  { id: "braco_dir",       top: "28%", left: "70%", width: "12%", height: "25%", rotate: "-15deg" },
  { id: "abdomen",         top: "30%", left: "38%", width: "24%", height: "20%", rotate: "0deg" },
  { id: "quadril_esq",     top: "48%", left: "30%", width: "15%", height: "10%", rotate: "0deg" },
  { id: "quadril_dir",     top: "48%", left: "55%", width: "15%", height: "10%", rotate: "0deg" },
  { id: "coxa_esq",        top: "55%", left: "28%", width: "15%", height: "25%", rotate: "5deg" },
  { id: "coxa_dir",        top: "55%", left: "57%", width: "15%", height: "25%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "78%", left: "30%", width: "12%", height: "15%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "78%", left: "58%", width: "12%", height: "15%", rotate: "-2deg" },
];
```

### 2. Glow colors per intensity
```ts
const GLOW_COLORS = {
  1: "rgba(253, 230, 138, 0.7)",  // yellow
  2: "rgba(253, 186, 116, 0.8)",  // orange
  3: "rgba(252, 165, 165, 0.9)",  // red
};
const GLOW_SHADOWS = {
  1: "0 0 15px rgba(245, 158, 11, 0.5), 0 0 30px rgba(245, 158, 11, 0.2)",
  2: "0 0 15px rgba(234, 88, 12, 0.6), 0 0 30px rgba(234, 88, 12, 0.3)",
  3: "0 0 15px rgba(220, 38, 38, 0.7), 0 0 30px rgba(220, 38, 38, 0.3)",
};
```

### 3. Core component
- `<img>` with `object-contain` as base — chooses `flow_silhouette_full.png` when `showHydrationWave`, otherwise `flow_silhouette_base.png`
- Absolute overlay with 9 `<div>` zones using the CSS positions above
- Each zone: `border-radius: 40%` for organic shape, `transition: all 0.3s ease`
- When `intensity > 0`: `background` + `boxShadow` from glow maps, pulsing via `motion.div` opacity animation
- New prop `showGuides` (defaults to `true` when `onAreaClick` is set): shows dashed white borders on zones
- When `intensity === 0` and `showGuides`: `border: 1px dashed rgba(255,255,255,0.2)`

### 4. Preserved exports
- `calculateFlowScore` — unchanged
- Legacy wrapper — unchanged (converts `heatMapData`/`waterIntakeMl` props)

## Files modified
- `src/components/FlowSilhouette.tsx` — full rewrite (image + HTML glow zones)

