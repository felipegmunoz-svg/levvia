

# Add FlowSilhouette to Profile Evolution Section

## Summary
Add the body silhouette with hydration wave to the "Evolução" tab in Profile.tsx, between the stats row and the bar chart.

## Changes

### `src/pages/Profile.tsx`

**After line 484** (closing `</div>` of the stats grid), insert a new `motion.div` block:

```tsx
<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.33 }} className="glass-card p-5 flex flex-col items-center">
  <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-1 self-start">
    💧 Seu mapa de leveza
  </h3>
  <p className="text-xs text-muted-foreground mb-4 self-start">
    A fita azul cresce conforme sua hidratação do dia
  </p>
  <FlowSilhouette
    painAreas={(() => {
      const hm = (profile as any).heatMapDay1;
      if (!hm || typeof hm !== "object") return {};
      const mapped: Record<string, 0 | 1 | 2 | 3> = {};
      for (const [k, v] of Object.entries(hm)) {
        mapped[k] = Math.min(3, Math.max(0, typeof v === "number" ? v : 0)) as 0 | 1 | 2 | 3;
      }
      return mapped;
    })()}
    showHydrationWave={true}
  />
</motion.div>
```

FlowSilhouette is already imported (line 2). No other files modified.

## Files modified
- `src/pages/Profile.tsx` — 1 block inserted in evolution section

