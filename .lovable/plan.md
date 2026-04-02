

# Fix: AfternoonSlot micro-movement persistence + review mode

MorningSlot already has `initialExerciseDone`/`initialShotDone` implemented (lines 27-28, 40-41, 46-47 in MorningSlot; lines 351-352 in DayTouchpointView). Only AfternoonSlot needs fixing.

## Changes

### 1. `src/components/journey/touchpoints/AfternoonSlot.tsx`

**Interface (add after line 27):**
```tsx
initialMicroDone?: boolean;
```

**Destructuring (add after line 37):**
```tsx
initialMicroDone,
```

**State init (line 41):** Change `useState(false)` to:
```tsx
const [microDone, setMicroDone] = useState(initialMicroDone ?? false);
```

**Checkbox (lines 151-157):** Wrap with `{!isReviewMode && (...)}`:
```tsx
{!isReviewMode && (
  <div className="mt-3">
    <CheckBox
      checked={microDone}
      onChange={() => setMicroDone(!microDone)}
      label="Completei o micro-movimento"
    />
  </div>
)}
```

### 2. `src/components/journey/DayTouchpointView.tsx` (line 377)

Add prop to `<AfternoonSlot>`:
```tsx
initialMicroDone={isDone || !!(progress?.afternoon as any)?.micro_challenge_id}
```

## Files modified
- `src/components/journey/touchpoints/AfternoonSlot.tsx`
- `src/components/journey/DayTouchpointView.tsx`

