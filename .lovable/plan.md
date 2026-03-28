

# Convert Food Screens to Educational (Info) Screens

## Summary
Change onboarding steps 11 ("Inimigos Inflamatórios") and 12 ("Aliados Anti-inflamatórios") from interactive multi-select to read-only educational screens. No data saved from these steps.

## Changes

### 1. `src/data/onboarding.ts` — Interface + Steps

**Interface (line 2)**: Add `"info_list"` to the type union and add `items?: string[]` field.

**Step id 11 (lines 125–141)**: Change `type` to `"info_list"`, remove `options`, update `subtitle`, add `items` array with the 5 educational items.

**Step id 12 (lines 142–157)**: Same — change to `"info_list"`, remove `options`, update `subtitle`, add `items` with 6 educational items.

### 2. `src/pages/Onboarding.tsx` — Validation + Rendering

**Validation (line 176)**: Add `"info_list"` alongside `"result"` and `"info"` so it always passes validation (no selection needed).

**Rendering (~line 679)**: Add a new `if (current.type === "info_list")` block before the existing `"info"` block. Renders:
- Title (same style as other screens)
- `subtitle` as description paragraph
- `items` as a styled list with leaf/flame icons
- No checkboxes, no state, no data saving

The `handleNext` function already doesn't save data for unknown types, so no changes needed there.

### New type rationale
Using `"info_list"` instead of reusing `"info"` because the existing `"info"` block (line 679) has special logic for the final "Análise Completa" screen (personalized subtitle with objectives). A separate type avoids interference.

## Files modified
- `src/data/onboarding.ts` — interface update + 2 step rewrites
- `src/pages/Onboarding.tsx` — validation tweak + new render block

