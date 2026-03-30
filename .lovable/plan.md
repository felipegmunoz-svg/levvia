

# FlowSilhouette: Scale Up, Vibrant Colors, Sharp Heat

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Container scale up
- Line 67: `max-w-[400px] max-h-[500px]` → `max-w-[600px]`
- Remove `max-h-[500px]` (aspect-ratio handles proportions)

### 2. Arm zones repositioned inward
- `braco_esq`: `left: "20%"` → `left: "28%"`
- `braco_dir`: `left: "72%"` → `left: "64%"`

### 3. Vibrant heat colors (opacity 0.9)
```ts
const GLOW_BACKGROUNDS: Record<number, string> = {
  1: "rgba(251, 191, 36, 0.9)",   // #FBBF24
  2: "rgba(249, 115, 22, 0.9)",   // #F97316
  3: "rgba(239, 68, 68, 0.9)",    // #EF4444
};
```

### 4. Updated glow shadows to match new colors
```ts
const GLOW_SHADOWS: Record<number, string> = {
  1: "0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)",
  2: "0 0 20px rgba(249, 115, 22, 0.7), 0 0 40px rgba(249, 115, 22, 0.3)",
  3: "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)",
};
```

### 5. Reduce blur from 20px to 5px
- Line 99: `filter: isActive ? "blur(20px)"` → `"blur(5px)"`

### 6. Guide border thickness 1.5px
- Line 101: `"1px dashed #60A5FA"` → `"1.5px dashed #60A5FA"`

## Files modified
- `src/components/FlowSilhouette.tsx`

