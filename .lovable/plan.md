

# Create FlowSilhouette Component

## Summary
Create a premium visual component that renders a glassmorphism feminine silhouette with two dynamic layers: heat zones (pain/inflammation) and a rising blue hydration aura. Includes score display and hydration progress bar.

## New File: `src/components/FlowSilhouette.tsx`

### Props
- `heatMapData: Record<string, number>` — area IDs to intensity 0-3
- `waterIntakeMl: number`, `waterGoalMl: number`
- `size: "small" | "large"` (default "large")
- `animated: boolean` (default true)

### SVG Structure (viewBox 0 0 220 440, matching HeatMapInteractive coordinate system)

1. **Defs**: Define radial gradients for each heat intensity level, a vertical linear gradient for the blue aura, and a `<clipPath>` using the full silhouette outline path

2. **Base Silhouette**: Single elegant feminine SVG path — narrower shoulders, defined waist/hips. Fill `rgba(240,245,250,0.15)`, stroke `rgba(180,200,220,0.3)` for glassmorphism effect

3. **Heat Layer**: Reuse the 9 area paths from HeatMapInteractive. Each area filled with its intensity color (transparent/yellow-orange/orange/red)

4. **Flow Aura Layer**: A rect clipped to the silhouette shape via clipPath. The rect is positioned so its top edge corresponds to hydration percentage (0% = bottom only, 100% = full body). Filled with linear gradient from `rgba(46,196,182,0.4)` to transparent at top edge. When `animated=true`, the top edge pulses via CSS keyframe (opacity 0.3↔0.5, 2s ease-in-out infinite)

### Size Variants
- `"large"`: w-[280px] h-[420px], container is `levvia-card p-6`
- `"small"`: w-[140px] h-[210px], no card wrapper

### Score Display (below SVG)
- `calculateFlowScore(heatMapData)`: `Math.round((1 - sum/27) * 100)`
- Text: "Score de Fluxo: {score}%" with red/yellow/teal color coding
- Exported as named function for reuse

### Hydration Bar (below score)
- Horizontal bar: `bg-muted` track, `bg-primary` fill, rounded
- Label: `{waterIntakeMl}ml / {waterGoalMl}ml` in `text-xs text-levvia-muted`

### Animation
- Entry: framer-motion fade-in + scale 0.95→1.0
- Aura pulse: CSS keyframe on the gradient rect opacity (when `animated=true`)

### Exports
- `default` — FlowSilhouette component
- `calculateFlowScore` — named export

## Files
- `src/components/FlowSilhouette.tsx` — NEW
- No existing files modified

