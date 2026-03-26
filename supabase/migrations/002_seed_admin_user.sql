-- Create admin user
-- Password: par@&006 (you should hash this with bcrypt in production)
INSERT INTO public.users (email, password_hash)
VALUES ('soodpranav235@gmail.com', 'par@&006')
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to the user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM public.users WHERE email = 'soodpranav235@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
