
-- Add Day 1 journey fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS day1_welcome_shown boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS heat_map_day1 jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS day1_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS day1_completed_at timestamptz;

-- Create daily_diary table
CREATE TABLE public.daily_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  day_number integer NOT NULL,
  leg_sensation text,
  guilt_before integer,
  guilt_after integer,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_diary ENABLE ROW LEVEL SECURITY;

-- Users can insert own entries
CREATE POLICY "Users can insert own diary entries"
  ON public.daily_diary FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can read own entries
CREATE POLICY "Users can read own diary entries"
  ON public.daily_diary FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Users can update own entries
CREATE POLICY "Users can update own diary entries"
  ON public.daily_diary FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all
CREATE POLICY "Admins can manage diary entries"
  ON public.daily_diary FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
