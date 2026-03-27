

# Update touchpointConfig.ts — Full Days 7-14 Content

## Summary
Replace the placeholder `Array.from` block (lines 252-289) with 8 fully detailed day configs. Update the `NightTechnique` type and `DayTouchpointConfig` interface with adaptive/rescue fields.

## Changes in `src/data/touchpointConfig.ts`

### Interface updates (lines 3-27)

1. Add `'heatmap-comparative'` to `NightTechnique.type` union
2. Add optional adaptive fields to `DayTouchpointConfig`:
   - `affirmationRescue?: string`
   - `morningExerciseLabelRescue?: string`
   - `lunchTipRescue?: string`
   - `afternoonMicroMovementLabelRescue?: string`
   - `nightTechniqueRescue?: NightTechnique`
   - `closingMessageRescue?: string`
   - `isCheckpointDay?: boolean`

### Replace placeholder block (lines 252-289)

Remove the `...Array.from({ length: 8 }, ...)` spread and replace with 8 individual day objects containing all the content specified in the request:

- **Day 7** — "O Marco da Leveza": Checkpoint day, heatmap-comparative night technique, rescue exercise alternatives
- **Day 8** — "Intensificação": Dual affirmations, meditation + escalda-pés rescue technique
- **Day 9** — Similar to Day 8 with unique affirmation
- **Day 10** — Checkpoint day, same structure as Day 8-9
- **Day 11** — "Autonomia": Bridge glutes, visualization meditation + progressive relaxation rescue
- **Day 12** — Similar to Day 11, unique affirmation
- **Day 13** — Similar to Day 11, unique affirmation
- **Day 14** — "O Novo Eu": Checkpoint day, 10-min visualization meditation, celebratory closing

Each day includes: full `schedule`, `hydrationTexts` (reusing generic pattern with `{meta}` placeholders), `afternoonKnowledgePill`, and rescue variants where specified. Days 9, 10, 12, 13 share exercise/technique structure with their base day (8 or 11) but have unique affirmations/closing messages.

Also add `isCheckpointDay: true` to existing Day 3 and Day 6 configs.

## Files changed
- `src/data/touchpointConfig.ts` — MAJOR UPDATE

