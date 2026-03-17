
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  morning_enabled boolean NOT NULL DEFAULT true,
  evening_enabled boolean NOT NULL DEFAULT true,
  morning_time text NOT NULL DEFAULT '08:00',
  evening_time text NOT NULL DEFAULT '20:00',
  timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notification preferences"
ON public.notification_preferences FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification preferences"
ON public.notification_preferences FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification preferences"
ON public.notification_preferences FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all notification preferences"
ON public.notification_preferences FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
