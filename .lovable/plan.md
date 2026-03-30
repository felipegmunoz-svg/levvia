

# Update dietary filtering in profileEngine.ts

## Summary
Replace the dietary restrictions filter block (lines 389–432) in `filterRecipesForProfile` with updated logic that uses `.includes()` substring matching on `diet_profile`, `allergen_free`, and `tags` arrays instead of exact string equality. Also adds the soja/soy ingredient filter.

## Changes — `src/lib/profileEngine.ts` (lines 389–432)

Replace the block from `// Dietary restrictions` through the oleaginosas filter (and add soja after) with the user's exact code:

- **Vegan/Vegetarian**: now uses `dp.some(d => d.includes("vegan"))` + `tags.some(t => t.includes("vegan"))` instead of `dp.includes("vegana")`
- **Gluten**: uses `af.some(a => a.includes("glut"))` + tags check instead of exact `af.includes("gluten")`
- **Lactose**: uses `af.some(a => a.includes("lactos"))` + tags check instead of exact matches
- **Frutos do mar, amendoim, oleaginosas**: unchanged logic
- **Soja/soy**: already present, kept as-is

No other lines in the file are modified.

## Files modified
- `src/lib/profileEngine.ts`

