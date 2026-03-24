

## Diagnose: Why Day 5 Doesn't Show After Completing Day 4

### Root Cause

The `currentDay` value in `useChallengeData.tsx` is **time-based**, not completion-based:

```text
currentDay = Math.floor((Date.now() - challenge_start) / 86400000) + 1
```

This means if `challenge_start` was set 3.5 days ago, `currentDay = 4` — regardless of how many days you've completed. Day 5 gate checks `currentDay >= 5`, which won't be true until a full calendar day passes.

So even after clicking "Salvar Progresso" on Day 4, the code falls through all gates (day1Done=true, day2Done=true, ... day4Done=true, day5Done=false but `currentDay < 5`) and renders the regular dashboard instead of Day5Flow.

### Secondary Issue

The query on line 113 fetches `day4_completed_at` but **doesn't fetch `day5_completed_at`** — not a blocker now but will be needed for Day 6.

### Fix Plan

**File: `src/pages/Today.tsx`**

Change the Day 5 gate condition from time-based to completion-based. Instead of requiring `currentDay >= 5`, check that Day 4 is done (which it is). The 24h gate already handles timing:

```
// Current (broken):
if (day5Done === false && currentDay >= 5 && hasPremium)

// Fixed:
if (day5Done === false && day4Done === true && hasPremium)
```

Apply the same fix to all day gates for consistency:
- Day 2: `day2Done === false && day1Done === true` (instead of `currentDay >= 2`)
- Day 3: `day3Done === false && day2Done === true` (instead of `currentDay >= 3`)
- Day 4: `day4Done === false && day3Done === true && hasPremium` (instead of `currentDay >= 4`)
- Day 5: `day5Done === false && day4Done === true && hasPremium` (instead of `currentDay >= 5`)
- Premium gate: `day3Done === true && day4Done === false && !hasPremium` (instead of `currentDay >= 4`)

This way, completing Day 4 immediately unlocks Day 5 (subject to 24h gate), without waiting for the calendar to tick over.

Also add `day5_completed_at` to the select query (line 113) and store it for future Day 6 gate.

### Files Modified: 1
- `src/pages/Today.tsx` — Fix gate conditions from time-based to completion-based, add `day5_completed_at` to query

