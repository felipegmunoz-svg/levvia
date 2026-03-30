
# Fix hydration system: Supabase restore + heat map card hydration

## Changes

### 1. `src/hooks/useHydration.ts` (after line 39)
Add a new `useEffect` that restores hydration from Supabase when localStorage is empty (currentIntakeMl === 0). Reads `challenge_progress.touchpoints.day{N}.water_intake_ml` and syncs back to localStorage.

### 2. `src/components/journey/DayTouchpointView.tsx` (line 136)
In the "Seu Fogo Interno" card, replace `waterIntakeMl={0} waterGoalMl={1}` with `waterIntakeMl={hydration?.currentIntakeMl ?? 0} waterGoalMl={hydration?.dailyGoalMl ?? 2000}` so the miniature silhouette reflects actual hydration progress.

## Files modified
- `src/hooks/useHydration.ts`
- `src/components/journey/DayTouchpointView.tsx`
