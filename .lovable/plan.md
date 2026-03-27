

# Update Journey.tsx for Touchpoint Progress

## Summary
Update Journey.tsx to show per-touchpoint dots, use config-driven titles, and read completion from `challenge_progress.touchpoints` with backward compatibility for old `dayX_completed` flags.

## Changes in `src/pages/Journey.tsx`

### New imports
- `getTouchpointConfig` from `@/data/touchpointConfig`
- `toast` from `sonner`

### Remove
- Static `dayTitles` and `daySubtitles` maps (lines 10-34) — replace with config-driven values

### Replace with
- `dayTitles`: generate from `getTouchpointConfig(day).theme` for each day
- `daySubtitles`: keep the existing 6 hardcoded subtitles (these are completion achievement labels, not from config)

### State changes
- Add `touchpointData` state: `Record<number, { morning: boolean; lunch: boolean; afternoon: boolean; night: boolean }>` — stores per-day slot completion
- Keep `completedDays` state

### Supabase fetch update (lines 41-59)
- Add `challenge_progress` to the select query
- Parse `challenge_progress?.touchpoints` to extract per-day slot done status
- Build `touchpointData` map for days 1-14
- A day is "completed" if: `touchpoints.dayX.night.done === true` OR old `dayX_completed === true` (backward compat)

### Lock logic update
- Day 1: always unlocked
- Day N (N>1): unlocked if day N-1 is completed
- Remove the old `day <= 6` hardcoded availability

### Click handler update
- Locked days: `toast("Complete o dia anterior primeiro")`
- Remove `if (day > 6) return` guard

### Add touchpoint dots to each day row (inside the Info div, after subtitle)
- Flex row with 4 dots (w-2 h-2 rounded-full): `bg-primary` if done, `bg-muted` if not
- Only show if at least one touchpoint started for that day
- Tiny labels "M A T N" in `text-[8px] text-levvia-muted` below dots

### Everything else stays the same
- Header, progress circle, BottomNav, overall layout, review navigation

## Files changed
- `src/pages/Journey.tsx` — MODIFICATION

