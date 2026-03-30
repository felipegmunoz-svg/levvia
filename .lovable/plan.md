

# Full Rewrite of FlowSilhouette.tsx

## Key decisions

The user's provided code uses **different image paths** (`/flow_silhouette_full_v3.png`, `/flow_silhouette_base_white_bg.png`) that don't exist in `public/`. The actual images are at `/assets/flow_silhouette_base.png` and `/assets/flow_silhouette_full.png`. I'll use the real paths.

The user's code also **removes** `calculateFlowScore` and the **legacy wrapper** used by `Progress.tsx`. These must be preserved to avoid breaking that page.

## Changes — `src/components/FlowSilhouette.tsx`

Full rewrite incorporating:

1. **User's exact `AREA_CONFIG`** with percentage-based coordinates, 15° arm rotations, and leg rotations
2. **User's exact rendering logic** — `motion.ellipse` with pulsing animation for active areas, dashed stroke affordance for all areas, `<g>` grouping with transform
3. **User's `PAIN_COLORS` map** and `aspect-[3/4]` container with `object-contain`
4. **Corrected image paths** → `/assets/flow_silhouette_base.png` and `/assets/flow_silhouette_full.png`
5. **Preserved `calculateFlowScore` export** (unchanged)
6. **Preserved legacy wrapper** at the bottom for `Progress.tsx` compatibility (converts `heatMapData`/`waterIntakeMl`/`waterGoalMl` props into the new interface)

No other files modified.

