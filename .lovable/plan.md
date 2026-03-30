

# FlowSilhouette: Blur Filter, Arm Rotation, Updated Coordinates & Z-Index

## Changes in `src/components/FlowSilhouette.tsx`

### 1. Add blur filter in `<defs>` (after line 86)
Add a `<filter>` element for the heat aura blur:
```xml
<filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="5" />
</filter>
```

### 2. Replace `AREA_ELLIPSES` array (lines 28–38)
New coordinates with `rotate` field for arm inclination:
```ts
const AREA_ELLIPSES = [
  { id: "braco_esq",        cx: 26,  cy: 78,  rx: 9,  ry: 28, rotate: 12  },
  { id: "braco_dir",        cx: 74,  cy: 78,  rx: 9,  ry: 28, rotate: -12 },
  { id: "abdomen",          cx: 50,  cy: 52,  rx: 15, ry: 20, rotate: 0   },
  { id: "quadril_esq",      cx: 39,  cy: 97,  rx: 12, ry: 10, rotate: 0   },
  { id: "quadril_dir",      cx: 61,  cy: 97,  rx: 12, ry: 10, rotate: 0   },
  { id: "coxa_esq",         cx: 38,  cy: 120, rx: 10, ry: 16, rotate: 0   },
  { id: "coxa_dir",         cx: 62,  cy: 120, rx: 10, ry: 16, rotate: 0   },
  { id: "panturrilha_esq",  cx: 38,  cy: 147, rx: 8,  ry: 12, rotate: 0   },
  { id: "panturrilha_dir",  cx: 62,  cy: 147, rx: 8,  ry: 12, rotate: 0   },
];
```

### 3. Update ellipse rendering (lines 89–109)
- Destructure `rotate` from each area
- Add `transform={`rotate(${rotate}, ${cx}, ${cy})`}` to each ellipse
- Add `filter="url(#heatBlur)"` when `intensity > 0`
- Remove `strokeWidth` and `strokeDasharray` props (keep `stroke="transparent"`)

### 4. Fix z-index on container elements (lines 53–72)
- Add `style={{ position: "relative", zIndex: 0 }}` to the `<img>`
- Add `zIndex: 1` to the SVG's existing inline style object

## Files modified
- `src/components/FlowSilhouette.tsx`

