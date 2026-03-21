

# Fix: Revert `getMealLabel()` to correct meal-time mapping

## Change

**File:** `src/components/journey/Day1MealSuggestion.tsx` (lines 11-18)

Current code returns "Jantar" for 00h-04h59 (from previous fix). Revert and update to the user's revised mapping:

```typescript
function getMealLabel(): string {
  const hour = new Date().getHours();
  if (hour < 10) return "Café da Manhã";      // 00h-09h59
  if (hour < 12) return "Lanche da Manhã";     // 10h-11h59
  if (hour < 15) return "Almoço";              // 12h-14h59
  if (hour < 18) return "Lanche da Tarde";     // 15h-17h59
  if (hour < 21) return "Jantar";              // 18h-20h59
  return "Café da Manhã";                      // 21h-23h59
}
```

Key differences from current code:
- 00h-04h59: "Café da Manhã" (was "Jantar")
- 18h-20h59: "Jantar" (was 18h-23h59)
- 21h-23h59: "Café da Manhã" (new — suggests next morning's meal)

Single file, single function change.

