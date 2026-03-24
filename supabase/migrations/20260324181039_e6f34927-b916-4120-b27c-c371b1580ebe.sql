ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day4_completed boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day4_completed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day4_sleep_data jsonb;