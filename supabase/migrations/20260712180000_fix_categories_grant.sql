-- Grant write permissions on categories to authenticated users.
-- The RLS policy already restricts writes to admins only; this grant
-- allows Postgres to even attempt the operation before checking RLS.
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;

-- Ensure the admin user has the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'deematelephoni@gmail.com'
ON CONFLICT DO NOTHING;
