

# Fix: Nighttime Hour in `getMealLabel()`

## Change

**File:** `src/components/journey/Day1MealSuggestion.tsx` (lines 11-18)

Update `getMealLabel()` to handle 00h-04h59 as "Jantar" before the morning check:

```typescript
function getMealLabel(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Jantar";
  if (hour < 10) return "Café da Manhã";
  if (hour < 12) return "Lanche da Manhã";
  if (hour < 15) return "Almoço";
  if (hour < 18) return "Lanche da Tarde";
  return "Jantar";
}
```

Single file, single function, 1-line logic shift.

