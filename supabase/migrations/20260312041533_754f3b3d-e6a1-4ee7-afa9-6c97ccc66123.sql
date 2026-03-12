
-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  pain_level TEXT DEFAULT '',
  affected_areas TEXT[] DEFAULT '{}',
  objective TEXT DEFAULT '',
  onboarding_data JSONB DEFAULT '{}',
  challenge_start TIMESTAMPTZ,
  challenge_progress JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Exercises table
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Fácil',
  duration TEXT NOT NULL DEFAULT '5 min',
  frequency TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  start_position TEXT DEFAULT '',
  steps TEXT[] DEFAULT '{}',
  benefits TEXT DEFAULT '',
  safety TEXT DEFAULT '',
  variations TEXT[] DEFAULT '{}',
  icon TEXT DEFAULT 'dumbbell',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tipo_refeicao TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  instructions TEXT[] DEFAULT '{}',
  por_que_resfria TEXT DEFAULT '',
  dica TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  time TEXT DEFAULT '',
  servings TEXT DEFAULT '',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'utensils',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Habits table
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  icon TEXT DEFAULT 'heart',
  modal_content TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users read own, admins read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- User roles: only admins can manage
CREATE POLICY "Admins can read roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Exercises: everyone can read, admins can manage
CREATE POLICY "Anyone can read exercises" ON public.exercises
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage exercises" ON public.exercises
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Recipes: everyone can read, admins can manage
CREATE POLICY "Anyone can read recipes" ON public.recipes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage recipes" ON public.recipes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Habits: everyone can read, admins can manage
CREATE POLICY "Anyone can read habits" ON public.habits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage habits" ON public.habits
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also allow public read for exercises/recipes/habits (for non-logged users browsing)
CREATE POLICY "Public can read active exercises" ON public.exercises
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Public can read active recipes" ON public.recipes
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Public can read active habits" ON public.habits
  FOR SELECT TO anon USING (is_active = true);
