

# Create HeatMapComparative Component for Day 7

## Summary
Create a side-by-side heatmap comparison component showing Day 1 vs Today, and wire it into the NightSlot for `heatmap-comparative` technique type. The Day 1 data is already available via `profile.heatMapDay1` in the existing data flow.

## New File: `src/components/journey/HeatMapComparative.tsx`

### Props
- `day1Data: Record<string, number> | null` — from `profile.heatMapDay1`
- `onNext: () => void` — called on completion
- `isReviewMode: boolean` (default false)

### Layout (vertical stack, space-y-6)
1. **Header**: "Seu Progresso Visual" (font-heading semibold xl) + subtitle
2. **Side-by-side** (flex-row gap-4):
   - Left: "Dia 1" label (text-red-400), `HeatMapInteractive` readOnly size="small" with `initialData={day1Data}`, intensity summary badges below
   - Right: "Hoje" label (text-primary), interactive or readOnly `HeatMapInteractive` size="small"
   - If `day1Data` is null/empty: show only "Hoje" full-width with "Dados do Dia 1 não disponíveis" note
3. **Improvement Summary** (after today map completed): levvia-card comparing each area's intensity change → improved/same/worsened counts with colored badges + motivational message
4. **Continue button** (after completion, not in review mode)

### State
- `todayData: Record<string, number> | null`
- `showSummary: boolean`

## Modified Files

### `src/hooks/useChallengeData.tsx`
- Add `heatMapDay1Data` to `TouchpointData.night` when technique type is `heatmap-comparative`:
  ```ts
  night: {
    technique: effectiveNightTechnique,
    closingMessage: effectiveClosingMessage,
    heatMapDay1Data: effectiveNightTechnique.type === 'heatmap-comparative' ? (profile.heatMapDay1 || null) : undefined,
  }
  ```
- Update `TouchpointData.night` interface to include `heatMapDay1Data?: Record<string, number> | null`

### `src/components/journey/DayTouchpointView.tsx`
- Pass `heatMapDay1Data={touchpoints.night.heatMapDay1Data}` to NightSlot

### `src/components/journey/touchpoints/NightSlot.tsx`
- Add `heatMapDay1Data?: Record<string, number> | null` to props
- Add case `"heatmap-comparative"` in `renderTechnique()` switch:
  - Render `HeatMapComparative` with `day1Data={heatMapDay1Data}`, `onNext={() => setTechniqueDone(true)}`, `isReviewMode`

## Files
- `src/components/journey/HeatMapComparative.tsx` — NEW
- `src/hooks/useChallengeData.tsx` — MODIFY (add heatMapDay1Data to night touchpoint)
- `src/components/journey/DayTouchpointView.tsx` — MODIFY (pass heatMapDay1Data)
- `src/components/journey/touchpoints/NightSlot.tsx` — MODIFY (add heatmap-comparative case)

