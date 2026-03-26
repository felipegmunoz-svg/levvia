

# Fix DayReview — Correct Data per Day + Visual Components

## Problem
DayReview may be showing wrong data for some days due to a possible caching issue, and renders raw JSON for days 2/4/5/6 instead of visual components.

## Changes

### `src/components/journey/DayReview.tsx`

1. **Import HeatMapInteractive** for Day 1 visual rendering in read-only mode
2. **Fix `renderDayContent` switch/case** to ensure each day renders only its own data with proper visual components:

| Day | Title | Data Column | Visual |
|-----|-------|-------------|--------|
| 1 | Mapa de Calor | `heat_map_day1` | `<HeatMapInteractive readOnly size="small" initialData={...} />` |
| 2 | Mapa de Inflamação | `day2_inflammation_map` | Formatted cards showing area + type |
| 3 | Semáforo Alimentar | (no saved data) | Static description text |
| 4 | Higiene do Sono | `day4_sleep_data` | Formatted cards with sleep habits |
| 5 | Movimento & Ritmo | `day5_movement_data` | Formatted cards with movement data |
| 6 | Temperos & Especiarias | `day6_spice_data` | Formatted cards with spice selections |

3. **For JSON data (days 2, 4, 5, 6)**: Instead of raw `JSON.stringify`, render human-readable cards showing key-value pairs with labels. Fallback to "Nenhum dado salvo" when empty.

4. **Day 1 specifically**: Replace the dots grid with `<HeatMapInteractive initialData={data.heat_map_day1} readOnly={true} size="small" />` which already supports read-only mode and renders the interactive silhouette.

### Technical details
- Import: `import HeatMapInteractive from "./HeatMapInteractive";`
- The `HeatMapInteractive` component already accepts `readOnly`, `size="small"`, and `initialData` props
- For days 2/4/5/6: parse JSONB objects and render labeled cards instead of `<pre>` tags
- No database changes needed

