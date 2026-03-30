

# FlowSilhouette: Final Fine-Tuning

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Container size (line 67)
- `max-w-[800px]` → `max-w-[450px]`

### 2. Zone coordinates (lines 29–39)
Replace `ZONE_CONFIG` with:
```ts
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "30%", left: "34%", width: "8%",  height: "20%", rotate: "18deg" },
  { id: "braco_dir",       top: "30%", left: "58%", width: "8%",  height: "20%", rotate: "-18deg" },
  { id: "abdomen",         top: "35%", left: "40%", width: "20%", height: "15%", rotate: "0deg" },
  { id: "quadril_esq",     top: "50%", left: "40%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "quadril_dir",     top: "50%", left: "50%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "coxa_esq",        top: "58%", left: "38%", width: "10%", height: "20%", rotate: "5deg" },
  { id: "coxa_dir",        top: "58%", left: "52%", width: "10%", height: "20%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "75%", left: "40%", width: "8%",  height: "12%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "75%", left: "52%", width: "8%",  height: "12%", rotate: "-2deg" },
];
```

Key changes:
- **Arms**: left 32→34% (esq), 60→58% (dir) — moved inward
- **Hips**: left 37→40% (esq), 53→50% (dir) — centered by 3%
- **Thighs**: left 35→38% (esq), 55→52% (dir) — centered by 3%
- **Calves**: left 37→40% (esq), 55→52% (dir) — centered by 3%; top 80→75% — raised 5%

### 3. Everything else preserved
- Vibrant colors, 0.9 opacity, 5px blur, 1.5px blue guide borders, legacy wrapper, `calculateFlowScore`

## Files modified
- `src/components/FlowSilhouette.tsx`

