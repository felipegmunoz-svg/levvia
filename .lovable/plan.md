

# Add BottomNav to All Day Flow Steps

## Summary
Add BottomNav to normal-mode steps in Day1-Day5 flows, and shift sticky bottom buttons up by 68px to avoid overlap. Day6 already has BottomNav via DayTemplate.

## Changes

### 1. Day Flow files — Add BottomNav to normal mode

**`src/components/journey/Day1Flow.tsx`** (lines 312-316)
Wrap each step return in `<>...&lt;BottomNav /&gt;</>`. Already imports BottomNav.

**`src/components/journey/Day2Flow.tsx`** (lines ~178-184)
Same pattern for welcome/drainage/map/meal/night/closing returns. Already imports BottomNav.

**`src/components/journey/Day3Flow.tsx`** (lines ~115-119)
Same pattern for welcome/semaforo/cardapio/closing. Add BottomNav import.

**`src/components/journey/Day4Flow.tsx`** (lines ~143-166)
Add `<BottomNav />` after `</AnimatePresence>` (outside, so it persists across transitions). Already imports BottomNav.

**`src/components/journey/Day5Flow.tsx`** (lines ~171-218)
Same — add `<BottomNav />` after `</AnimatePresence>`. Already imports BottomNav.

**`src/components/journey/Day6Flow.tsx`** — NO CHANGE (DayTemplate already renders BottomNav)

### 2. Sticky buttons — Shift up from `bottom-0` to `bottom-[68px]`

All 13 components with `fixed bottom-0 left-0 right-0` in their action button container:

- `Day4Welcome.tsx` (line 67)
- `Day4SleepHygiene.tsx` (line 110)
- `BreathingCircle.tsx` (line 159)
- `Day4CardapioNoturno.tsx` (line 356)
- `Day4Closing.tsx` (line 93)
- `Day5Welcome.tsx` (line 56)
- `Day5MovementGuide.tsx` (line 138)
- `Day5Lunch.tsx` (line 234)
- `Day5Snack.tsx` (line 230)
- `Day5MicroChallenge.tsx` (line 150)
- `Day5LegsElevation.tsx` (line 208)
- `Day5Journal.tsx` (line 132)
- `Day5Dashboard.tsx` (line 301)
- `Day5Closing.tsx` (line 50)

Each: `fixed bottom-0` → `fixed bottom-[68px]`

### 3. DayTemplate.tsx sticky buttons — already inline (no fixed positioning), no change needed.

## Not changed
- BottomNav.tsx itself
- Component logic, data flow, step transitions
- Review mode (already has BottomNav)
- Onboarding, Auth, Diagnosis, WaitingScreen
- Day6Flow (already covered by DayTemplate)

## Technical note
For Day4/Day5 which use `<AnimatePresence>`, placing `<BottomNav />` as a sibling after `</AnimatePresence>` (wrapped in a fragment) ensures it renders persistently without being affected by step transitions.

