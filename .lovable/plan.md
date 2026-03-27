

# Add Celebration Route and Day 14 Redirect

## Summary
Two surgical edits: add the `/celebration` route in App.tsx and redirect users there after completing Day 14's night slot in Today.tsx.

## Changes

### 1. `src/App.tsx`
- Add `import Celebration from "./pages/Celebration";` with other page imports
- Add route `<Route path="/celebration" element={<ProtectedRoute><Celebration /></ProtectedRoute>} />` after the `/today` route

### 2. `src/pages/Today.tsx`
- In `handleSlotComplete`, replace the night slot block to check if `effectiveDay === 14`: if so, show a congratulations toast and navigate to `/celebration` after 2 seconds; otherwise show the existing "continue tomorrow" toast

## Files modified
- `src/App.tsx` — 2 additions (import + route)
- `src/pages/Today.tsx` — Replace ~5 lines in handleSlotComplete

