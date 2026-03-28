

# Remove "Prefiro refeições rápidas" Option

## Changes

### 1. `src/data/onboarding.ts` — Line 183
Remove `"Prefiro refeições rápidas",` from the options array of the Preferências Alimentares step (id 14).

### 2. `src/lib/profileEngine.ts` — Lines 434–442
Remove the entire block that sorts recipes by preparation time when "Prefiro refeições rápidas" is selected:
```ts
  // Dietary preferences
  if (profile.dietaryPreferences.includes("Prefiro refeições rápidas")) {
    // Prioritize but don't exclude: sort by time
    filtered.sort((a, b) => {
      const timeA = parseMinutes(a.time || "");
      const timeB = parseMinutes(b.time || "");
      return timeA - timeB;
    });
  }
```

## Files modified
- `src/data/onboarding.ts` — 1 line removed
- `src/lib/profileEngine.ts` — 9 lines removed

