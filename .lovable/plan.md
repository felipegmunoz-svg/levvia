

# Three fixes: AfternoonSlot snack label, hollow check icon, M-A-T-N legend

## 1. AfternoonSlot — show snack name after completion

**File:** `src/components/journey/DayTouchpointView.tsx` (line 291)

The `completedItemLabel` already reads `snack_id` from progress (line 247). The only issue is line 291 ignores it. Change:

```tsx
{s.slot === "afternoon" && "Lanche concluído"}
```
to:
```tsx
{s.slot === "afternoon" && (completedItemLabel || "Lanche concluído")}
```

The `onMarkDone` in `AfternoonSlot.tsx` already calls `onComplete({ hydration: true, snack_id: snackRecipe.id })` (lines 70-72), so saving works. This change makes the label display match the lunch pattern.

## 2. Replace check icon with hollow circle

**File:** `src/components/journey/DayTouchpointView.tsx` (lines 301-302)

Replace:
```tsx
<Check size={16} strokeWidth={1.5} className="text-primary" />
```
with:
```tsx
<div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
  <Check size={12} strokeWidth={2} className="text-primary" />
</div>
```

## 3. M-A-T-N legend in HydrationModule

**File:** `src/components/journey/touchpoints/HydrationModule.tsx` (after line 72)

Add a legend line below the tick marks:
```tsx
<p className="text-[10px] text-center text-muted-foreground font-body mt-0.5">
  Manhã · Almoço · Tarde · Noite
</p>
```

## Files modified
- `src/components/journey/DayTouchpointView.tsx` (lines 291, 301-302)
- `src/components/journey/touchpoints/HydrationModule.tsx` (after line 72)

