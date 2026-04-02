

# Fix "Por que Funciona" section not showing text

## Problem
The `ExerciseDetail` component renders `exercise.benefits`, but for DB exercises the actual explanatory text is often in `clinical_benefit` (a separate DB column), while `benefits` is null/empty. The section always renders — even when empty — showing just the title with no content.

## Changes

### 1. `src/components/ExerciseDetail.tsx` (lines 11-13, 143-149)
- Read `clinical_benefit` from the exercise object (via `as any`, same pattern already used for `video_url` and `image_urls`)
- Compute `benefitsText = exercise.benefits || (exercise as any).clinical_benefit`
- Wrap the section in a conditional: only render when `benefitsText` is truthy
- Display `benefitsText` in the paragraph

### 2. `src/pages/HistoryExercises.tsx` (line 21)
- In `toExerciseView`, map `benefits` with clinical_benefit fallback:
  ```
  benefits: ex.benefits || ex.clinical_benefit || ""
  ```

### 3. `src/components/journey/touchpoints/MorningSlot.tsx` and `AfternoonSlot.tsx`
- These pass `exercise.exercise as any` directly — the fix in ExerciseDetail reading `clinical_benefit` via `as any` covers these automatically. No changes needed.

## Files modified
- `src/components/ExerciseDetail.tsx`
- `src/pages/HistoryExercises.tsx`

