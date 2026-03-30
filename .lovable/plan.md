

# Fix FlowSilhouette Scale & Calibration

## Problem
Heat zones are oversized and misaligned — they extend outside the body silhouette.

## Changes — `src/components/FlowSilhouette.tsx`

### 1. Container: lock proportions
- Change container class to: `relative mx-auto w-full max-w-[400px] max-h-[500px]`
- Add inline `style={{ aspectRatio: "3 / 4" }}`

### 2. Replace ZONE_CONFIG with user's exact reduced coordinates
```ts
const ZONE_CONFIG = [
  { id: "braco_esq",       top: "30%", left: "20%", width: "8%",  height: "20%", rotate: "15deg" },
  { id: "braco_dir",       top: "30%", left: "72%", width: "8%",  height: "20%", rotate: "-15deg" },
  { id: "abdomen",         top: "35%", left: "40%", width: "20%", height: "15%", rotate: "0deg" },
  { id: "quadril_esq",     top: "50%", left: "35%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "quadril_dir",     top: "50%", left: "55%", width: "10%", height: "8%",  rotate: "0deg" },
  { id: "coxa_esq",        top: "58%", left: "33%", width: "10%", height: "20%", rotate: "5deg" },
  { id: "coxa_dir",        top: "58%", left: "57%", width: "10%", height: "20%", rotate: "-5deg" },
  { id: "panturrilha_esq", top: "80%", left: "35%", width: "8%",  height: "12%", rotate: "2deg" },
  { id: "panturrilha_dir", top: "80%", left: "57%", width: "8%",  height: "12%", rotate: "-2deg" },
];
```

### 3. Dashed guide borders — always visible, light blue
Change the inactive border from `rgba(255,255,255,0.2)` to `#60A5FA`:
```ts
border: !isActive && interactive ? "1px dashed #60A5FA" : "none",
```

### 4. Increase blur to 20px for smoky heat effect
Update `GLOW_SHADOWS` to use `20px` and `40px` spread:
```ts
const GLOW_SHADOWS: Record<number, string> = {
  1: "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)",
  2: "0 0 20px rgba(234, 88, 12, 0.6), 0 0 40px rgba(234, 88, 12, 0.3)",
  3: "0 0 20px rgba(220, 38, 38, 0.7), 0 0 40px rgba(220, 38, 38, 0.3)",
};
```

Also add CSS `filter: blur(20px)` to the active zone's inline style for the smoky diffusion effect, and reduce background opacity to compensate:
```ts
const GLOW_BACKGROUNDS: Record<number, string> = {
  1: "rgba(253, 230, 138, 0.5)",
  2: "rgba(253, 186, 116, 0.6)",
  3: "rgba(252, 165, 165, 0.7)",
};
```
When active, add `filter: "blur(20px)"` to the style object.

### 5. No other files modified

## Files modified
- `src/components/FlowSilhouette.tsx`

