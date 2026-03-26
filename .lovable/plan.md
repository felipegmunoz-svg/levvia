

# Fix: Day Flow Components Missing theme-light

## Problem
`theme-light` is only applied to the **dashboard** view (line 384 of Today.tsx). When a Day flow renders (Day1Flow → Day1Welcome, Day1Closing, etc.), those components use `bg-background` and `text-foreground` which resolve to the **dark** `:root` variables because they're rendered **outside** the `theme-light` wrapper.

The Day flow components (Day1Welcome, Day1Closing, HeatMapInteractive, Day2Welcome, etc.) all use:
- `bg-background` → dark navy
- `text-foreground` → light gray  
- `gradient-primary` → dark gradient

## Solution
Wrap **each Day flow render** in Today.tsx with `theme-light`, and also add `theme-light` to the Day flow components' own root wrappers.

### Changes

**1. `src/pages/Today.tsx` — Wrap Day flow renders (lines ~320-348)**

Each Day flow assignment needs wrapping:
```tsx
content = <div className="theme-light"><Day1Flow onComplete={...} /></div>;
content = <div className="theme-light"><Day2Flow onComplete={...} /></div>;
// ... same for Day3-6
```

**2. `src/components/journey/Day1Welcome.tsx`**
Change line 10:
```tsx
<div className="theme-light min-h-screen bg-background ...">
```

**3. `src/components/journey/Day1Closing.tsx`**
Add `theme-light` to both render paths' root divs.

**4. `src/components/journey/Day1Flow.tsx`**
Add `theme-light` to loading spinner div (line 306).

**5. Same pattern for Day2-6 Welcome/Closing/Flow components**
Each component that renders `bg-background` or `text-foreground` at its root needs `theme-light` on its outermost div.

### Simpler alternative (recommended)
Instead of editing 15+ component files, wrap **once** in Today.tsx around the entire render:

In Today.tsx, find the final `return` and wrap `content` in a theme-light div:
```tsx
return (
  <div className="theme-light">
    {content}
  </div>
);
```

This single wrapper ensures ALL content rendered by Today.tsx (Day flows, dashboard, exercise details, recipe details, loading spinner) inherits the light theme variables. One line change instead of 15+ files.

### Files
- `src/pages/Today.tsx` — wrap final return in `<div className="theme-light">{content}</div>`

