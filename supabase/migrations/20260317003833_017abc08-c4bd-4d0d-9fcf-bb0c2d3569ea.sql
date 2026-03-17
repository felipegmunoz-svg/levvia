
-- Plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  price_cents integer NOT NULL,
  interval text NOT NULL DEFAULT 'month',
  interval_count integer NOT NULL DEFAULT 1,
  trial_days integer NOT NULL DEFAULT 7,
  is_active boolean NOT NULL DEFAULT true,
  features text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id),
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  trial_end timestamptz,
  canceled_at timestamptz,
  payment_method text DEFAULT 'manual',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans policies
CREATE POLICY "Anyone can read active plans" ON public.plans FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Public can read active plans" ON public.plans FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Subscriptions policies
CREATE POLICY "Users can read own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Seed default plans
INSERT INTO public.plans (name, slug, price_cents, interval, interval_count, trial_days, features, sort_order) VALUES
  ('Mensal', 'monthly', 2990, 'month', 1, 7, ARRAY['Plano alimentar personalizado','Exercícios adaptados ao seu nível','Checklist diário de hábitos','Acompanhamento de progresso'], 1),
  ('Trimestral', 'quarterly', 6990, 'quarter', 3, 7, ARRAY['Tudo do plano mensal','Economia de 22%','Receitas exclusivas','Suporte prioritário'], 2),
  ('Anual', 'annual', 19990, 'year', 12, 7, ARRAY['Tudo do plano trimestral','Economia de 44%','Conteúdos antecipados','Acesso vitalício a atualizações'], 3);
