
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS day6_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day6_completed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS day6_spice_data jsonb;
