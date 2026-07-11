-- Newsletter Subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can read subscribers
CREATE POLICY "Admins read subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert their own email (subscribe)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admins can update/delete
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
