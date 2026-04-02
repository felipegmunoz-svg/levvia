

# Implement "Trocar receita" in LunchSlot

## Changes

### 1. `src/hooks/useTouchpointProgress.ts`
- Add `resetSlot` callback (after `markSlotDone`, ~line 199) that resets a slot to `{ done: false, doneAt: null }`, persists to localStorage and Supabase
- Export `resetSlot` in the return object (line 218)

### 2. `src/components/journey/DayTouchpointView.tsx`
- Add `onResetSlot` prop to `DayTouchpointViewProps` (line 32)
- Pass `onReset={() => onResetSlot?.("lunch")}` to `LunchSlot` (line 356)

### 3. `src/components/journey/touchpoints/LunchSlot.tsx`
- Add `onReset?: () => void` to `LunchSlotProps`
- When `isAlreadyCompleted` and recipe is the completed one: show "Receita preparada" badge + "Trocar receita" underline button that calls `setSelectedRecipeId(null); onReset?.()`
- Non-selected recipe cards when completed: clickable to open RecipeDetail for reading (with `onMarkDone={undefined}`)

### 4. Caller of `DayTouchpointView` (Today.tsx or DayTemplate.tsx)
- Pass `resetSlot` from the hook as `onResetSlot` prop

## Files modified
- `src/hooks/useTouchpointProgress.ts`
- `src/components/journey/DayTouchpointView.tsx`
- `src/components/journey/touchpoints/LunchSlot.tsx`
- Caller component that uses `useTouchpointProgress` + `DayTouchpointView`

