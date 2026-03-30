

# FlowSilhouette: Add Calibration Labels

## Changes — `src/components/FlowSilhouette.tsx` (lines 100–125)

Replace the current `AREA_ELLIPSES.map()` block with user's exact code that wraps each zone in a `<g>` element containing:
1. The existing `<ellipse>` (simplified to static, with `rgba(96,165,250,0.15)` fill and dashed blue stroke)
2. A `<text>` showing the zone `id` at `(cx, cy)` in dark blue, font-size 6
3. A `<text>` showing `cx,cy` coordinates at `(cx, cy+9)` in lighter blue, font-size 5

This temporarily replaces the `motion.ellipse` with static ellipses + labels for visual calibration. The active glow/animation logic is paused during this debug phase.

## Files modified
- `src/components/FlowSilhouette.tsx`

