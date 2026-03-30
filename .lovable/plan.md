

# FlowSilhouette: Precision Zone Alignment

## Changes — `src/components/FlowSilhouette.tsx` (lines 29–39)

Replace `ZONE_CONFIG` with these adjusted coordinates:

```ts
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "30%", left: "36%", width: "8%",  height: "20%", rotate: "18deg" },
  { id: "braco_dir",       top: "30%", left: "56%", width: "8%",  height: "20%", rotate: "-18deg" },
  { id: "abdomen",         top: "32%", left: "40%", width: "20%", height: "15%", rotate: "0deg" },
  { id: "quadril_esq",     top: "50%", left: "38%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "quadril_dir",     top: "50%", left: "52%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "coxa_esq",        top: "58%", left: "36%", width: "10%", height: "20%", rotate: "5deg" },
  { id: "coxa_dir",        top: "58%", left: "54%", width: "10%", height: "20%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "75%", left: "38%", width: "6%",  height: "12%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "75%", left: "54%", width: "6%",  height: "12%", rotate: "-2deg" },
];
```

### Summary of changes
- **Arms**: inward 2% each (34→36% esq, 58→56% dir)
- **Abdomen**: raised 3% (top 35→32%)
- **Hips**: separated 2% each (40→38% esq, 50→52% dir)
- **Thighs**: separated 2% each (38→36% esq, 52→54% dir)
- **Calves**: separated 2% each (40→38% esq, 52→54% dir) + narrowed width 8→6%

No other changes. All visuals (colors, blur, borders, legacy wrapper) preserved.

## Files modified
- `src/components/FlowSilhouette.tsx`

