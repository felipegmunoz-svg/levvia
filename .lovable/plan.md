

# Fix SVG Overlay Alignment in FlowSilhouette

## Changes in `src/components/FlowSilhouette.tsx`

### 1. Add imports and state for image sizing
Add `useRef` and `useReducer` imports. Create `imgRef` and `forceUpdate` inside `FlowSilhouetteCore`.

### 2. Fix container structure
- Add `ref={imgRef}` and `onLoad={() => forceUpdate()}` to `<img>`
- Change SVG from `className="absolute inset-0 w-full h-full"` to inline `style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}`
- Set `preserveAspectRatio="none"` on SVG so it stretches to match the image exactly

### 3. Make zones invisible before interaction
Replace ellipse styling:
- `fill`: transparent when no intensity (instead of `rgba(46,134,171,0.04)`)
- `stroke`: always transparent
- `strokeWidth`: 0
- `strokeDasharray`: "0"

Zones only become visible with heat gradient when tapped.

### 4. Update AREA_ELLIPSES coordinates
Replace entire array with recalibrated values matching the actual PNG silhouette.

## Files modified
- `src/components/FlowSilhouette.tsx`

