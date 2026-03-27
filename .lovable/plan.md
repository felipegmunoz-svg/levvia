

# Create Hydration Tracking System

## Summary
Add a hydration tracking hook (`useHydration`) and a visual module (`HydrationModule`) that appears in every touchpoint slot. Personalized daily goal based on body weight (35ml/kg), divided into 4 sub-goals per touchpoint, with tap buttons and persistence in challenge_progress JSONB.

## New Files

### 1. `src/hooks/useHydration.ts`
- Receives `weightKg` (number | null) and `dayNumber` (number)
- Computes `dailyGoalMl = Math.round((weightKg || 60) * 35)`, `subGoalMl = Math.round(dailyGoalMl / 4)`
- State: `currentIntakeMl` from localStorage key `levvia_hydration_day_{dayNumber}`, default 0
- `addWater(ml)`: updates state + localStorage immediately, then merges `water_intake_ml` into `challenge_progress.touchpoints.day{N}` via saveWithRetry (read-merge-write like useTouchpointProgress)
- Returns `{ dailyGoalMl, subGoalMl, currentIntakeMl, dailyPercent, addWater, slotPercent }`
- `slotPercent(slotIndex)`: computes how much of slot N's sub-goal is filled based on total intake vs slot boundaries

### 2. `src/components/journey/touchpoints/HydrationModule.tsx`
- Props: `dailyGoalMl`, `subGoalMl`, `currentIntakeMl`, `dailyPercent`, `slotSubGoalMl`, `slotLabel`, `hydrationText`, `onAddWater`, `isReviewMode`
- Layout (levvia-card p-5):
  - Header: "💧 Hidratação" + badge showing `{currentIntakeMl}ml / {dailyGoalMl}ml`
  - Progress bar (h-3 rounded-full) with 4 tick marks labeled M A T N
  - Motivational text from config + "Meta deste momento: {slotSubGoalMl}ml"
  - Two tap buttons (+250ml, +500ml) with brief green check animation (framer-motion)
  - Goal-reached celebration when dailyPercent >= 1.0
  - Review mode: bar + value only, no buttons

## Modified Files

### `src/data/touchpointConfig.ts`
- Add `hydrationTexts` field to `DayTouchpointConfig`: `{ morning: string, lunch: string, afternoon: string, night: string }`
- Use `{meta}` placeholder in text strings, replaced at render time with actual subGoalMl
- Fill days 1-6 with unique motivational texts; days 7-14 use generic placeholder texts
- Add `afternoonKnowledgePill` string field to each day config

### `src/components/journey/DayTouchpointView.tsx`
- Add `hydration` prop: `{ dailyGoalMl, subGoalMl, currentIntakeMl, dailyPercent, addWater }`
- Pass hydration data + appropriate `slotLabel` and `hydrationText` (from config) to each slot component

### `src/components/journey/touchpoints/MorningSlot.tsx`
- Add hydration-related props; render `<HydrationModule>` between Shot section and Complete button with `slotLabel="da manhã"`

### `src/components/journey/touchpoints/LunchSlot.tsx`
- Add hydration props; render `<HydrationModule>` between Dica and Complete button with `slotLabel="do almoço"`

### `src/components/journey/touchpoints/AfternoonSlot.tsx`
- Add hydration props; render `<HydrationModule>` between Snack section and Complete button with `slotLabel="da tarde"`
- Replace the old simple hydration checkbox with HydrationModule

### `src/components/journey/touchpoints/NightSlot.tsx`
- Add hydration props; render `<HydrationModule>` before the technique section with `slotLabel="da noite"`

### `src/pages/Today.tsx`
- Import and call `useHydration(profile?.weightKg, effectiveDay)`
- Pass hydration return values to `DayTouchpointView` as `hydration` prop

## Technical Details
- Persistence: localStorage as immediate cache (`levvia_hydration_day_{N}`), Supabase via saveWithRetry merging into `challenge_progress.touchpoints.day{N}.water_intake_ml`
- Default weight fallback: 60kg if profile.weightKg is null
- `{meta}` placeholder replacement happens in DayTouchpointView when passing hydrationText to slots

## Files
- `src/hooks/useHydration.ts` — NEW
- `src/components/journey/touchpoints/HydrationModule.tsx` — NEW
- `src/data/touchpointConfig.ts` — ADD hydrationTexts + afternoonKnowledgePill fields
- `src/components/journey/DayTouchpointView.tsx` — ADD hydration prop pass-through
- `src/components/journey/touchpoints/MorningSlot.tsx` — ADD HydrationModule
- `src/components/journey/touchpoints/LunchSlot.tsx` — ADD HydrationModule
- `src/components/journey/touchpoints/AfternoonSlot.tsx` — REPLACE old checkbox with HydrationModule
- `src/components/journey/touchpoints/NightSlot.tsx` — ADD HydrationModule
- `src/pages/Today.tsx` — ADD useHydration + pass to DayTouchpointView

