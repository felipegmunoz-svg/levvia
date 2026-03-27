

# Migrate Onboarding, Auth & Diagnosis to Light Theme

## Summary
Add `.theme-light` wrapper and replace all hardcoded dark-theme classes in these 3 pages. Blue logos already exist in `src/assets/`.

## Changes

### 1. `src/pages/Onboarding.tsx`

**Line 11** — Logo import: `logo_livvia_branco.png` → `logo_livvia_azul.png`

**Line 939** — Root div: add `theme-light`, remove `gradient-page`:
```tsx
<div className="theme-light min-h-screen bg-background flex flex-col">
```

**Line 960** — Progress bar track: `bg-white/10` → `bg-muted`

**Lines 535, 584, 651, 727, 762, 872** — Icon containers: `gradient-primary` → `bg-primary`
**Lines 537, 586, 653, 729, 764, 874** — Heart/icon inside: `text-foreground` → `text-primary-foreground`

**Line 75** (ResultScreen) — `bg-white/[0.06] border border-white/10` → `bg-muted border border-border`
**Line 92** — `glass-card` → `levvia-card`

**Line 505** (disclaimer) — `border-white/10 bg-white/[0.06]` → `border-border bg-muted`

**Line 566** (name input) — `border-white/10 bg-white/[0.06]` → `border-border bg-muted`, remove `backdrop-blur-[10px]`
**Line 618** (number input) — same
**Lines 685, 698** (body_metrics inputs) — same

**Lines 817-818** (pantry unselected) — `bg-white/[0.06] text-muted-foreground border-white/10 hover:border-white/20` → `bg-muted text-muted-foreground border-border hover:border-primary/30`

**Line 834** (pantry custom input container) — `border-white/10 bg-white/[0.06]` → `border-border bg-muted`
**Line 844** (textarea) — `border-white/10 bg-white/[0.04]` → `border-border bg-muted`

**Lines 914-917** (single/multi options unselected) — `border-white/10 bg-white/[0.06] hover:border-secondary/30` → `border-border bg-muted hover:border-secondary/30`

**Lines 1003-1006** (CTA button):
- Enabled: `gradient-primary text-foreground` → `bg-primary text-primary-foreground`
- Disabled: `bg-white/[0.06] text-muted-foreground` → `bg-muted text-muted-foreground`

### 2. `src/pages/Auth.tsx`

**Line 11** — Logo import: `logo_livvia_branco_icone.png` → `logo_livvia_azul_icone.png`

**Line 111** — Root div: add `theme-light`:
```tsx
<div className="theme-light min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
```

**Line 125** — Success circle: `gradient-primary` → `bg-primary`
**Line 127** — Check icon: `text-foreground` → `text-primary-foreground`

**Line 152** — Logo container: `gradient-primary` → `bg-primary`

**Lines 178, 196, 210, 236** — Input fields: `bg-white/[0.06] border-white/10` → `bg-muted border-border`

**Line 251** — Submit button: `gradient-primary text-foreground` → `bg-primary text-primary-foreground`

### 3. `src/pages/Diagnosis.tsx`

**Line 11** — Logo import: `logo_livvia_branco.png` → `logo_livvia_azul.png`

**Line 83** — Root div: remove `gradient-page`, add `theme-light`:
```tsx
<div className="theme-light min-h-screen bg-background flex flex-col">
```

**Lines 111, 136, 170, 211, 228, 271, 288** — `glass-card` → `levvia-card`

**Line 117** — `bg-white/[0.06]` → `bg-muted`

**Lines 143, 150, 178, 184, 190, 196** — `bg-white/[0.04]` → `bg-muted`
**Line 143** — `border border-white/10` → `border border-border`

**Line 323** — `bg-white/[0.08]` → `bg-muted`

**Lines 341-342** — CTA gradient background:
```tsx
background: "linear-gradient(135deg, hsl(174 63% 47% / 0.08), hsl(196 58% 42% / 0.12))"
```

**Line 384** — CTA button: `gradient-primary text-foreground` → `bg-primary text-primary-foreground`

## Files changed
- `src/pages/Onboarding.tsx` — ~20 class replacements + logo swap
- `src/pages/Auth.tsx` — ~8 class replacements + logo swap
- `src/pages/Diagnosis.tsx` — ~15 class replacements + logo swap

## Not changed
- Component logic, data flow, Supabase calls
- `src/components/journey/*` (already fixed)
- `src/index.css` (already correct)
- WaitingScreen (stays dark)

