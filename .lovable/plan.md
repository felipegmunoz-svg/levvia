

# Add Rescue Affirmations & Journey Subtitles

## Summary
Content-only additions: rescue affirmations for days missing them, and journey subtitles for days 7–14.

## Changes

### 1. `src/data/touchpointConfig.ts` — Add `affirmationRescue` to 7 days

Days that already have it: 3, 6, 7, 8, 9, 10, 14. The user requested adding to days 1, 2, 4, 5, 8, 9, 10, 11, 12, 13. Cross-referencing: days 8, 9, 10 already have different rescue text — user's request will **replace** those. Days 1, 2, 4, 5, 11, 12, 13 are new additions.

| Day | Line (after `affirmation:`) | Action |
|-----|----------------------------|--------|
| 1 | ~42 | Insert new |
| 2 | ~75 | Insert new |
| 4 | ~152 | Insert new |
| 5 | ~185 | Insert new |
| 8 | ~312–313 | Replace existing |
| 9 | ~373–374 | Replace existing |
| 10 | ~434–435 | Replace existing |
| 11 | ~496 | Insert new |
| 12 | ~557 | Insert new |
| 13 | ~618 | Insert new |

### 2. `src/pages/Journey.tsx` — Extend `daySubtitles` (lines 12–19)

Add entries for days 7–14 to the existing object.

## Files modified
- `src/data/touchpointConfig.ts` — 10 edits (text only)
- `src/pages/Journey.tsx` — 8 lines added to `daySubtitles`

