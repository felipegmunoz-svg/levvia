

# Motor de Alívio Dinâmico

## Overview

Replace the current static `PainReliefMode` component with a dynamic 3-question check-in flow that queries exercises from the database based on the user's current state, saves history, and supports repeating yesterday's exercises.

## Database Changes

**New table: `daily_check_ins`**
- `id` UUID PK
- `user_id` UUID NOT NULL
- `data_checkin` DATE NOT NULL DEFAULT CURRENT_DATE
- `intensidade` TEXT NOT NULL
- `regiao` TEXT NOT NULL
- `ambiente` TEXT NOT NULL
- `exercicios_ids` UUID[]
- `created_at` TIMESTAMPTZ DEFAULT NOW()
- Unique index on `(user_id, data_checkin)`
- RLS: users can insert/select/update own rows, admins can manage all

## File Changes

### 1. New: `src/components/MotorAlivio.tsx`

Main component with 3 states:
- **Initial check**: queries `daily_check_ins` for today/yesterday. If today exists → show results. If yesterday exists → offer "Repeat" or "New check-in". Otherwise → start questions.
- **3-question flow**: animated step-by-step cards (intensidade → regiao → ambiente) with a 3-segment progress bar.
- **Results**: list of 3-5 filtered exercises with fallback logic (relax environment first, then region, never pain). Includes crisis alert if 3+ consecutive days of "crise".

Query logic:
```text
pain_suitability filtered by intensidade map
body_part filtered by regiao map (overlaps)
environment filtered by ambiente map (overlaps)
Fallback: drop environment → drop region → never drop pain
```

Saves check-in to `daily_check_ins` after fetching results.

### 2. Modified: `src/pages/Today.tsx`

- Replace `<PainReliefMode>` with `<MotorAlivio>` in the same location (~line 299-303)
- Wire `onSelectExercise` the same way for exercise detail view

### 3. Modified: `src/lib/profileEngine.ts`

- Add `pain_suitability`, `body_part`, `environment`, `movement_type` fields to `DbExercise` interface (they exist in DB but not in the TS type)

## Design

Follows existing app patterns:
- `glass-card` styling, `motion` animations from framer-motion
- Full-screen overlay like current `PainReliefMode`
- Color-coded option cards: red for crisis, yellow for tired, green for energy
- Crisis alert: soft card with warning icon if 3+ consecutive crisis days

## No changes needed
- No edge functions
- No auth changes
- Existing exercises table schema already has all needed columns

