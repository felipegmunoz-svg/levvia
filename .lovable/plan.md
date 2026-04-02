

# Restore MorningSlot checkbox state after refresh

## Changes

### 1. `src/components/journey/touchpoints/MorningSlot.tsx`

**Props (line 19-28):** Add `initialExerciseDone?: boolean` and `initialShotDone?: boolean` to interface and destructuring.

**State init (lines 42-43):** Change:
```tsx
const [exerciseDone, setExerciseDone] = useState(false);
const [shotDone, setShotDone] = useState(false);
```
to:
```tsx
const [exerciseDone, setExerciseDone] = useState(initialExerciseDone ?? false);
const [shotDone, setShotDone] = useState(initialShotDone ?? false);
```

**Exercise checkbox (~line 120-132):** Wrap with `{!isReviewMode && ( ... )}` to hide when slot is done, matching the shot checkbox pattern.

### 2. `src/components/journey/DayTouchpointView.tsx` (lines 343-352)

Add two props to `<MorningSlot>`:
```tsx
initialExerciseDone={isDone || !!(progress?.morning as any)?.exercise_id}
initialShotDone={isDone || !!(progress?.morning as any)?.shot_id}
```

## Files modified
- `src/components/journey/touchpoints/MorningSlot.tsx`
- `src/components/journey/DayTouchpointView.tsx`

