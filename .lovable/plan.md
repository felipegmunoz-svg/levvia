

# Fix: Onboarding Data Not Persisting to Database

## Root Cause

The sync between localStorage and the database only happens in `Auth.tsx` during login/signup. But there are two common flows where this fails:

**Flow A (most common):** User signs up FIRST (empty profile created), then Day1Flow redirects them to `/onboarding`. After completing onboarding, they navigate through `/diagnosis` → `/day1-journey` → `/today`. Since they're already authenticated, they never pass through `Auth.tsx` again — the onboarding data stays in localStorage forever.

**Flow B:** Even if the user completes onboarding before signing up, `Day1Flow.tsx` syncs the diary to the database but never syncs the onboarding profile data.

**Evidence:** All 5 most recent profiles in the database have `onboarding_data: {}`, `age: null`, `objectives: []`, etc. — confirming the sync never runs.

## Solution

Add an onboarding sync effect to `Day1Flow.tsx` (or a new helper) that runs when:
1. User is authenticated (`user.id` exists)
2. `levvia_onboarding` exists in localStorage (data hasn't been synced yet)

This reuses the same sync logic from `Auth.tsx`'s `syncProfileData` — reading the localStorage snapshot and updating the `profiles` table with all onboarding fields.

### Files to Change

**1. `src/components/journey/Day1Flow.tsx`**
- Add a `useEffect` that runs on mount (when `user.id` is available)
- Check if `levvia_onboarding` exists in localStorage
- If yes, read all data (same pattern as Auth.tsx's `readOnboardingSnapshot` + `syncProfileData`)
- Update the `profiles` table with: `age`, `sex`, `weight_kg`, `height_cm`, `activity_level`, `health_conditions`, `pain_level`, `affected_areas`, `objectives`, `pantry_items`, and `onboarding_data` (enemies, allies, restrictions, preferences)
- Clear localStorage after successful sync
- This runs BEFORE `determineStep` so the profile is populated for any downstream logic

**2. Extract shared sync function** (optional but cleaner)
- Create `src/lib/syncOnboarding.ts` with the shared logic so both `Auth.tsx` and `Day1Flow.tsx` use the same function
- This avoids code duplication between the two sync points

### Sync Logic (from localStorage to database)

```text
localStorage keys read:
  - levvia_onboarding → answers[2]=name, [3]=age, [4]=sex, [5]=[weight,height],
                         [6]=activity, [7]=conditions, [8]=pain, [9]=areas,
                         [11]=enemies, [12]=allies, [14]=preferences
  - levvia_pantry_items → pantry (backup)
  - levvia_restrictions → restrictions (backup)
  - levvia_objectives → objectives (backup)

Database columns updated:
  - name, age, sex, weight_kg, height_cm, activity_level
  - health_conditions, pain_level, affected_areas
  - objectives, pantry_items
  - onboarding_data: { enemies, allies, restrictions, preferences, raw }
```

### Safety

- Only runs when `levvia_onboarding` exists (won't overwrite data if already synced)
- Clears localStorage only after confirmed database update
- Preserves the triple-backup pattern (pantry, restrictions, objectives) from Auth.tsx

