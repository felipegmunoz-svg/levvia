

# Create Touchpoint Configuration File

## Summary
Create `src/data/touchpointConfig.ts` — a pure data file defining content for all 14 days of the Levvia journey with 4 daily touchpoints each.

## File: `src/data/touchpointConfig.ts` (NEW)

**Types**: `TouchpointSlot`, `NightTechnique`, `DayTouchpointConfig` — as specified.

**Content**: 
- Days 1-6 with full themed content (affirmations, schedules, exercises, shots, tips, night techniques with steps, closing messages)
- Days 7-14 with placeholder structure ("Em Construção" theme, "Em breve" labels, generic reflection night technique)

**Exports**:
- `TOUCHPOINT_CONFIGS: DayTouchpointConfig[]` (14 items)
- `getTouchpointConfig(dayNumber: number): DayTouchpointConfig` helper

No other files modified. Pure data, zero side effects.

