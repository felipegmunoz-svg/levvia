

# FlowSilhouette: Full replacement + caller updates

## 1. Replace `src/components/FlowSilhouette.tsx` entirely

Overwrite with the user's exact code: pure SVG body path approach (`BODY_PATH`), `ZONES` array, `HEAT_COLORS`, hydration wave clipped to body, glassmorphism fill. No PNG images. Single interface with `heatMapData`, `waterIntakeMl`, `waterGoalMl`, `size`, `animated`, `onZoneClick`, `interactive`.

## 2. Update `src/pages/Profile.tsx` — two call sites

**Lines 396–407** (first occurrence):
```tsx
<FlowSilhouette
  heatMapData={(() => {
    const hm = (profile as any).heatMapDay1;
    if (!hm || typeof hm !== "object") return {};
    const mapped: Record<string, number> = {};
    for (const [k, v] of Object.entries(hm)) {
      mapped[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0));
    }
    return mapped;
  })()}
  waterIntakeMl={profile?.water_intake_ml ?? 0}
  waterGoalMl={profile?.water_goal_ml ?? 2000}
  interactive={false}
/>
```

**Lines 494–505** (second occurrence): same transformation.

Changes: `painAreas` → `heatMapData`, remove `showHydrationWave`, add `waterIntakeMl`/`waterGoalMl`/`interactive`.

## 3. Update `src/components/journey/HeatMapInteractive.tsx` — lines 129–133

```tsx
<FlowSilhouette
  heatMapData={areas as Record<string, number>}
  interactive={!readOnly}
  onZoneClick={(zone, level) => setAreas(prev => ({ ...prev, [zone]: level }))}
  waterIntakeMl={0}
  waterGoalMl={1}
/>
```

Remove `painAreas`, `onAreaClick`, `showHydrationWave`. The internal `toggleArea` function becomes unnecessary for the FlowSilhouette call since the new component handles cycling internally via `onZoneClick(zone, newLevel)`.

## 4. No other files affected

`Progress.tsx` already uses the new interface (`heatMapData`, `waterIntakeMl`, `waterGoalMl`).

## Files modified
- `src/components/FlowSilhouette.tsx` — full replacement
- `src/pages/Profile.tsx` — 2 call sites updated
- `src/components/journey/HeatMapInteractive.tsx` — 1 call site updated

