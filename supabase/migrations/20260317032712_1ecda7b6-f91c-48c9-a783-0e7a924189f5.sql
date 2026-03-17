
-- Tabela de módulos educativos
CREATE TABLE public.learn_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day integer NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  content_paragraphs text[] NOT NULL DEFAULT '{}',
  surprising_fact text NOT NULL DEFAULT '',
  practical_tip text NOT NULL DEFAULT '',
  reflection_question text NOT NULL DEFAULT '',
  icon text DEFAULT 'book-open',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.learn_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active learn_modules" ON public.learn_modules
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Public can read active learn_modules" ON public.learn_modules
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Admins can manage learn_modules" ON public.learn_modules
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Tabela de progresso do módulo
CREATE TABLE public.user_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.learn_modules(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own module progress" ON public.user_module_progress
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own module progress" ON public.user_module_progress
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage module progress" ON public.user_module_progress
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Tabela de diário de sintomas
CREATE TABLE public.symptom_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  pain_level integer NOT NULL DEFAULT 0,
  swelling text DEFAULT 'Nenhum',
  mood text DEFAULT 'Neutro',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own symptom entries" ON public.symptom_entries
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own symptom entries" ON public.symptom_entries
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own symptom entries" ON public.symptom_entries
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
