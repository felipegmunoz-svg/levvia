

# Create Celebration.tsx Page

## Summary
Create a single new file `src/pages/Celebration.tsx` — a celebration/completion page shown after the 14-day challenge. No other files modified.

## Notes
The user's message had JSX tags stripped by the markdown parser. I will reconstruct the full component based on the visible class names, text content, structure, and the intact code sections (Block 5 onward). The component structure is:

1. **Loading state** — spinner with "Preparando sua celebração..."
2. **Header** — logo, wave emoji, completion title
3. **Lavínia message** — motivational quote in a card
4. **Victory dashboard** — 4 metric cards (water, movement, lightness evolution, adherence)
5. **HeatMap comparative** — visual transformation using `HeatMapComparative`
6. **PDF generator** — textarea for doctor message + generate button
7. **Annual plan CTA** — upsell to `/plans`
8. **Footer** — thank you message + `BottomNav`

All sections use `motion.div` with the `fadeUp` variants. Uses existing imports: `useCelebrationData`, `generateDossie`, `HeatMapComparative`, `BottomNav`, logo asset.

## Files
- `src/pages/Celebration.tsx` — NEW

