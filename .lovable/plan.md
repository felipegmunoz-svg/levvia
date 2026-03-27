

# Fix Day 1 Bugs + Detail Components + Logo Swaps

## Changes

### 1. `src/components/RecipeDetail.tsx` — Light theme migration
- Line 28: `bg-white/[0.08]` → `bg-muted`
- Line 44: `gradient-page` → remove, keep `px-6 pt-10 pb-8 rounded-b-3xl bg-background`
- Line 55: `bg-white/[0.08]` → `bg-muted`
- Lines 80, 94, 101, 118, 127: `glass-card` → `levvia-card`
- Line 140: `bg-white/[0.08]` → `bg-muted`, `border-white/10` → `border-border`
- Line 149: `border-white/[0.08]` → `border-border`
- Line 152: `gradient-primary text-foreground` → `bg-primary text-primary-foreground`

### 2. `src/components/ExerciseDetail.tsx` — Light theme migration
- Line 19: `gradient-page` → remove, keep `px-6 pt-10 pb-8 rounded-b-3xl bg-background`
- Lines 30, 42: `bg-white/[0.08]` → `bg-muted`
- Lines 51, 73: `border-white/10` → `border-border`
- Lines 120, 133, 143, 152, 162: `glass-card` → `levvia-card`
- Line 134: `gradient-primary` → `bg-primary`, line 135: `text-foreground` → `text-primary-foreground`
- Line 179: `border-white/[0.08]` → `border-border`
- Line 182: `gradient-primary text-foreground` → `bg-primary text-primary-foreground`

### 3. `src/components/journey/Day1Closing.tsx` — Replace alert() with toast
- Add import: `import { toast } from "sonner";`
- Line 72: Replace `alert("Sua jornada continua amanhã. Descanse — você merece.");` with `toast("Sua jornada continua amanhã. Descanse — você merece. 💜");`

### 4. `src/pages/Onboarding.tsx` — Remove confetti from ResultScreen
- Lines 37-65: Delete the entire `useEffect` block that fires confetti
- Line 10: Remove `import confetti from "canvas-confetti";`
- Lines 28-34: Remove `fireConfettiColors` constant

### 5. Logo swaps (white → blue)
- `src/pages/History.tsx`: `logo_livvia_branco_icone` → `logo_livvia_azul_icone`
- `src/pages/Learn.tsx`: `logo_livvia_branco_icone` → `logo_livvia_azul_icone`
- `src/pages/Checkout.tsx`: `logo_livvia_branco` → `logo_livvia_azul`
- `src/pages/ResetPassword.tsx`: `logo_livvia_branco_icone` → `logo_livvia_azul_icone`
- `src/components/InstallPWAPrompt.tsx`: `logo_livvia_branco` → `logo_livvia_azul`
- **NOT changed**: `WaitingScreen.tsx`, `AdminLayout.tsx` (intentionally dark)

## Not changed
- Component logic, data flow, Supabase calls
- Previously corrected journey components
- `src/index.css`

