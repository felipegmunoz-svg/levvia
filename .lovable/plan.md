

# Fix Case-Sensitive tipo_refeicao Match in selectDay1Recipe

## Summary
Most selection functions already use case-insensitive regex (`/i` flag) for `tipo_refeicao` matching. The only case-sensitive match is on **line 826** in `selectDay1Recipe`, which uses `.includes(mealType)`. Fix this one line.

## Changes in `src/lib/profileEngine.ts`

**Line 826** — Replace `.includes(mealType)` with case-insensitive regex match:

```ts
// Before
selected = top5.find(r => r.tipo_refeicao?.includes(mealType)) || withFinal[0];

// After
selected = top5.find(r => r.tipo_refeicao?.some(t => t.toLowerCase() === mealType.toLowerCase())) || withFinal[0];
```

### No other changes needed
- `selectShotRecipe` (line 933): already uses `/bebida/i` regex
- `selectSnackRecipe` (line 1043): already uses `/lanche/i` regex  
- `selectLunchRecipes` (line 1078): already uses `/almo[çc]o/i` regex
- `selectMorningExercise` / `selectMicroMovement`: filter exercises by category, not tipo_refeicao

## Files changed
- `src/lib/profileEngine.ts` — 1 line

