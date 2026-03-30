

# FlowSilhouette: Final coordinate adjustment + cleanup

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Update AREA_ELLIPSES (lines 29–39)

```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 64,  cy: 185, rx: 18, ry: 60, rotate: -5 },
  { id: "braco_dir",        cx: 136, cy: 185, rx: 18, ry: 60, rotate:  5 },
  { id: "abdomen",          cx: 100, cy: 180, rx: 27, ry: 68, rotate:  0 },
  { id: "quadril_esq",      cx: 82,  cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "quadril_dir",      cx: 118, cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "coxa_esq",         cx: 80,  cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "coxa_dir",         cx: 120, cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "panturrilha_esq",  cx: 80,  cy: 430, rx: 11, ry: 36, rotate:  0 },
  { id: "panturrilha_dir",  cx: 120, cy: 430, rx: 11, ry: 36, rotate:  0 },
];
```

Coordinate changes summary:
- Arms: cx 68→64 (left), 132→136 (right) — spread outward
- Abdomen: cy 190→180 — kept at cx 100
- Quadril: unchanged (82/118)
- Coxas: cx 82→80 (left), 118→120 (right)
- Panturrilhas: cx 81→80 (left), 119→120 (right)

### 2. Confirm debug removal

The previous message already removed calibration labels and debug useEffect. Verify no remnants exist; if any `<text>` calibration elements or debug `useEffect`/`imgRef` remain, remove them.

## Files modified
- `src/components/FlowSilhouette.tsx`

