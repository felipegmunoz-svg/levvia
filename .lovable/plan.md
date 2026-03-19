

# Fix: HeatMap → Onboarding redirect

## Problem
In `Day1Flow.tsx`, `handleHeatMapDone` has an early-exit path: if `levvia_day1_local_completed` and `levvia_day1_diary` exist in localStorage (set during public `/day1-journey`), it syncs the diary to the database and calls `onComplete()`, **completely exiting Day1Flow** — skipping the onboarding check.

Additionally, when `levvia_onboarded` is already `"true"` (from public onboarding), the function jumps to `setStep(4)` (MealSuggestion) instead of verifying onboarding was done.

## Root Cause
The local diary sync block (lines 93-121 of `handleHeatMapDone`) runs BEFORE the onboarding check and can call `onComplete()` prematurely.

## Fix — `src/components/journey/Day1Flow.tsx`

### Change `handleHeatMapDone`:
1. Save heatmap to Supabase (keep as-is)
2. **Move the local diary sync to AFTER the onboarding check** — do NOT let it short-circuit the flow
3. If `levvia_onboarded !== "true"` → `navigate("/onboarding")` (this is the primary fix)
4. If onboarding is done → check for local diary sync, then proceed to step 4

```text
handleHeatMapDone flow (FIXED):
  Save heatmap → Check onboarding done?
    NO  → navigate("/onboarding")
    YES → Sync local diary if exists → setStep(4)
```

### Also verify:
- `handleMultiSelect` in `Onboarding.tsx` references `current.id === 16` for objectives limit (was 13, should now be 16 after reorder) — confirm it's correct
- No other component navigates away from the HeatMap independently

## Files changed
- `src/components/journey/Day1Flow.tsx` — reorder logic in `handleHeatMapDone`

