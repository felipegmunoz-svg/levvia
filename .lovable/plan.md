

# Refactor Today.tsx to Use DayTouchpointView

## Summary
Replace the cascading DayXFlow logic and old dashboard in Today.tsx with DayTouchpointView + useTouchpointProgress. Keep review mode, auth, debug bar, and paywall intact. Old DayXFlow components kept as mid-journey fallback.

## Changes in `src/pages/Today.tsx`

### New imports (add)
- `DayTouchpointView` from `@/components/journey/DayTouchpointView`
- `useTouchpointProgress` from `@/hooks/useTouchpointProgress`
- `toast` from `sonner`
- `TouchpointData` from `@/hooks/useChallengeData`

### Remove
- The 6 individual `day1Done`–`day6Done` states (lines 104-109)
- The `useEffect` that fetches `day1_completed`–`day6_completed` from Supabase (lines 143-185)
- The `branch` debug string that references dayXDone (lines 114-124)
- The loading gate that checks `day1Done === null || day2Done === null...` (lines 277-298)
- The entire cascading if/else chain for DayXFlow (lines 300-348)
- The old dashboard fallback (lines 382-589): header, progress bar, exercises/meals/habits checklists, HeatMapCard, FoodTrafficLightCard, MotorAlivio, SymptomDiary, modal, etc.
- Unused imports: `ChecklistItemCard`, `ProgressDashboard`, `SymptomDiary`, `MotorAlivio`, `HeatMapCard`, `FoodTrafficLightCard`, `PushNotificationPrompt`, `Dumbbell`, `UtensilsCrossed`, `Heart`, `X`, `Sparkles`, `BarChart3`, `logoIcon`
- Unused state/functions: `selectedExercise`, `selectedRecipe`, `showDashboard`, `modalContent`, `allActivities`, `dayProgress`, `completedCount`, `totalCount`, `progressPercent`, `handleToggle`, `getGreeting`, `handleMarkExerciseDone`, `handleMarkRecipeDone`, `getIncentiveMessage`, `toExerciseView`, `toRecipeView`

### Add new hook call
```ts
const { progress, activeSlot, isDayComplete, completedSlots, markSlotDone, loading: tpLoading } = useTouchpointProgress(replayDay ?? currentDay);
```

### Extract `todayTouchpoints` from useChallengeData
Already returned — just destructure it alongside existing values.

### Add handleSlotComplete
```ts
const handleSlotComplete = useCallback(async (slot: TouchpointSlot, data: any) => {
  await markSlotDone(slot, data);
  if (slot === 'night') {
    toast("Sua jornada continua amanhã. Descanse — você merece.");
  }
}, [markSlotDone]);
```

### New rendering logic (replaces lines 300-589)

1. **Review mode** (unchanged): if `reviewDay`, return `<DayReview />`
2. **Loading**: if `loading || tpLoading` (and not forceReady), show spinner
3. **Debug replay**: if `replayDay`, render `DayTouchpointView` with `dayNumber={replayDay}`
4. **Mid-journey fallback**: if `localStorage.getItem(\`levvia_day${currentDay}_progress\`)` exists, render the old DayXFlow for that day (import Day1Flow–Day6Flow kept for this)
5. **Paywall**: if `currentDay > 3 && !hasPremium`, render `<PaywallModal />`
6. **Main path**: render `<DayTouchpointView dayNumber={currentDay} touchpoints={todayTouchpoints} progress={progress} onSlotComplete={handleSlotComplete} />`

### Debug bar
Keep the debug bar with day replay buttons. Update the debug overlay to show `currentDay`, `completedSlots`, `activeSlot` instead of the old `day1Done`–`day6Done` values.

### Final return structure
```tsx
return (
  <>
    {isDev && <debug bar>}
    {isDebugActive() && <debug overlay>}
    <div className="theme-light levvia-page">{content}</div>
  </>
);
```

## Technical details
- `useTouchpointProgress` receives `replayDay ?? currentDay` so debug replay works
- Mid-journey fallback checks localStorage for legacy progress keys — users who started old flows can finish them
- `toast` imported from `sonner` (already in project dependencies)
- `TouchpointSlot` type imported from `@/data/touchpointConfig`

## Files changed
- `src/pages/Today.tsx` — MAJOR MODIFICATION

## Not changed
- `useChallengeData.tsx`, `useTouchpointProgress.ts`, `DayTouchpointView.tsx`, all DayXFlow components, `DayReview.tsx`

