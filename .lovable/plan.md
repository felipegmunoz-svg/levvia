

# Integrate FlowSilhouette into Progress Page

## Summary
Replace the static donut chart with the FlowSilhouette component showing real heat map data and hydration progress. Add dynamic evolution bars and a hydration summary card.

## Changes in `src/pages/Progress.tsx`

### Imports
- Add: `FlowSilhouette`, `calculateFlowScore` from `@/components/FlowSilhouette`
- Add: `useHydration` from `@/hooks/useHydration`
- Add: `useProfile` from `@/hooks/useProfile`
- Add: `useAuth` from `@/hooks/useAuth`
- Add: `useState`, `useEffect`, `useMemo` from React
- Add: `supabase` from `@/integrations/supabase/client`
- Remove: `ProgressCircle` import

### Data fetching
- Use `useProfile()` to get `profile` (contains `heatMapDay1`, `weightKg`)
- Use `useAuth()` to get `user`
- Fetch `challenge_progress` from profiles table to check for Day 7+ heat map data stored in `challenge_progress.touchpoints.day7.night`
- Derive `currentHeatMap`: use Day 7 data if available, else fall back to `profile.heatMapDay1`
- Compute current day number from `profile` challenge_start (or default to 1)
- Call `useHydration(profile.weightKg, dayNumber)` to get `currentIntakeMl`, `dailyGoalMl`

### Replace donut chart section (lines 40-76)
Replace the `ProgressCircle`-based card with:
- `FlowSilhouette` component with `heatMapData={currentHeatMap}`, `waterIntakeMl={currentIntakeMl}`, `waterGoalMl={dailyGoalMl}`, `size="large"`, `animated={true}`
- Below it, score context label using `calculateFlowScore`:
  - 0-40: "🔥 Fogo Ativo" (red)
  - 41-70: "🌊 Em Transição" (yellow)  
  - 71-100: "💧 Fluxo Ativo" (teal)
- Updated legend with new labels

### Update evolution bars (lines 78-111)
- Replace hardcoded `evoData` with dynamic data computed from `challenge_progress` if available
- Color logic per bar: score > 70 → teal (`#2EC4B6`), 41-70 → yellow (`#F59E0B`), 0-40 → red (`#EF4444`)
- Fall back to static placeholder data if no real progress data exists yet

### Add hydration summary card (new section after evolution)
- `levvia-card p-5` with "💧 Hidratação Hoje" header
- Progress bar showing `currentIntakeMl / dailyGoalMl`
- If `currentIntakeMl >= dailyGoalMl`, show "Meta atingida! 🎉" badge

### Preserved
- Header with logo, title, subtitle
- `theme-light levvia-page` wrapper
- `BottomNav` at bottom
- `pb-24` spacing

## Files changed
- `src/pages/Progress.tsx` — MAJOR MODIFICATION

