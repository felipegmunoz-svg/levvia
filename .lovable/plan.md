

# Fix hydration modal: buttons hidden behind bottom nav

## Problem
The overlay already uses `items-end`, so the modal sits at the bottom. The `paddingBottom` style on the card's inner container doesn't help — the card itself needs to be pushed above the BottomNav (68px height).

## Changes — `src/components/journey/DayTouchpointView.tsx`

### Line 390 — Add `pb-20` to overlay
Change:
```tsx
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-4">
```
To:
```tsx
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 pb-20">
```

### Line 391 — Remove the inline `paddingBottom` style
Change:
```tsx
<div className="w-full max-w-md bg-levvia-surface rounded-2xl p-6 shadow-xl" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 64px))' }}>
```
To:
```tsx
<div className="w-full max-w-md bg-levvia-surface rounded-2xl p-6 shadow-xl">
```

`pb-20` (80px) on the overlay ensures the modal card clears the BottomNav (68px) plus safe-area on all devices.

## Files modified
- `src/components/journey/DayTouchpointView.tsx` (lines 390–391)

