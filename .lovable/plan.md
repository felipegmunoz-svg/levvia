

# Adapt Data Engine for 4-Touchpoint Architecture

## Summary
Add 5 new selection functions to `profileEngine.ts` and a `todayTouchpoints` computation to `useChallengeData.tsx`. Purely additive — no existing code modified.

## Changes

### 1. `src/lib/profileEngine.ts` — Add 5 functions after existing code (after line 822)

**`selectMorningExercise(exercises, profile, dayNumber)`**
- Filters pre-filtered exercises for categories: "Respiração e Relaxamento", "Drenagem Linfática Manual", "Movimento Articular Suave"
- Prefers `duration_seconds <= 300` or duration string containing "3"/"5"
- High pain: only `pain_suitability >= 4` (if field exists)
- Scores: +10 for `body_part` matching `affectedAreas`, +5 for `clinical_benefit` matching `healthConditions`
- Day rotation: `(dayNumber - 1) % length`
- Returns 1 `DbExercise | null`

**`selectShotRecipe(recipes, profile, dayNumber)`**
- Filters for `tipo_refeicao` includes "Bebidas" OR `tags` includes "Shot" OR category includes "Bebida"/"Shot"
- Sorts by `inflammation_score` desc, tiebreak by `nutrient_density_score`
- +10 for `health_goals` overlapping `profile.objectives`
- High pain: prefer lower `pantry_complexity`
- Day rotation, returns 1 `DbRecipe | null`

**`selectMicroMovement(exercises, profile, dayNumber, excludeId?)`**
- Filters for `duration_seconds <= 120` or duration "1"/"2"
- Categories: "Movimento Articular Suave", "Drenagem Linfática Manual"
- Prefers `environment` matching "cama"/"cadeira"/"sofa"
- Excludes `excludeId` to avoid morning duplicate
- Rotation offset +7, returns 1 `DbExercise | null`

**`selectSnackRecipe(recipes, profile, dayNumber)`**
- Filters `tipo_refeicao` includes "Lanche"/"Lanche da Tarde" or category "Lanche"/"Snack"
- Scores by `inflammation_score`, `common_pantry_match`
- Day rotation, returns 1 `DbRecipe | null`

**`selectLunchRecipes(recipes, profile, dayNumber)`**
- Filters `tipo_refeicao` includes "Almoço" or category "Almoço"
- Composite score: `inflammation_score`, `nutrient_density_score`, `health_goals` overlap, `common_pantry_match`
- Returns top 3 with day-based window shift

All functions use optional chaining, handle empty arrays gracefully, return null/empty on no matches.

### 2. `src/hooks/useChallengeData.tsx` — Add touchpoint computation

**New imports** (line ~5): `getTouchpointConfig` from touchpointConfig, new selection functions from profileEngine, `NightTechnique` type

**New interface** `TouchpointData` (after `DayData` interface ~line 48):
```ts
export interface TouchpointData {
  morning: { affirmation: string; schedule: {...}[]; exercise: ChallengeActivity | null; shotRecipe: ChallengeActivity | null };
  lunch: { recipes: ChallengeActivity[]; tip: string };
  afternoon: { hydrationText: string; microMovement: ChallengeActivity | null; snackRecipe: ChallengeActivity | null };
  night: { technique: NightTechnique; closingMessage: string };
}
```

**New `useMemo`** (after `todayData` memo, ~line 328): Computes `todayTouchpoints` using `getTouchpointConfig(currentDay)` + the 5 new selection functions. Wraps exercise/recipe results into `ChallengeActivity` format.

**Add to return** (line 333): `todayTouchpoints` alongside existing values.

## Files changed
- `src/lib/profileEngine.ts` — ADD 5 new exported functions
- `src/hooks/useChallengeData.tsx` — ADD imports, TouchpointData interface, todayTouchpoints memo, return value

## Not changed
- All existing functions, interfaces, return values unchanged
- `src/data/touchpointConfig.ts` — just imported

