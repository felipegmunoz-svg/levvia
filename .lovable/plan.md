

# Add Lightness Scale & Rescue Mode System

## Summary
Add a 1-10 "Escala de Leveza" to DiaryReflection, create a rescue mode hook that evaluates checkpoint days, and thread it through the touchpoint architecture.

## Changes

### 1. `src/components/journey/DiaryReflection.tsx` — MODIFY
- Add `lightnessScore: number | null` to `DiaryData` interface
- Add state `lightnessScore` (null default)
- Insert new section between leg sensation dropdown and energy level:
  - Header "Escala de Leveza" + subtitle "1 = Muito pesada/dor | 10 = Leveza total"
  - Row of 10 buttons (w-8 h-8 rounded-full): 1-3 red, 4-5 orange, 6-7 yellow, 8-10 teal when selected
- Make save button require `lightnessScore !== null` instead of requiring `legSensation`
- Include `lightnessScore` in onSave data

### 2. `src/hooks/useRescueMode.ts` — NEW
- Checkpoint days: `[3, 6, 7, 10, 14]`
- State: `rescueMode` ("resgate" | "consagracao" | "neutral"), loaded from localStorage `levvia_rescue_mode`, synced from Supabase `challenge_progress.rescue_mode`
- `evaluateCheckpoint(dayNumber, lightnessScore)`: if checkpoint day, score < 5 → "resgate", score >= 7 → "consagracao", else keep current. Saves to localStorage + Supabase via saveWithRetry
- `isCheckpointDay(dayNumber)`: returns boolean
- Returns `{ rescueMode, evaluateCheckpoint, isCheckpointDay }`

### 3. `src/pages/Today.tsx` — MODIFY
- Import and call `useRescueMode()`
- In `handleSlotComplete`, after `markSlotDone` for night slot: call `evaluateCheckpoint(currentDay, data.journal?.lightnessScore)` if score exists
- Pass `rescueMode` to `DayTouchpointView`

### 4. `src/components/journey/DayTouchpointView.tsx` — MODIFY
- Add `rescueMode?: string` prop to interface
- Thread it to slot components (for future V2-5 use)

### 5. `src/components/journey/touchpoints/NightSlot.tsx` — MODIFY
- Accept `isCheckpointDay?: boolean` prop
- After diary saved and before closing message, if `isCheckpointDay` and `diaryData?.lightnessScore`:
  - Score < 5: show empathy card ("Entendemos que o caminho está difícil...")
  - Score >= 7: show celebration card ("Que alegria ver seu progresso!")
- `lightnessScore` is already in `DiaryData` from step 1, so it flows through `onComplete` automatically

## Files
- `src/components/journey/DiaryReflection.tsx` — MODIFY
- `src/hooks/useRescueMode.ts` — NEW
- `src/pages/Today.tsx` — MODIFY
- `src/components/journey/DayTouchpointView.tsx` — MODIFY
- `src/components/journey/touchpoints/NightSlot.tsx` — MODIFY

