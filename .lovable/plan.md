

# Add Sequential Slot Locking to DayTouchpointView

## Summary
Prevent users from opening a later touchpoint slot without completing all prior ones. Adds both logical blocking (can't expand) and visual feedback (dimmed + disabled).

## Changes in `src/components/journey/DayTouchpointView.tsx`

### 1. Add `SLOT_ORDER` and `canExpandSlot` helper (after `CHECKPOINT_DAYS`, ~line 56)
Constants and function to check if all previous slots are done before allowing expansion.

### 2. Replace `toggleSlot` function (~line 82)
Add guard: if not in review mode, slot not done, and previous slots incomplete → silently block.

### 3. Update card header button (~line 120)
Add `disabled` prop and conditional `opacity-40 cursor-not-allowed` classes for locked slots.

## Files modified
- `src/components/journey/DayTouchpointView.tsx` — 3 surgical edits

