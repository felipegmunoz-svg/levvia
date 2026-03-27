

# Update `useTouchpointProgress` Plan — isDayComplete Logic

## Change

In the plan for `src/hooks/useTouchpointProgress.ts`:

**`isDayComplete`** computed value:

- **Before**: `all 4 slots done`
- **After**: `progress.night.done === true`

The night slot (journal/technique) is the sole gate for marking a day as complete. Other slots can be done in any order and don't affect day completion status.

This is a plan-level update only — no files exist yet to modify.

