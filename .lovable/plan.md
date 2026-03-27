

# Create generateDossie.ts

## Summary
Create a single new file `src/lib/generateDossie.ts` with the exact content provided by the user. No other files modified.

## Details
- The file uses `jspdf` and `jspdf-autotable` (already installed in previous step)
- Imports the existing logo asset from `@/assets/logo_livvia_azul.png` (confirmed it exists)
- Imports `DayHistoryItem` type from `@/hooks/useCelebrationData` (created in previous step)
- Generates a branded PDF "Dossiê de Autocuidado" with:
  - Header with logo and date
  - Achievement cards (water, movement, lightness evolution, days completed)
  - Lightness score chart (line graph)
  - Doctor message section
  - Day-by-day history table via autoTable
  - Footer with disclaimer on all pages

## Files
- `src/lib/generateDossie.ts` — NEW (exact content as specified)

