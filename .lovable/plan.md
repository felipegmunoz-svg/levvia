

# Add Pantry Items to PDF Dossiê

## Summary
Add `pantryItems` data flow through 3 files: fetch from DB → pass to PDF generator → render as chip layout in the PDF. Also fix table column widths.

## Changes

### 1. `src/hooks/useCelebrationData.ts`
- Add `pantryItems: string[]` to `CelebrationData` interface (line 22)
- Add `pantryItems: []` to initial state (line 35)
- Add `pantry_items` to `.select()` query (line 46)
- After `rawName` line, extract `const pantryItems = profile?.pantry_items ?? []`
- Include `pantryItems` in `setData({...})`

### 2. `src/lib/generateDossie.ts`
- Add `pantryItems: string[]` to `GenerateDossieParams` interface (line 14)
- Add `pantryItems` to destructuring (line 27)
- Insert new "Inventário da Despensa" section (chip layout) between Seção 3 (doctor message, ends line 195) and Seção 4 (history table, line 197)
- Update columnStyles: col 3 → `cellWidth: 95, overflow: 'linebreak'`, col 4 → `cellWidth: 13`

### 3. `src/pages/Celebration.tsx`
- Add `pantryItems` to destructuring of `useCelebrationData()` (line 31)
- Add `pantryItems` to `generateDossie({...})` call (line 53)

## Files modified
- `src/hooks/useCelebrationData.ts` — 5 small edits
- `src/lib/generateDossie.ts` — 3 edits (interface, new section, column widths)
- `src/pages/Celebration.tsx` — 2 additions

