

# Fix Accent-Insensitive Pantry Matching

## Summary
Add Unicode accent normalization to `scorePantryMatch` so ingredients like "maçã" match pantry items like "maca" (and vice versa).

## Changes in `src/lib/profileEngine.ts`

### 1. Add `normAccent` helper (before line 461)
```ts
function normAccent(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
```

### 2. Update `scorePantryMatch` (lines 465-467)
Replace `ingLower` with `ingNorm` using `normAccent`, and normalize `p` inside the loop.

### 3. Update `pantryLower` creation (line 450)
Apply `normAccent` when building `pantryLower` array.

## Files modified
- `src/lib/profileEngine.ts` — 3 surgical edits

