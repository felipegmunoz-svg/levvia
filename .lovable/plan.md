

# Fix: Onboarding Data Not Persisting to Database

## Root Cause

Two compounding issues:

1. **Stale closure in `handleMultiSelect`** (Onboarding.tsx line 135): Uses `setAnswers({ ...answers, ... })` instead of functional form. If React batches updates or the user interacts rapidly, previous step data can be silently lost from the `answers` object.

2. **Backup keys treated as fallback** (Auth.tsx `readOnboardingSnapshot`): The backup localStorage keys (`levvia_pantry_items`, `levvia_objectives`, `levvia_restrictions`) are only read when `levvia_onboarding` has empty/missing data. But `levvia_onboarding` might EXIST with stale/incomplete data, causing the backups to be skipped.

## Changes

### File 1: `src/pages/Onboarding.tsx`

**A. Fix `handleMultiSelect` (line 135)** — use functional state updater to prevent stale closures:
```typescript
const handleMultiSelect = (option: string) => {
  const prev = (answers[current.id] as string[]) || [];
  const isDeselecting = prev.includes(option);
  if (!isDeselecting && current.id === 16 && prev.length >= 3) return;
  const updated = isDeselecting
    ? prev.filter((o) => o !== option)
    : [...prev, option];
  
  setAnswers((a) => ({ ...a, [current.id]: updated }));
  
  // Immediate backup for critical steps
  if (current.id === 13) localStorage.setItem("levvia_restrictions", JSON.stringify(updated));
  if (current.id === 16) localStorage.setItem("levvia_objectives", JSON.stringify(updated));
};
```

**B. Fix `handleSelectMostPantry` (line 280-284)** — also use functional updater + immediate backup:
```typescript
const handleSelectMostPantry = () => {
  const count = Math.ceil(allFilteredPantryItems.length * 0.75);
  const selected = allFilteredPantryItems.slice(0, count);
  setAnswers((a) => ({ ...a, [current.id]: selected }));
  localStorage.setItem("levvia_pantry_items", JSON.stringify(selected));
};
```

### File 2: `src/pages/Auth.tsx`

**Flip priority in `readOnboardingSnapshot`** — always prefer backup keys over parsed JSON answers. The backups are written synchronously at interaction time (more reliable), while the JSON might have stale data:

```typescript
// Resolve pantry: PREFER backup over answers
let pantryItems: string[] = [];
if (pantryBackup) {
  try { pantryItems = JSON.parse(pantryBackup); } catch {}
}
if ((!pantryItems || pantryItems.length === 0) && answers[15]) {
  pantryItems = (answers[15] as string[]) || [];
}

// Same pattern for objectives and restrictions
```

### File 3: Enhanced logging in both files

Add debug logs at critical points to trace data flow in future issues.

## Summary

- 2 files changed: `Onboarding.tsx`, `Auth.tsx`
- Core fix: functional state updates + backup-first reads
- No database changes needed

