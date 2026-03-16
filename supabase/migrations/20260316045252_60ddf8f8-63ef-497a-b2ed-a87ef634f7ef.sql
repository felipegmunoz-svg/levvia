ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS video_url text;