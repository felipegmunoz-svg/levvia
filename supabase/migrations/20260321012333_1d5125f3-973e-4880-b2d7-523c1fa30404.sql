
CREATE TABLE public.daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data_checkin DATE NOT NULL DEFAULT CURRENT_DATE,
  intensidade TEXT NOT NULL,
  regiao TEXT NOT NULL,
  ambiente TEXT NOT NULL,
  exercicios_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_check_ins_one_per_day ON public.daily_check_ins(user_id, data_checkin);

ALTER TABLE public.daily_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own check-ins"
  ON public.daily_check_ins FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own check-ins"
  ON public.daily_check_ins FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own check-ins"
  ON public.daily_check_ins FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage check-ins"
  ON public.daily_check_ins FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
