

# Update DayReview.tsx for Touchpoint-Based Review

## Summary
Add a `renderTouchpointReview` function that shows a formatted 4-slot summary. Use it when `challenge_progress.touchpoints` data exists for the reviewed day; fall back to existing `renderDayX` functions for legacy completions. Extend support to days 7-14.

## Changes in `src/components/journey/DayReview.tsx`

### New imports
- `getTouchpointConfig` from `@/data/touchpointConfig`

### Update ProfileData interface
- Add `challenge_progress: Record<string, unknown> | null`

### Update Supabase select (line 123)
- Add `challenge_progress` to the query

### Extend dayNum guard (line 132)
- Change `dayNum > 6` to `dayNum > 14`
- Add fallback title/icon/description for days 7-14 using `getTouchpointConfig(dayNum).theme`

### New function: `renderTouchpointReview(dayNum, tpData)`
Receives day number and the touchpoint progress object (`{ morning: { done, ... }, lunch: { done, ... }, afternoon: { done, ... }, night: { done, ... } }`).

Renders 4 `SectionCard` blocks in a `space-y-3` div:

1. **🌅 Manhã** — Affirmation in italic from config. Green "Concluído" badge if `morning.done`. Mentions exercise/shot if IDs present.
2. **🥗 Almoço** — Green badge if done. Recipe mention if ID present. Lunch tip from config in italic.
3. **💧 Tarde** — Green badge if done. Hydration checkmark. Micro-movement and snack mentions if IDs present.
4. **🌙 Noite** — Technique title from config. "Técnica concluída" if `night.technique_done`. Journal data formatted (leg sensation, energy dots, notes). Day 1 special: render `HeatMapInteractive` readOnly if heatmap data exists.

### Update `renderDayContent` (lines 321-331)
- Before the switch, check if `challenge_progress?.touchpoints?.[`day${dayNum}`]` exists
- If yes → call `renderTouchpointReview(dayNum, tpData)`
- If no → fall through to existing switch for days 1-6
- Days 7-14 with no touchpoint data → show "Você ainda não completou este dia."

### Update header section (lines 341-351)
- For days 7-14, use `getTouchpointConfig(dayNum).theme` as title and `config.purpose` as description
- Keep existing titles/icons/descriptions for days 1-6 as fallback

## Files changed
- `src/components/journey/DayReview.tsx` — MODIFICATION

## Not changed
- No other files

