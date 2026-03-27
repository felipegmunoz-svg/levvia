

# Fix Dietary Filtering — Use diet_profile Instead of tags

## Summary
Update `filterRecipesForProfile` in `profileEngine.ts` to use `diet_profile` and `allergen_free` fields instead of `tags` for dietary filtering. Also harden fallbacks in selection functions to never bypass dietary restrictions.

## Changes in `src/lib/profileEngine.ts`

### 1. Fix dietary filters in `filterRecipesForProfile` (lines 387-397)

Replace tag-based checks with `diet_profile` and `allergen_free` field lookups:

- **Vegano** (line 387-388): Check `r.diet_profile` array for "vegana"/"vegano" (case-insensitive)
- **Vegetariano** (line 389-391): Check `r.diet_profile` for "vegetariana"/"vegetariano"/"vegana"/"vegano"
- **Sem Glúten** (line 392-393): Check `r.allergen_free` for gluten-free variants + fallback to tags
- **Sem Lactose** (line 395-396): Check `r.allergen_free` for lactose-free variants + fallback to tags

All checks use `.map(x => x.toLowerCase())` for case-insensitive matching with null-safe `|| []` guards.

### 2. Harden fallbacks to preserve dietary restrictions

Three functions have fallbacks that could bypass dietary filters by falling back to `filteredRecipes` (which is already diet-filtered) — these are actually safe. But the key change:

- **`selectLunchRecipes`** (line 1082): The fallback `candidates = [...filteredRecipes]` already uses the diet-filtered list, so this is safe. No change needed here.
- **`selectShotRecipe`** (line 927-931): Fallback uses `filteredRecipes` — already safe.
- **`selectSnackRecipe`** (line 1035-1040): Fallback uses `filteredRecipes` — already safe.

All three functions receive `filteredRecipes` which is the output of `filterRecipesForProfile`, so dietary restrictions are already preserved in fallbacks. No fallback changes needed.

### 3. Also update `mealPlan.ts` (lines 31-47)

The same tag-based filtering exists in `src/data/mealPlan.ts` `filterByRestrictions` function. Update it to also check `diet_profile` and `allergen_free` with the same pattern, since local recipe data may have these fields populated.

## Files changed
- `src/lib/profileEngine.ts` — Fix lines 387-397 (dietary filter logic)
- `src/data/mealPlan.ts` — Mirror the same fix in `filterByRestrictions`

