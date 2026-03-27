

# Fix Invisible SVG Silhouettes + Separators in Light Theme

## Summary
Replace hardcoded dark-theme SVG colors (`rgba(237,242,247,...)`) and separator colors (`rgba(255,255,255,...)`) with neutral gray-blue values visible on both light and dark backgrounds.

## Changes

### 1. `src/components/journey/HeatMapInteractive.tsx`
- Line 35: intensity 0 fill `rgba(237,242,247,0.08)` → `rgba(140,160,180,0.15)`
- Lines 117-122: decorative parts fill `rgba(237,242,247,0.12)` → `rgba(140,160,180,0.15)`, stroke `rgba(237,242,247,0.3)` → `rgba(140,160,180,0.4)`
- Lines 123-131: interactive area strokes `rgba(237,242,247,0.3)` → `rgba(140,160,180,0.4)` (fills stay as intensityColors)

### 2. `src/components/journey/Day2InflammationMap.tsx`
- Lines 61-62: `BASE_FILL` → `rgba(140,160,180,0.15)`, `STROKE` → `rgba(140,160,180,0.4)`
- Lines 210-215: decorative fills `rgba(237,242,247,0.12)` → `rgba(140,160,180,0.15)`

### 3. `src/components/HeatMapCard.tsx`
- Line 30: intensity 0 → `rgba(140,160,180,0.15)`
- Line 67: stroke → `rgba(140,160,180,0.4)`
- Lines 72-77: decorative fills → `rgba(140,160,180,0.15)`

### 4. `src/pages/Plans.tsx`
- Line 24: root div — remove `style={{ background: "hsl(210, 63%, 13%)" }}`, add `className="theme-light min-h-screen flex flex-col bg-background"`
- Lines 72, 142, 211, 213: separators `rgba(255,255,255,0.08)` → `rgba(0,0,0,0.06)`
- Line 212: "ou" text color `rgba(237,242,247,0.35)` → `rgba(140,160,180,0.5)`

### 5. `src/components/SymptomEvolutionChart.tsx`
- Line 139: grid stroke → `rgba(0,0,0,0.06)`
- Lines 143, 149: axis stroke → `rgba(0,0,0,0.08)`
- Line 155: tooltip border → `rgba(0,0,0,0.08)`
- Line 154: tooltip bg `hsl(210,50%,16%)` → `hsl(0,0%,100%)` and line 158 text color → `hsl(210,30%,20%)` (light-compatible tooltip)

## Not changed
- Intensity colors 1/2/3 (yellow, red — already visible)
- Component logic, click handlers, data flow
- Previously corrected journey components

