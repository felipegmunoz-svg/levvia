

# Redesign HeatMapInteractive Silhouette — Glassmorphism + Hydration Aura

## Summary
Visual overhaul of the SVG silhouette to match the reference image: white translucent glassmorphism body, soft-glow heat spots, blue-tinted background, and an optional diagonal hydration aura ribbon.

## Changes

### 1. `src/components/journey/HeatMapInteractive.tsx`

**Interface** (line 4–9): Add `showHydrationAura?: boolean` prop.

**Intensity colors** (lines 34–39): Update to new gradient:
```ts
0: "rgba(255,255,255,0.0)",        // no selection = transparent (body is already white)
1: "rgba(244,165,53,0.5)",         // leve — amber
2: "rgba(224,90,58,0.65)",         // moderada — orange
3: "rgba(200,40,40,0.8)",          // intensa — red
```

**Container background** (line 82): Add `rounded-2xl` and conditional background style `background: #E8EEF4`.

**SVG structure** (lines 117–137): Major rework:
- Add `<defs>` with a `<filter id="glow">` containing `feGaussianBlur stdDeviation="8"` for heat spot blur.
- Decorative parts (head, neck, hands, feet): change fill to `rgba(255,255,255,0.85)`, stroke to `rgba(255,255,255,0.6)`, add `filter: drop-shadow(0 4px 24px rgba(46,134,171,0.15))`.
- Interactive body areas: same white fill when intensity=0 (via updated `intensityColors[0]` being transparent over white base), apply `filter="url(#glow)"` only when intensity > 0 via a separate `<g>` layer.
- Architectural approach: render body parts in two layers — base white silhouette underneath, then heat overlay paths on top with blur filter when active.

**Hydration aura** (new, after body paths): When `showHydrationAura` is true, render a diagonal SVG path:
```tsx
{showHydrationAura && (
  <path
    d="M60 90 Q90 180 120 250 Q140 320 155 380"
    fill="none"
    stroke="rgba(46,134,171,0.55)"
    strokeWidth="18"
    strokeLinecap="round"
    filter="url(#auraBlur)"
  />
)}
```
With a second filter `<filter id="auraBlur"><feGaussianBlur stdDeviation="6"/></filter>` in `<defs>`.

**Legend colors** (lines 142–145): Update to match new palette (amber, orange, red).

### 2. Usage sites — Add `showHydrationAura={true}` for in-journey contexts

Since `HeatMapInteractive` is NOT directly in Today.tsx or Profile.tsx, the aura prop goes to the sub-components that render it during the journey (not onboarding):

- **`src/components/journey/touchpoints/NightSlot.tsx`** (lines 55, 75): Add `showHydrationAura`
- **`src/components/journey/DayReview.tsx`** (lines 185, 428): Add `showHydrationAura`
- **`src/components/journey/Day5Dashboard.tsx`** (lines 130, 135): Add `showHydrationAura`
- **`src/components/journey/HeatMapComparative.tsx`** (lines 96, 133, 139): Add `showHydrationAura`
- **`src/components/journey/Day1Flow.tsx`** (lines 271, 313): Add `showHydrationAura`

Onboarding.tsx (line 400) stays without the prop — no aura during onboarding.

## Files modified
- `src/components/journey/HeatMapInteractive.tsx` — visual overhaul + new prop
- `src/components/journey/touchpoints/NightSlot.tsx` — pass `showHydrationAura`
- `src/components/journey/DayReview.tsx` — pass `showHydrationAura`
- `src/components/journey/Day5Dashboard.tsx` — pass `showHydrationAura`
- `src/components/journey/HeatMapComparative.tsx` — pass `showHydrationAura`
- `src/components/journey/Day1Flow.tsx` — pass `showHydrationAura`

