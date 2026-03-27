

# Add Soy Allergy Filter

## Summary
Add "Alergia a Soja" as a dietary restriction option and filter out soy-containing recipes for users who select it.

## Changes

### 1. `src/data/onboarding.ts` — Line 171
Insert `"Alergia a Soja",` between "Alergia a Amendoim" and "Alergia a Oleaginosas".

### 2. `src/lib/profileEngine.ts` — After line 425
Insert soy filter block after the oleaginosas filter:
```ts
if (normRestr.some(r => r.includes("soja") || r.includes("soy"))) {
  filtered = filtered.filter((r) =>
    !r.ingredients.some((i) =>
      /soja|tofu|edamame|proteína texturizada|leite de soja|shoyu|missô|miso/i.test(i)
    )
  );
}
```

Note: `profileEngine.ts` already has `"alergia a soja": "soy"` in its restriction mapping (line 622), so the normalization will work correctly with the new option.

## Files modified
- `src/data/onboarding.ts` — 1 line added
- `src/lib/profileEngine.ts` — 6 lines added

