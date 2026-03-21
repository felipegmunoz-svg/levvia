ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day2_completed boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day2_completed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day2_inflammation_map jsonb DEFAULT '{}'::jsonb;