

## Analysis of Current Flow

**Current flow:**
1. User opens app → redirected to `/onboarding`
2. Fills full anamnesis (17 steps: welcome, disclaimer, name, age, sex, body metrics, activity, conditions, pain, areas, fire result, diet enemies/allies, objective, restrictions, preferences, final)
3. On completion → saves to Supabase profile (requires `user` to be logged in) → goes to `/today`
4. BUT: `/today` is protected → redirects to `/auth` if not logged in
5. Problem: onboarding saves data to Supabase requiring auth, but user hasn't created account yet

**The user wants:** Account creation should happen AFTER the diagnosis/result screen, AFTER plan selection, and right before payment.

## Proposed New Flow

```text
CURRENT                              PROPOSED
─────────                            ────────
1. Onboarding (anamnese)             1. Onboarding (anamnese) — NO AUTH
2. → /auth (create account)         2. Fire Result (diagnosis)
3. → /today (protected)             3. Plan Selection (new page)
                                     4. → /auth (create account)
                                     5. → Payment (Stripe)
                                     6. → /today (protected)
```

### Detailed Steps

**Step 1 — Onboarding stays public (no auth required)**
- Keep all 17 steps as-is
- On final step, save answers to `localStorage` only (remove Supabase save)
- Navigate to a new `/plans` page instead of `/today`

**Step 2 — New `/plans` page (public, no auth)**
- Shows the user's Fire Result summary at the top (from localStorage)
- Displays 2-3 subscription plans (e.g., "Plano Mensal", "Plano Trimestral", "Plano Anual")
- Each plan card shows price, features, and a CTA button
- Clicking a plan stores the selection in localStorage and navigates to `/auth`

**Step 3 — Auth page (create account)**
- Already exists, no major changes
- After successful signup/login, redirect to `/checkout` instead of `/today`
- Pass the selected plan forward

**Step 4 — Post-auth: save onboarding data + redirect**
- After auth completes, save the localStorage onboarding data to the Supabase profile
- Then redirect to payment or `/today` (depending on Stripe integration readiness)

### Implementation Changes

1. **`src/pages/Onboarding.tsx`** — Remove Supabase save on completion; save only to localStorage; navigate to `/plans` instead of `/today`

2. **`src/pages/Plans.tsx`** (new) — Public plan selection page showing fire result + subscription options; stores selection in localStorage; navigates to `/auth`

3. **`src/pages/Auth.tsx`** — After login/signup, check for pending onboarding data in localStorage; save it to Supabase profile; then redirect to `/today` (or `/checkout` when Stripe is ready)

4. **`src/pages/Index.tsx`** — Update redirect logic: if not onboarded → `/onboarding`; if onboarded but not logged in → `/plans`; if logged in → `/today`

5. **`src/App.tsx`** — Add `/plans` route (public)

6. **`src/components/ProtectedRoute.tsx`** — No changes needed

### Key Decisions to Confirm

This plan assumes:
- Plan selection page is a placeholder for now (prices/plans defined statically) since Stripe integration comes later
- After signup, the onboarding data saved in localStorage gets synced to the Supabase profile automatically
- The "diagnosis" (Fire Result) is already shown during onboarding step 10 — no need for a separate diagnosis page

