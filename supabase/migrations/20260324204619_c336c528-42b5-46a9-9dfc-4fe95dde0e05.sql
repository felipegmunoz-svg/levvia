ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day5_completed boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day5_completed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS day5_movement_data jsonb;