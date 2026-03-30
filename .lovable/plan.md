

# Rebuild FlowSilhouette with PNG Images + SVG Overlay

## Critical Compatibility Note

The user's prompt uses **English area IDs** (`chest`, `leftArm`, `rightCalf`, etc.), but the entire codebase (HeatMapInteractive, HeatMapCard, syncOnboarding, Diagnosis, Profile, Progress, DayReview, etc. — 9+ files) uses **Portuguese IDs** (`abdomen`, `braco_esq`, `panturrilha_dir`, etc.). Changing the IDs would break data flow everywhere.

**Decision**: Keep the existing Portuguese area IDs in the ellipse definitions. Map the ellipse positions from the user's spec to the Portuguese IDs:

| User spec ID | Mapped to | Ellipse position |
|---|---|---|
| `chest` | `abdomen` (torso area) | cx:50, cy:52 |
| `abdomen` | *merged into abdomen* | cx:50, cy:70 |
| `hips` | split → `quadril_esq` + `quadril_dir` | cx:42/58, cy:86 |
| `leftArm` | `braco_esq` | cx:25, cy:68 |
| `rightArm` | `braco_dir` | cx:75, cy:68 |
| `leftThigh` | `coxa_esq` | cx:39, cy:112 |
| `rightThigh` | `coxa_dir` | cx:61, cy:112 |
| `leftCalf` | `panturrilha_esq` | cx:38, cy:142 |
| `rightCalf` | `panturrilha_dir` | cx:62, cy:142 |

Since the original has 9 areas and the user spec has 9, I'll map `chest` → a new combined torso area or keep `abdomen` covering the full torso, and split `hips` into two ellipses for `quadril_esq`/`quadril_dir`. This preserves all 9 Portuguese IDs.

## Pre-requisite

Copy the two uploaded images to `public/assets/`:
- `flow_silhouette_base.png`
- `flow_silhouette_full.png`

## Changes

### 1. `src/components/FlowSilhouette.tsx` — Full rewrite

Replace the SVG-drawn silhouette with an image-based approach:
- Container: `relative mx-auto w-full max-w-[260px]`
- Base layer: `<img>` switching between `flow_silhouette_base.png` (no hydration) and `flow_silhouette_full.png` (with hydration wave)
- Overlay: transparent SVG with `viewBox="0 0 100 180"`, `absolute inset-0`
- Radial gradients in `<defs>` for 3 heat levels (leve/moderado/intenso) as specified
- 9 ellipses using Portuguese area IDs with positions from the spec
- **Preserve** `calculateFlowScore` named export
- **Preserve** legacy wrapper detecting `heatMapData` prop for Progress.tsx compatibility (legacy mode renders the image-based silhouette with mapped pain areas + score/hydration bar below)

### 2. `src/components/journey/HeatMapInteractive.tsx`

Already imports and uses `<FlowSilhouette>` — no changes needed since FlowSilhouette keeps the same props interface.

### 3. `src/pages/Profile.tsx`

Already uses `<FlowSilhouette showHydrationWave={true}>` — no changes needed.

### 4. `src/pages/Onboarding.tsx`

Already renders via HeatMapInteractive which uses FlowSilhouette — no changes needed.

## Files modified
- `public/assets/flow_silhouette_base.png` — new (uploaded image)
- `public/assets/flow_silhouette_full.png` — new (uploaded image)
- `src/components/FlowSilhouette.tsx` — full rewrite (image-based)

