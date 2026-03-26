

# Reset Journey Progress — Migration

## What
Run a single UPDATE to reset all journey progress for `felipegmunoz@gmail.com`, keeping profile data (name, age, email, etc.) intact.

## Corrected SQL

```sql
UPDATE profiles 
SET 
  day1_completed = false,
  day1_completed_at = null,
  day1_welcome_shown = false,
  heat_map_day1 = '{}'::jsonb,
  day2_completed = false,
  day2_completed_at = null,
  day2_inflammation_map = '{}'::jsonb,
  day3_completed = false,
  day3_completed_at = null,
  day4_completed = false,
  day4_completed_at = null,
  day4_sleep_data = null,
  day5_completed = false,
  day5_completed_at = null,
  day5_movement_data = null,
  day6_completed = false,
  day6_completed_at = null,
  day6_spice_data = null,
  challenge_start = NOW(),
  challenge_progress = '{}'::jsonb
WHERE email = 'felipegmunoz@gmail.com';
```

## Column name fixes from your query
| Your query | Actual column |
|---|---|
| `day1_done` | `day1_completed` |
| `heat_map_day2` | `day2_inflammation_map` |
| `day3_food_traffic_light` | (doesn't exist) |

## Method
- Database migration tool (only way to run UPDATE)
- Single migration, one statement
- Profile data (name, email, age, phone, onboarding_data, etc.) untouched

