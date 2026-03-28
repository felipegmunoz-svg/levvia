

# Rewrite FlowSilhouette + Integrate into Onboarding, Profile & HeatMapInteractive

## Important Compatibility Issue

`FlowSilhouette` is currently imported in `src/pages/Progress.tsx` (line 3) with the **old** props (`heatMapData`, `waterIntakeMl`, `waterGoalMl`, `size`, `animated`). Rewriting the interface will break Progress.tsx. Since you said "Não alterar nenhum outro arquivo", I have two options:

- **Option A**: Keep a backward-compatible wrapper or adapter inside FlowSilhouette.tsx that maps old props to new ones (keeps Progress.tsx working without editing it).
- **Option B**: Also update Progress.tsx to use the new props (adds 1 extra file).

I'll go with **Option A** — export both the new component and a legacy wrapper, so Progress.tsx continues working. The `calculateFlowScore` export also needs to remain.

## Changes

### 1. `src/components/FlowSilhouette.tsx` — Full rewrite

**New interface** as specified: `painAreas`, `onAreaClick`, `hydrationLevel`, `showHydrationWave`, `className`.

**SVG structure** (viewBox `0 0 280 520`):
- Glassmorphism container with `backdrop-blur-md bg-white/10 border-white/20 rounded-3xl`
- Same 9 body areas from current silhouette, scaled to new viewBox
- Decorative parts (head, neck, hands, feet) with `fill="rgba(255,255,255,0.85)"`, `stroke="rgba(255,255,255,0.4)"`, `strokeWidth={1}`
- Drop-shadow filter on the SVG element

**Pain colors** as specified (FBBF24, F59E0B, EF4444 with respective opacities). Each area path gets `blur(6px)` filter when intensity > 0.

**Hydration wave** (framer-motion): When `showHydrationWave === true`, render an animated `motion.path` that oscillates vertically. Y position calculated from `hydrationLevel` (0=bottom at ~480, 100=top at ~60).

**Legacy wrapper**: Keep `export default FlowSilhouette` as the new component. Add a named export `LegacyFlowSilhouette` that maps old props to new ones, plus re-export `calculateFlowScore`. Progress.tsx import stays working via a default export change — actually, Progress.tsx imports both `FlowSilhouette` (default) and `calculateFlowScore` (named). I'll keep `calculateFlowScore` as-is and make the default export accept old props via overloaded detection (check if `heatMapData` exists in props → use legacy mode). This avoids touching Progress.tsx.

### 2. `src/pages/Onboarding.tsx` — Line ~400

Replace `<HeatMapInteractive onNext={...} />` with `<FlowSilhouette>` usage. But the onboarding heat_map step needs interactive click + submit button. FlowSilhouette alone doesn't have a submit button. I'll wrap it: use FlowSilhouette with `onAreaClick` for toggling, plus the existing submit button logic inline in Onboarding.tsx.

### 3. `src/pages/Profile.tsx`

Add FlowSilhouette with `showHydrationWave={true}` and `hydrationLevel` from profile/hydration data. Need to find where to place it — likely in the stats section.

### 4. `src/components/journey/HeatMapInteractive.tsx`

Replace the internal SVG with `<FlowSilhouette>`, passing through `painAreas`, `onAreaClick`, and `showHydrationWave={showHydrationAura}`. Keep all the surrounding UI (title, instructions, legend, submit button).

## File-level summary

| File | Change |
|------|--------|
| `src/components/FlowSilhouette.tsx` | Full rewrite with new props + legacy compatibility |
| `src/pages/Onboarding.tsx` | Replace HeatMapInteractive with FlowSilhouette in heat_map step |
| `src/pages/Profile.tsx` | Add FlowSilhouette with hydration wave |
| `src/components/journey/HeatMapInteractive.tsx` | Replace internal SVG with FlowSilhouette |

