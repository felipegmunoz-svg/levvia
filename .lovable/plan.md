

# Fix hydration modal buttons hidden behind bottom nav

## Change

In `src/components/journey/DayTouchpointView.tsx`, line 391, add safe-area-aware bottom padding to the modal's inner container so buttons are never covered by the bottom nav.

**Line 391** — change:
```tsx
<div className="w-full max-w-md bg-levvia-surface rounded-2xl p-6 shadow-xl">
```
to:
```tsx
<div className="w-full max-w-md bg-levvia-surface rounded-2xl p-6 shadow-xl" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 64px))' }}>
```

This ensures the button area clears both the BottomNav (68px) and any iOS/Android safe area inset.

## Files modified
- `src/components/journey/DayTouchpointView.tsx` (line 391)

