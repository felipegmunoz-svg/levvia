

# Add Lightness Score to DayReview Diary Sections

## Summary
Display the lightness score (`lightnessScore`) in all 3 diary rendering blocks of `DayReview.tsx`, immediately after the energy level line in each block.

## Changes in `src/components/journey/DayReview.tsx`

### Edit 1 — After line 326 (journal.energyLevel block)
Insert lightness score check using `journal.lightnessScore` before the notes line.

### Edit 2 — After line 351 (diary.energyLevel block)
Insert lightness score check using `diary.lightnessScore` before the notes line.

### Edit 3 — After line 436 (journal.energy_level / EnergyDots block)
Insert lightness score check using `journal.lightnessScore` before the notes line.

All 3 insertions use the same pattern:
```tsx
{x.lightnessScore != null && (
  <p className="text-sm text-foreground">
    Score de leveza: <span className="font-semibold text-primary">{x.lightnessScore}/10</span>
  </p>
)}
```

## Files modified
- `src/components/journey/DayReview.tsx` — 3 insertions (no other files touched)

