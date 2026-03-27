

# Fix parseOnboardingFromSupabase Dietary Data Paths

## Summary
Lines 198-201 read dietary data from `onb.restrictions`, `onb.preferences`, etc. which don't exist. The actual data is stored in `onb.raw['13']`, `onb.raw['14']`, etc. Fix to read from correct path with backward-compatible fallback.

## Changes in `src/lib/profileEngine.ts`

**Lines 198-201** — Update 4 field mappings:

| Field | Old path | New primary path | Fallback |
|---|---|---|---|
| `dietaryRestrictions` | `onb.restrictions` | `onb.raw['13']` | `onb.restrictions` |
| `dietaryPreferences` | `onb.preferences` | `onb.raw['14']` | `onb.preferences` |
| `inflammatoryEnemies` | `onb.enemies` | `onb.raw['11']` | `onb.enemies` |
| `antiInflammatoryAllies` | `onb.allies` | `onb.raw['12']` | `onb.allies` |

Each line follows the pattern: `((onb.raw as any)?.['N'] as string[]) || (onb.oldPath as string[]) || []`

## Files changed
- `src/lib/profileEngine.ts` — 4 lines (198-201)

