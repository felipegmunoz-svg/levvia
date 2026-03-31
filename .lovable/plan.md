

# Fix TypeError crash on /today

## Changes

### 1. `src/components/journey/DayTouchpointView.tsx` (line 74)
Add optional chaining to prevent crash when a slot is undefined:
```typescript
return SLOT_ORDER.slice(0, idx).every((s) => progress[s]?.done === true);
```

### 2. `src/hooks/useTouchpointProgress.ts`

**loadLocal** (lines 42-43): Normalize parsed data to guarantee all 4 slots exist:
```typescript
const parsed = JSON.parse(raw);
return {
  morning: parsed.morning ?? { done: false, doneAt: null },
  lunch: parsed.lunch ?? { done: false, doneAt: null },
  afternoon: parsed.afternoon ?? { done: false, doneAt: null },
  night: parsed.night ?? { done: false, doneAt: null },
};
```

**mergeProgress** (lines 70-71): Add fallback for undefined slots:
```typescript
const l = local[slot] ?? { done: false, doneAt: null };
const r = remote[slot] ?? { done: false, doneAt: null };
```

## Files modified
- `src/components/journey/DayTouchpointView.tsx`
- `src/hooks/useTouchpointProgress.ts`

