

# Fix Light Theme in Journey Components

## Problem
Journey components use hardcoded dark-theme classes (`gradient-primary`, `glass-card`, `border-white/*`, `bg-white/[0.0x]`) that are invisible or illegible when `.theme-light` is active.

## Changes

### 1. `src/index.css` — Global border fix
Line 83: Change `* { @apply border-white/10; }` → `* { @apply border-border; }`

### 2. Replace `gradient-primary text-foreground` → `bg-primary text-primary-foreground` in CTA buttons

**Files (26 total with gradient-primary):**
- Day1Welcome.tsx, Day1Closing.tsx, Day1ClosingPublic.tsx, Day1MealSuggestion.tsx
- Day2Welcome.tsx, Day2MealSuggestion.tsx
- Day3Welcome.tsx, Day3CardapioPersonalizado.tsx
- Day4Welcome.tsx, Day4CardapioNoturno.tsx, Day4SleepHygiene.tsx
- Day5Dashboard.tsx, Day5Lunch.tsx, Day5MicroChallenge.tsx, Day5Snack.tsx, Day5LegsElevation.tsx, Day5MovementGuide.tsx
- Day6Flow.tsx
- BreathingCircle.tsx, FoodTrafficLight.tsx, HeatMapInteractive.tsx
- PaywallModal.tsx, DiaryReflection.tsx, DayReview.tsx, Day2DrainageGuide.tsx, Day2NightRitual.tsx, Day2Closing.tsx, Day3Closing.tsx, Day4Closing.tsx, Day5Closing.tsx, Day2InflammationMap.tsx

Also replace disabled state `bg-white/[0.06]` → `bg-muted` and `bg-white/10` → `bg-muted`

### 3. Replace `glass-card` → `levvia-card` (21 files)
- Day2Welcome.tsx, Day2DrainageGuide.tsx, Day3Closing.tsx
- Day5Dashboard.tsx, Day5MicroChallenge.tsx, Day5LegsElevation.tsx
- And all other files found in the search above

### 4. Replace `border-white/5`, `border-white/10`, `border-white/20`, `border-white/[0.06]` → `border-border` (15 files)
Includes sticky footer patterns and form inputs.

### 5. Replace `bg-white/[0.04]`, `bg-white/[0.05]`, `bg-white/[0.06]`, `bg-white/[0.08]` → `bg-muted` 
In form fields, unselected buttons, and decorative containers (7 files).

## What stays unchanged
- `:root` CSS variables (dark theme preserved for Auth/Onboarding)
- `.theme-light` block in index.css
- All pages (`Today.tsx`, `Journey.tsx`, etc.)
- Component logic and structure
- `WaitingScreen.tsx` (intentionally dark)

## Technical detail
All replacements use Tailwind's CSS-variable-based classes (`bg-primary`, `border-border`, `bg-muted`) which automatically resolve to the correct color based on whether `.theme-light` is active or not. This makes components work correctly in both dark (Auth) and light (Journey) contexts.

