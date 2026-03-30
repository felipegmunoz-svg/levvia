

# FlowSilhouette: Update AREA_ELLIPSES with calibrated coordinates

## Changes — `src/components/FlowSilhouette.tsx`

Replace the `AREA_ELLIPSES` array (lines 35–45) with the user's calibrated values:

```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 68,  cy: 185, rx: 18, ry: 60, rotate: -5 },
  { id: "braco_dir",        cx: 132, cy: 185, rx: 18, ry: 60, rotate:  5 },
  { id: "abdomen",          cx: 100, cy: 160, rx: 27, ry: 65, rotate:  0 },
  { id: "quadril_esq",      cx: 82,  cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "quadril_dir",      cx: 118, cy: 265, rx: 16, ry: 20, rotate:  0 },
  { id: "coxa_esq",         cx: 82,  cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "coxa_dir",         cx: 118, cy: 330, rx: 14, ry: 46, rotate:  0 },
  { id: "panturrilha_esq",  cx: 81,  cy: 430, rx: 11, ry: 36, rotate:  0 },
  { id: "panturrilha_dir",  cx: 119, cy: 430, rx: 11, ry: 36, rotate:  0 },
];
```

Key shifts: arms inward (45→68 / 155→132), wider rx (15→18), reduced rotation (-8→-5), abdomen raised (150→160), hips/calves lowered (248→265, 425→430). Calibration labels and all other code preserved.

## Files modified
- `src/components/FlowSilhouette.tsx`

