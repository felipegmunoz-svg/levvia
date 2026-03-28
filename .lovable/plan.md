

# Fix Back Button Stuck on Step 8 (install_pwa auto-skip)

## Root Cause

The `install_pwa` step is at array index 7. When a user presses "Back" from index 8, they land on index 7 (install_pwa). The `useEffect` on line 364 fires immediately and auto-skips **forward** to index 8 again — creating an infinite loop where the user can never go past this step backward.

The `handleBack` function itself (line 325) is fine — the problem is the `useEffect` re-advancing the step.

## Fix

Update the `useEffect` (line 364) to only auto-skip when navigating **forward** (i.e., `direction > 0`). When `direction` is `-1` (back), skip **backward** instead:

```ts
useEffect(() => {
  const currentStep = onboardingSteps[step];
  if (currentStep?.type !== "install_pwa") return;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
  const dismissed = localStorage.getItem("levvia_install_dismissed") === "true";

  if (!isMobile || isStandalone || dismissed) {
    console.log("⏭️ Auto-skip install_pwa step");
    if (direction > 0) {
      setStep((s) => s + 1);
    } else {
      setStep((s) => s - 1);
    }
  }
}, [step]);
```

This way, pressing Back through the PWA step skips it backward to the previous screen instead of bouncing forward.

## Files modified
- `src/pages/Onboarding.tsx` — 1 edit (useEffect auto-skip logic, ~6 lines changed)

