

# LipeVida - Corrections and Refinements

## Summary
After reviewing the entire codebase, most features are already implemented in the source code. However, there are some issues that need attention to ensure everything works correctly at runtime. Below are the specific fixes needed.

---

## 1. Onboarding Fixes

### 1.1 Disclaimer Checkbox (Screen 2)
**Status:** Code exists but may have visibility issues.
**Fix:** Ensure the checkbox button has proper contrast and visibility. The `canProceed()` logic already gates on `disclaimerChecked`, and the button styling already toggles between enabled/disabled states. Will verify the border/background colors render correctly against the background.

### 1.2 Fire Result Screen (Screen 6 - step index 5)
**Status:** Code exists -- the `result` type renders the fire result screen. The `painAnswer` reads from `answers[3]` which is the pain level question at step index 3.
**Fix:** Verify the flow doesn't skip this screen. The `onboardingSteps` array has the result at index 5 (id=5, type="result"), and the step increments sequentially, so it should display. No code change needed unless a specific bug is found during testing.

### 1.3 Objective Screen (Screen 9 - step index 8)
**Status:** Already configured as `type: "single"` in `onboarding.ts` (line 91). The render logic uses `handleSingleSelect` for single type, showing radio-style (rounded-full) indicators.
**Fix:** Already correct. No change needed.

### 1.4 Final Screen Personalization (Screen 10 - step index 9)
**Status:** Code at line 168 already personalizes with `userName` and `userObjective`.
**Fix:** Also personalize the Dashboard "Hoje" header to show the user's name and objective on first visit after onboarding. Add a welcome message in the Today page that reads from `localStorage` onboarding data to display: "Ola, [Nome]! Seu objetivo principal e [Objetivo]."

---

## 2. Dashboard "Hoje" Fixes

### 2.1 Motivational Phrase
**Status:** Already implemented with `getDailyPhrase()` which rotates based on day of year.
**Fix:** No change needed -- phrases already rotate daily.

### 2.2 Checklist Interactivity
**Status:** Already implemented -- modal popups for "modal" type items, navigation for "exercise"/"recipe" type items.
**Fix:** One issue: when navigating to exercises/recipes, the checkbox doesn't get marked because `return` happens before `setChecked`. Move the `setChecked` call before navigation so items get checked AND navigate. This is the bug at lines 38-43 in Today.tsx.

### 2.3 Dynamic Greeting
**Status:** Already implemented at line 55-60 of Today.tsx.
**Fix:** No change needed.

---

## 3. Practices Tab Fixes

### 3.1 Recipe "Modo de Fazer"
**Status:** Already implemented in RecipeDetail.tsx (lines 57-71) showing instructions with numbered steps.
**Fix:** No change needed.

### 3.2 Tag Filtering
**Status:** Already implemented in Practices.tsx with `activeTag` state and filter logic.
**Fix:** No change needed.

---

## Technical Changes Required

### File: `src/pages/Today.tsx`
1. **Fix checkbox marking before navigation**: Move `setChecked` before the navigation `return` statements so exercise/recipe items get checked when clicked
2. **Add personalized welcome card**: Show a dismissible welcome card after onboarding with user name and chosen objective

### File: `src/pages/Onboarding.tsx`
3. **Ensure disclaimer visibility**: Add a slightly more visible border/styling to the disclaimer checkbox area so it stands out clearly on the screen

These are the only actual code changes needed -- the rest of the functionality is already properly implemented.

