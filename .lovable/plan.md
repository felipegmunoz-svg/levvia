

# Fix FlowSilhouette: Visual Affordance + Corrected Coordinates

## Changes

### `src/components/FlowSilhouette.tsx`

**1. Replace `AREA_ELLIPSES` (lines 26–36)** with new coordinates and labels:

```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 18,  cy: 80,  rx: 10, ry: 32, label: "Braço esq." },
  { id: "braco_dir",        cx: 82,  cy: 80,  rx: 10, ry: 32, label: "Braço dir." },
  { id: "abdomen",          cx: 50,  cy: 55,  rx: 17, ry: 24, label: "Torso" },
  { id: "quadril_esq",      cx: 37,  cy: 100, rx: 13, ry: 11, label: "Quadril esq." },
  { id: "quadril_dir",      cx: 63,  cy: 100, rx: 13, ry: 11, label: "Quadril dir." },
  { id: "coxa_esq",         cx: 36,  cy: 124, rx: 12, ry: 17, label: "Coxa esq." },
  { id: "coxa_dir",         cx: 64,  cy: 124, rx: 12, ry: 17, label: "Coxa dir." },
  { id: "panturrilha_esq",  cx: 35,  cy: 150, rx: 10, ry: 13, label: "Panturrilha esq." },
  { id: "panturrilha_dir",  cx: 65,  cy: 150, rx: 10, ry: 13, label: "Panturrilha dir." },
];
```

**2. Replace ellipse rendering (lines 79–99)** to add dashed border when unselected and subtle white fill for affordance:

```tsx
{AREA_ELLIPSES.map(({ id, cx, cy, rx, ry }) => {
  const intensity = (painAreas[id] ?? 0) as 0 | 1 | 2 | 3;
  const gradientId = intensity === 1 ? "heat-leve"
                   : intensity === 2 ? "heat-moderado"
                   : intensity === 3 ? "heat-intenso"
                   : null;
  return (
    <ellipse
      key={id}
      cx={cx} cy={cy} rx={rx} ry={ry}
      fill={gradientId ? `url(#${gradientId})` : "rgba(255,255,255,0.06)"}
      stroke={intensity > 0 ? "transparent" : "rgba(255,255,255,0.30)"}
      strokeWidth={0.6}
      strokeDasharray={intensity > 0 ? "0" : "2,2"}
      className={interactive ? "cursor-pointer" : ""}
      onClick={interactive ? () => onAreaClick!(id) : undefined}
      style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
    />
  );
})}
```

No other files modified.

## Files modified
- `src/components/FlowSilhouette.tsx` — coordinates + visual affordance

