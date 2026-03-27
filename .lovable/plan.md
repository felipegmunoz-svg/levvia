

# Create 4 Touchpoint Slot Components

## Summary
Create 4 new components under `src/components/journey/touchpoints/` that render the content for each daily touchpoint slot. All use existing design tokens and overlay pattern for detail views.

## New Files

### 1. `src/components/journey/touchpoints/MorningSlot.tsx`
- **Props**: `dayNumber`, `affirmation`, `schedule`, `exercise` (ChallengeActivity|null), `shotRecipe` (ChallengeActivity|null), `isReviewMode`, `onComplete`
- **5 sections**: Affirmation card (sparkle + italic text), Schedule card (4 time rows with emojis), Exercise card (with "Ver Exercício" → ExerciseDetail overlay), Shot card (with "Ver Receita" → RecipeDetail overlay), Complete button
- **Local state**: `showExercise`, `showRecipe` (overlay toggles), `exerciseDone`, `shotDone` (checkboxes)
- **Overlay pattern**: `fixed inset-0 z-50 bg-background overflow-y-auto`

### 2. `src/components/journey/touchpoints/LunchSlot.tsx`
- **Props**: `dayNumber`, `recipes` (ChallengeActivity[]), `tip`, `isReviewMode`, `onComplete`
- **4 sections**: Header, selectable recipe cards (radio-style with border-primary when selected, each with RecipeDetail overlay), Dica Lavínia card (bg-primary/5), Complete button
- **Local state**: `selectedRecipeId`, `showRecipeIdx` (which recipe overlay is open)

### 3. `src/components/journey/touchpoints/AfternoonSlot.tsx`
- **Props**: `dayNumber`, `hydrationText`, `microMovement` (ChallengeActivity|null), `snackRecipe` (ChallengeActivity|null), `isReviewMode`, `onComplete`
- **4 sections**: Hydration card (with checkbox "Bebi minha água"), Micro-Movement card (ExerciseDetail overlay + checkbox), Snack card (RecipeDetail overlay), Complete button
- **Local state**: `hydrated`, `microDone`, `showExercise`, `showRecipe`

### 4. `src/components/journey/touchpoints/NightSlot.tsx`
- **Props**: `dayNumber`, `technique` (NightTechnique), `closingMessage`, `isReviewMode`, `onComplete`
- **4 sections**: Dynamic technique renderer (heatmap/breathing/food-traffic-light/text-guide/legs-elevation/meditation), DiaryReflection (only after technique done & not review), Closing message card (after diary saved or review), Complete button (after diary saved, hidden in review)
- **Local state**: `techniqueDone`, `diaryData`
- **Imports**: HeatMapInteractive, BreathingCircle, FoodTrafficLight, DiaryReflection

## Shared Patterns
- All cards: `levvia-card` class
- Buttons: `bg-primary text-primary-foreground rounded-xl`
- Text: `text-levvia-fg`, `text-levvia-muted`, `font-body`, `font-heading`
- Detail overlays: `fixed inset-0 z-50 bg-background overflow-y-auto` with ArrowLeft back button
- Exercise/Recipe passed as `ChallengeActivity` — extract `.exercise` or `.recipe` for detail components

## Files
- `src/components/journey/touchpoints/MorningSlot.tsx` — NEW
- `src/components/journey/touchpoints/LunchSlot.tsx` — NEW
- `src/components/journey/touchpoints/AfternoonSlot.tsx` — NEW
- `src/components/journey/touchpoints/NightSlot.tsx` — NEW

## Not changed
- No existing files modified

