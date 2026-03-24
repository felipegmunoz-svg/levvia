ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day3_completed boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day3_completed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_premium boolean NOT NULL DEFAULT false;