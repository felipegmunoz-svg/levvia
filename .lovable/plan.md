

# FlowSilhouette: SVG Ellipse Migration with Aspect-Ratio Fix

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Replace `ZONE_CONFIG` with `AREA_ELLIPSES` (lines 28–39)
```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 44,  cy: 179, rx: 14, ry: 70, rotate: -8 },
  { id: "braco_dir",        cx: 156, cy: 179, rx: 14, ry: 70, rotate:  8 },
  { id: "abdomen",          cx: 100, cy: 157, rx: 39, ry: 75, rotate:  0 },
  { id: "quadril_esq",      cx: 83,  cy: 250, rx: 17, ry: 25, rotate:  0 },
  { id: "quadril_dir",      cx: 117, cy: 250, rx: 17, ry: 25, rotate:  0 },
  { id: "coxa_esq",         cx: 79,  cy: 327, rx: 17, ry: 48, rotate:  0 },
  { id: "coxa_dir",         cx: 121, cy: 327, rx: 17, ry: 48, rotate:  0 },
  { id: "panturrilha_esq",  cx: 78,  cy: 429, rx: 16, ry: 40, rotate:  0 },
  { id: "panturrilha_dir",  cx: 122, cy: 429, rx: 16, ry: 40, rotate:  0 },
];
```

### 2. Container aspect-ratio fix (line 82)
- `aspectRatio: "3 / 4"` → `aspectRatio: "478 / 1271"`

### 3. Image class fix (line 89)
- `object-contain` → `object-fill`

### 4. Replace div overlay with SVG overlay (lines 93–125)
Replace the `<div className="absolute inset-0">` block with:
- `<svg viewBox="0 0 200 500" className="absolute inset-0 w-full h-full">` overlay
- SVG `<defs>` with `<filter id="glow"><feGaussianBlur stdDeviation="5"/></filter>`
- Each zone rendered as `<ellipse>` with `cx`, `cy`, `rx`, `ry` and `transform="rotate(deg, cx, cy)"`
- Inactive + interactive: `stroke="#60A5FA"`, `strokeWidth="1.5"`, `strokeDasharray="4 3"`, `fill="transparent"`
- Active: `fill` from `GLOW_BACKGROUNDS`, blur filter applied, framer-motion pulsing opacity animation
- `onClick` handler on each ellipse, `cursor: pointer` when interactive

### 5. Everything else preserved
- `calculateFlowScore`, legacy wrapper, debug `useEffect`, `GLOW_BACKGROUNDS`, `GLOW_SHADOWS`

## Files modified
- `src/components/FlowSilhouette.tsx`

