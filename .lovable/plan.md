

# FlowSilhouette: Update AREA_ELLIPSES coordinates

## Changes — `src/components/FlowSilhouette.tsx`

Replace lines 35–45 (the `AREA_ELLIPSES` array) with the user's exact coordinates:

```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 45,  cy: 180, rx: 15, ry: 65, rotate: -8 },
  { id: "braco_dir",        cx: 155, cy: 180, rx: 15, ry: 65, rotate:  8 },
  { id: "abdomen",          cx: 100, cy: 150, rx: 28, ry: 70, rotate:  0 },
  { id: "quadril_esq",      cx: 85,  cy: 248, rx: 15, ry: 20, rotate:  0 },
  { id: "quadril_dir",      cx: 115, cy: 248, rx: 15, ry: 20, rotate:  0 },
  { id: "coxa_esq",         cx: 83,  cy: 325, rx: 14, ry: 46, rotate:  0 },
  { id: "coxa_dir",         cx: 117, cy: 325, rx: 14, ry: 46, rotate:  0 },
  { id: "panturrilha_esq",  cx: 82,  cy: 425, rx: 11, ry: 36, rotate:  0 },
  { id: "panturrilha_dir",  cx: 118, cy: 425, rx: 11, ry: 36, rotate:  0 },
];
```

Key differences from current values: arms moved outward (cx 60→45 / 140→155), wider rx on arms (10→15), abdomen ry slightly reduced (72→70), legs slightly adjusted toward center.

No other files modified.

## Files modified
- `src/components/FlowSilhouette.tsx`

