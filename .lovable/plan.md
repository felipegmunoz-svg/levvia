

# Fix TypeError crash in DayTouchpointView.tsx

## Change

In `src/components/journey/DayTouchpointView.tsx`, replace lines 113–123 with optional chaining on all `progress` accesses:

```typescript
const activeSlot = useMemo<TouchpointSlot | null>(() => {
  if (!progress?.morning?.done) return "morning";
  if (!progress?.lunch?.done) return "lunch";
  if (!progress?.afternoon?.done) return "afternoon";
  if (!progress?.night?.done) return "night";
  return null;
}, [progress]);

const completedSlots = useMemo(() => {
  return SLOTS.filter((s) => progress?.[s.slot]?.done === true).length;
}, [progress]);
```

## Files modified
- `src/components/journey/DayTouchpointView.tsx` (lines 113–123)

