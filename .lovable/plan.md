

# Standardize slot completion indicators in DayTouchpointView

## Changes — `src/components/journey/DayTouchpointView.tsx`

### 1. Replace green circle with thin check icon (lines 297-301)

Remove:
```tsx
{isDone ? (
  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
    <Check size={14} className="text-primary-foreground" />
  </div>
) : (
```

Replace with:
```tsx
{isDone ? (
  <Check size={16} strokeWidth={1.5} className="text-primary" />
) : (
```

### 2. Add per-slot completion summary text (lines 286-290)

Replace the current `completedItemLabel` block with logic that shows a summary for **every** slot when done — not just when a recipe label is found:

```tsx
{isDone && (
  <p className="text-xs text-primary font-body mt-0.5 flex items-center gap-1">
    <Check size={10} />
    {s.slot === "morning" && "Exercício + shot concluídos"}
    {s.slot === "lunch" && (completedItemLabel || "Almoço concluído")}
    {s.slot === "afternoon" && "Lanche concluído"}
    {s.slot === "night" && "Rotina noturna concluída"}
  </p>
)}
```

The lunch slot keeps reading `recipe_choice_id` to show the recipe name when available, falling back to generic text.

## Files modified
- `src/components/journey/DayTouchpointView.tsx` (lines 286-300)

