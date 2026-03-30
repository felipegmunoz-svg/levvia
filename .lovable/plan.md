

# Update Clickable Area Coordinates in FlowSilhouette

## Problem
HeatMapInteractive already delegates rendering to `FlowSilhouette`, which contains the `AREA_ELLIPSES` array. The ellipses are too small and misaligned with the PNG silhouette.

## Change

### `src/components/FlowSilhouette.tsx` — Lines 26–36

Replace `AREA_ELLIPSES` with the corrected, larger coordinates:

```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 22,  cy: 62,  rx: 10, ry: 22 },
  { id: "braco_dir",        cx: 78,  cy: 62,  rx: 10, ry: 22 },
  { id: "abdomen",          cx: 50,  cy: 52,  rx: 18, ry: 20 },
  { id: "quadril_esq",      cx: 38,  cy: 78,  rx: 13, ry: 11 },
  { id: "quadril_dir",      cx: 62,  cy: 78,  rx: 13, ry: 11 },
  { id: "coxa_esq",         cx: 38,  cy: 105, rx: 12, ry: 18 },
  { id: "coxa_dir",         cx: 62,  cy: 105, rx: 12, ry: 18 },
  { id: "panturrilha_esq",  cx: 37,  cy: 138, rx: 9,  ry: 16 },
  { id: "panturrilha_dir",  cx: 63,  cy: 138, rx: 9,  ry: 16 },
];
```

No other files modified.

## Files modified
- `src/components/FlowSilhouette.tsx` — 1 array replacement

