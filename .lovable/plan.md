

# Fix: Recipe completion not saving progress

## Problem
When clicking "Preparei esta refeição! ✨" in RecipeDetail, `onMarkDone` only updates local state but never calls `onComplete`, so `markSlotDone` is never triggered and progress is never persisted.

## Changes

### 1. `src/components/journey/touchpoints/LunchSlot.tsx` (lines 49-52)
Add `onComplete` call:
```tsx
onMarkDone={completedRecipeId === recipes[showRecipeIdx].id ? undefined : () => {
  setSelectedRecipeId(recipes[showRecipeIdx].id);
  setShowRecipeIdx(null);
  onComplete({ recipe_choice_id: recipes[showRecipeIdx].id });
}}
```

### 2. `src/components/journey/touchpoints/MorningSlot.tsx` (lines 69-72)
Add `onComplete` call for shot recipe:
```tsx
onMarkDone={isShotCompleted ? undefined : () => {
  setShotDone(true);
  setShowRecipe(false);
  onComplete({ exercise_id: exercise?.id, shot_id: shotRecipe.id });
}}
```

### 3. `src/components/journey/touchpoints/AfternoonSlot.tsx` (lines 70-71)
Currently `onMarkDone` is always `undefined` — fix to actually handle completion:
```tsx
onMarkDone={isSnackCompleted ? undefined : () => {
  setShowRecipe(false);
  onComplete({ hydration: true, snack_id: snackRecipe.id });
}}
```

## Files modified
- `src/components/journey/touchpoints/LunchSlot.tsx`
- `src/components/journey/touchpoints/MorningSlot.tsx`
- `src/components/journey/touchpoints/AfternoonSlot.tsx`

