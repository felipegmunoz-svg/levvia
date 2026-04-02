

# 4 melhorias: NightSlot + HeatMapInteractive

## 1. Capturar e persistir dados do mapa noturno — `NightSlot.tsx`

- Add state: `const [nightHeatMap, setNightHeatMap] = useState<Record<string, number> | null>(null);`
- Update `onComplete` interface to include `night_heat_map?: Record<string, number>`
- Line 86: change `onNext={() => setTechniqueDone(true)}` to capture data:
  ```tsx
  onNext={(data) => { setNightHeatMap(data as Record<string, number>); setTechniqueDone(true); }}
  ```
- Line 51 (showClosing effect): add `night_heat_map: nightHeatMap ?? undefined` to `onComplete` call

## 2. Atualizar retórica — `HeatMapInteractive.tsx`

Add optional props `title?: string` and `subtitle?: string` to the interface. Use them in lines 85-101 with fallback to current defaults.

In `NightSlot.tsx` line 86, pass custom rhetoric:
```tsx
<HeatMapInteractive
  title="Como está o seu fogo agora?"
  subtitle="Após as práticas de hoje, como você sente cada área? Toque para reduzir a intensidade onde o alívio chegou ou para marcar novos pontos de atenção."
  onNext={...}
/>
```

## 3. Card de evolução diária — `NightSlot.tsx`

Inline `EvolutionSummaryCard` component rendered between technique completion and diary:
- Count areas with intensity >= 2 in `heatMapDay1Data` (morning X) vs `nightHeatMap` (night Y)
- Show contextual message based on Y vs X comparison
- Card styled with `bg-primary/5`, centered text, `font-body`
- Render condition: `techniqueDone && nightHeatMap && heatMapDay1Data && !isReviewMode`

## 4. Efeito visual de alívio — `HeatMapInteractive.tsx`

- Add state: `relievedArea` (AreaId | null) and `showReliefToast` (boolean)
- In `toggleArea`: before updating, check if new value < old value. If so, set `relievedArea` and `showReliefToast`, clear with `setTimeout(800ms)` and `setTimeout(2000ms)` respectively
- Render a `<span>` with `animate-ping` positioned over the SVG area when `relievedArea` matches (approximate center positions per area)
- Render a fixed bottom toast "Que vitória! 🌟" with fade-out animation when `showReliefToast` is true

## Files modified
- `src/components/journey/touchpoints/NightSlot.tsx`
- `src/components/journey/HeatMapInteractive.tsx`

