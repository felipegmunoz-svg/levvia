

# Fix recipe completion feedback across slots

## Problem
1. **RecipeDetail button** doesn't change state after completing — always shows "Preparei esta refeição! ✨"
2. **LunchSlot** doesn't read `recipe_choice_id` from progress to pre-select the completed recipe
3. **Card headers** on /today don't show which recipe was completed

## Approach

The `recipe_choice_id` is already persisted in the slot progress object (via `...meta` spread in `markSlotDone`). The fix is about reading it back.

## Changes

### 1. `src/components/journey/touchpoints/LunchSlot.tsx`
- Add `completedRecipeId?: string` prop (read from `progress[slot].recipe_choice_id`)
- Initialize `selectedRecipeId` state with `completedRecipeId` if present
- When `completedRecipeId` is set: show "Concluir Almoço" button as disabled with text "Refeição concluída ✓" and muted styling
- In RecipeDetail overlay: if `recipe.id === completedRecipeId`, pass no `onMarkDone` (hides the button) or show disabled "Receita concluída ✓"

### 2. `src/components/RecipeDetail.tsx`
- Add optional `isCompleted?: boolean` prop
- When `isCompleted` is true, show button as disabled with text "Receita concluída ✓" and green/muted styling instead of "Preparei esta refeição! ✨"

### 3. `src/components/journey/DayTouchpointView.tsx`
- **Pass `completedRecipeId` to LunchSlot**: read `(progress?.lunch as any)?.recipe_choice_id` and pass it
- **Card header feedback**: When a slot is done and has `recipe_choice_id`, show the recipe label under the slot title. Find the recipe label from `touchpoints.lunch.recipes` by matching ID.
- Apply same pattern generically: for any slot that has `recipe_choice_id`, `snack_id`, or `shot_id` in progress, show "✓ {recipe_label}" under the slot label in the card header.

### 4. `src/components/journey/touchpoints/MorningSlot.tsx`
- Add `completedShotId?: string` prop
- Pass `isCompleted` to RecipeDetail when showing the shot recipe

### 5. `src/components/journey/touchpoints/AfternoonSlot.tsx`
- Add `completedSnackId?: string` prop
- Pass `isCompleted` to RecipeDetail when showing the snack recipe

## Technical detail

The slot progress object already stores `recipe_choice_id`, `snack_id`, `shot_id` at the root level (e.g. `progress.lunch.recipe_choice_id`). We just need to read these values back and pass them down as props.

For the card header recipe label lookup, we match the stored ID against the recipes/activities in `touchpoints` to find the human-readable title.

## Files modified
- `src/components/RecipeDetail.tsx`
- `src/components/journey/touchpoints/LunchSlot.tsx`
- `src/components/journey/touchpoints/MorningSlot.tsx`
- `src/components/journey/touchpoints/AfternoonSlot.tsx`
- `src/components/journey/DayTouchpointView.tsx`

