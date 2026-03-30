

# FlowSilhouette: Container resize + Zone recalibration

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Update AREA_ELLIPSES (lines 29–39)
Replace with user's new coordinates (narrower rx values, adjusted cx/cy positions).

### 2. Update container (lines 74–76)
Remove `w-full max-w-[450px]` and `aspectRatio` style. Use inline style `width: "100%", maxWidth: "200px"`.

### 3. Update image (lines 79–85)
Remove `absolute inset-0 w-full h-full object-fill`. Use inline style `width: "100%", height: "auto", display: "block"`.

### 4. Update SVG overlay (lines 88–91)
Change from `absolute inset-0 w-full h-full` to positioning that matches the natural-sized image. Since the image now flows naturally (no aspect-ratio container), the SVG needs `position: absolute; top: 0; left: 0; width: 100%; height: 100%` to overlay it.

### 5. Legacy wrapper (line 150)
Update the small-size class from `max-w-[140px]` to match new scale if needed — keep as-is since 140px < 200px.

## Files modified
- `src/components/FlowSilhouette.tsx`

