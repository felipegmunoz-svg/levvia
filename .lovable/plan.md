

# Install Packages and Create useCelebrationData Hook

## Summary
Install `jspdf` and `jspdf-autotable` npm packages, and create a new hook file that aggregates 14-day challenge data from the user's profile for a celebration/summary screen.

## Changes

### 1. Install npm packages
- `jspdf`
- `jspdf-autotable`

### 2. Create `src/hooks/useCelebrationData.ts` (NEW)
- Hook that reads `challenge_progress` from the `profiles` table
- Iterates over 14 days of touchpoint data to compute:
  - Total water intake (liters)
  - Total movement minutes (morning × 15 + afternoon × 5)
  - Lightness scores per day
  - Day 1 vs Day 14 score comparison
  - Day 1 heat map data
  - Per-day history (score, notes, water, night completion)
- Returns `CelebrationData` interface with loading state
- Exact content as specified by user

## Files
- `src/hooks/useCelebrationData.ts` — NEW
- `package.json` — ADD jspdf, jspdf-autotable

