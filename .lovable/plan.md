

# Update profileEngine for Rescue/Consecration Mode Filtering

## Summary
Add `rescueMode` parameter to the 5 selection functions in profileEngine.ts, thread it through useChallengeData and DayTouchpointView to apply adaptive content selection and config field overrides.

## Changes

### 1. `src/lib/profileEngine.ts` — 5 functions updated

**`selectMorningExercise`** (line 855): Add `rescueMode = "neutral"` param.
- Resgate: filter to "Drenagem Linfática Manual" / "Respiração e Relaxamento" categories only; duration cap → 600s; +20 score for `pain_suitability >= 8`
- Consagração: add "Fortalecimento Suave" / "Mobilidade" to MORNING_CATEGORIES; keep 300s cap

**`selectShotRecipe`** (line 897): Add `rescueMode` param.
- Resgate: +30 score for `inflammation_score >= 9`
- Consagração: no changes

**`selectMicroMovement`** (line 943): Add `rescueMode` param.
- Resgate: remove 120s duration cap (allow up to 600s); +20 for "Drenagem Linfática Manual" category; +20 (instead of existing +10 via scoreForTouchpoint) for body_part match
- Consagração: add "Fortalecimento Suave" to MICRO_CATEGORIES; keep 120s cap

**`selectSnackRecipe`** (line 985): Add `rescueMode` param.
- Resgate: +20 for `inflammation_score >= 9`
- Consagração: no changes

**`selectLunchRecipes`** (line 1016): Add `rescueMode` param.
- Resgate: hard-filter to `inflammation_score >= 8`; if < 3 results, relax to >= 6; +30 for score === 10
- Consagração: +10 for health_goals containing "Energia"/"Saciedade"

### 2. `src/hooks/useChallengeData.tsx` — Accept rescueMode

- Change `useChallengeData()` signature to `useChallengeData(rescueMode: string = "neutral")`
- Pass `rescueMode` to all 5 selection function calls in the `todayTouchpoints` useMemo (lines 366-370)
- Add `rescueMode` to useMemo dependency array
- In the `todayTouchpoints` builder, use rescue-aware config fields:
  - `affirmation`: use `config.affirmationRescue` when resgate, else `config.affirmation`
  - `lunchTip`: use `config.lunchTipRescue` when resgate
  - `nightTechnique`: use `config.nightTechniqueRescue` when resgate
  - `closingMessage`: use `config.closingMessageRescue` when resgate

### 3. `src/pages/Today.tsx` — Thread rescueMode

- Pass `rescueMode` from `useRescueMode()` into `useChallengeData(rescueMode)` (line where hook is called)

### 4. `src/components/journey/DayTouchpointView.tsx` — No changes needed

Already receives `rescueMode` prop and config field overrides are now handled in useChallengeData, so DayTouchpointView renders whatever touchpoints data it receives.

## Files changed
- `src/lib/profileEngine.ts` — 5 functions gain `rescueMode` param with filtering/scoring logic
- `src/hooks/useChallengeData.tsx` — Accept `rescueMode`, pass to selection functions, use rescue config fields
- `src/pages/Today.tsx` — Pass `rescueMode` to `useChallengeData`

