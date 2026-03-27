

# Rewrite DayReview.tsx — Visual Formatted Display

## Summary
Complete rewrite of `DayReview.tsx` to replace raw JSON rendering with formatted, human-readable cards per day. Single file change.

## Changes in `src/components/journey/DayReview.tsx`

### Constants update
- **dayTitles**: Use em-dash format ("Dia 1 — Consciência Corporal", etc.) with corrected Day 4/5/6 titles
- **dayIcons**: Fix Day 4 → "😴", Day 5 → "🏃‍♀️", Day 6 → "🌿"
- **dayDescriptions**: Updated per user spec

### Remove
- `formatKey()` helper function
- `renderJsonCards()` generic function

### Container
- Root: `className="theme-light levvia-page min-h-screen pb-24"` (replaces `bg-[#FAFBFC]`)
- Loading spinner: same change
- Back button: `bg-primary text-primary-foreground` (replaces hardcoded colors)

### Day-specific rendering (replaces `renderDayContent`)

**Day 1** — Keep HeatMapInteractive readOnly as-is (already works)

**Day 2** — Parse `day2_inflammation_map.markedAreas` array. Each area rendered as levvia-card showing:
- Area name formatted (e.g. `panturrilha_esq` → "Panturrilha Esquerda")
- Type icons: Dor=🔴, Inchaço=🟡, Peso=🔵, Sensibilidade=🟣
- Notes in separate card with 📝 if present

**Day 3** — Static content: 3 colored-border cards (green/yellow/red) with food categories

**Day 4** — Parse `day4_sleep_data`:
- Hygiene checklist card: 5 items mapped to labels with ✅/⬜
- Breathing card: breathingCompleted status
- Date if createdAt exists

**Day 5** — Parse `day5_movement_data`:
- Exercises card, Meals card, Micro-challenge card, Legs elevation card, Journal card
- Each with ✅/⬜ or formatted values

**Day 6** — Parse `day6_spice_data`:
- Activities checklist (4 items with labels)
- Diary reflection card

### Card styling pattern
```tsx
<div className="levvia-card p-5 space-y-3">
  <h3 className="font-semibold text-foreground flex items-center gap-2">icon title</h3>
  {items.map(item => (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <span>{checked ? "✅" : "⬜"}</span>
      <span className="text-sm text-foreground">{label}</span>
    </div>
  ))}
</div>
```

### Area name formatter
Helper mapping for inflammation areas:
```
ombro_esq → "Ombro Esquerdo", coxa_dir → "Coxa Direita",
panturrilha_esq → "Panturrilha Esquerda", abdomen → "Abdômen", etc.
```

## Files
- `src/components/journey/DayReview.tsx` — full rewrite (same imports, same fetch logic)

## Not changed
- Supabase query, ProfileData interface, useEffect, HeatMapInteractive import
- No other files

