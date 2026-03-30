

# FlowSilhouette: Lateral Expansion of Zones

## Changes — `src/components/FlowSilhouette.tsx` (lines 29–39)

Replace `ZONE_CONFIG` with the user's exact coordinates:

```ts
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "30%", left: "22%", width: "8%",  height: "20%", rotate: "18deg" },
  { id: "braco_dir",       top: "30%", left: "70%", width: "8%",  height: "20%", rotate: "-18deg" },
  { id: "abdomen",         top: "30%", left: "40%", width: "20%", height: "15%", rotate: "0deg" },
  { id: "quadril_esq",     top: "48%", left: "30%", width: "8%",  height: "8%",  rotate: "0deg" },
  { id: "quadril_dir",     top: "48%", left: "62%", width: "8%",  height: "8%",  rotate: "0deg" },
  { id: "coxa_esq",        top: "58%", left: "30%", width: "8%",  height: "20%", rotate: "5deg" },
  { id: "coxa_dir",        top: "58%", left: "62%", width: "8%",  height: "20%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "75%", left: "30%", width: "6%",  height: "12%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "75%", left: "62%", width: "6%",  height: "12%", rotate: "-2deg" },
];
```

### Summary of changes
- **Arms**: expanded outward (36→22% esq, 56→70% dir)
- **Abdomen**: raised (32→30%)
- **Hips**: raised (50→48%) + expanded (38→30% esq, 52→62% dir) + narrowed (10→8%)
- **Thighs**: expanded (36→30% esq, 54→62% dir) + narrowed (10→8%)
- **Calves**: expanded (38→30% esq, 54→62% dir)

No other changes. All visuals preserved.

## Files modified
- `src/components/FlowSilhouette.tsx`

