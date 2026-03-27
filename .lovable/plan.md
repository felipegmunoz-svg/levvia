

# Fix Empty Exercise/Recipe Selection in Touchpoint Slots

## Summary
Add fallback logic to all 5 selection functions in `profileEngine.ts` so they never return empty when valid exercises/recipes exist. Also fix case-insensitive category matching.

## Changes in `src/lib/profileEngine.ts`

### 1. `selectMorningExercise` (line 862-864)
- Case-insensitive category match: `MORNING_CATEGORIES.some(cat => cat.toLowerCase() === (e.category || '').toLowerCase())`
- After line 864, add: `if (candidates.length === 0) candidates = [...filteredExercises];`

### 2. `selectShotRecipe` (line 907)
- Replace `return null` with broader fallback: filter for `lanche|bebida|snack` in `tipo_refeicao`
- If still empty, then `return null`

### 3. `selectMicroMovement` (line 943-948)
- Case-insensitive category match for `MICRO_CATEGORIES`
- After line 955, add fallback: `candidates = filteredExercises.filter(e => e.id !== excludeId);`

### 4. `selectSnackRecipe` (line 982)
- Replace `return null` with fallback: all `filteredRecipes` excluding almoço/jantar types

### 5. `selectLunchRecipes` (line 1006)
- Replace `return []` with fallback: all `filteredRecipes`

## Files changed
- `src/lib/profileEngine.ts` — 5 functions updated with fallback + case-insensitive fixes

