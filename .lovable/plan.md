

# New DayReview Component — Replace Broken Review Mode

## Problem
The review mode using `isReviewMode` prop on Day1-6 Flow components doesn't work reliably. Multiple attempts to fix it have failed.

## Solution
Create a standalone `DayReview.tsx` component that renders review content independently, with no dependency on the Day1-6 Flow components. Replace the review block in `Today.tsx` to use this new component.

## Changes

### 1. Create `src/components/journey/DayReview.tsx`
- Standalone component that reads `?review=N` from URL
- Fetches profile data from database (heat_map_day1, day2_inflammation_map, day4_sleep_data, day5_movement_data, day6_spice_data)
- Renders day-specific saved data in read-only cards
- White background (`#FAFBFC`), blue logo centered, vertical scroll
- "Voltar para Jornada" button at bottom
- Day titles and icons for days 1-6
- Loading state while fetching

### 2. Modify `src/pages/Today.tsx`
- Import `DayReview`
- Replace lines 282-291 (the current review block that uses Day1-6 Flows with `isReviewMode`) with:
```tsx
if (reviewDay) {
  return <DayReview />;
}
```
- Remove unused Day flow imports if they're only used for review (they're still used for normal flow, so keep them)

## Why This Works
- Zero dependency on Day1-6 Flow internal logic
- No `isReviewMode` prop threading needed
- Simple data fetch + read-only render
- Guaranteed white background and read-only behavior

