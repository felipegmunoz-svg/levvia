

# Fix Gluten-Free Filter — Add Raw Values

## Summary
Add "gluten" and "lactose" as accepted values in the allergen filter since the database stores these without the "sem" prefix.

## Changes in `src/lib/profileEngine.ts`

**Line 401** — Add `af.includes("gluten")` to the Sem Glúten check:
```
return af.includes("gluten") || af.includes("sem glúten") || af.includes("gluten-free") || af.includes("livre de glúten") || (r.tags || []).some(t => t.toLowerCase().includes("glúten"));
```

**Line 407** — Add `af.includes("lactose")` to the Sem Lactose check:
```
return af.includes("lactose") || af.includes("sem lactose") || af.includes("lactose-free") || af.includes("livre de lactose") || (r.tags || []).some(t => t.toLowerCase().includes("lactose"));
```

## Files changed
- `src/lib/profileEngine.ts` — 2 lines

