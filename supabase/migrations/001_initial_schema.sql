-- Create app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create users table (if not using Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$ LANGUAGE SQL;

-- Create portfolio_items table (for admin to manage)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  project_url VARCHAR(500),
  github_url VARCHAR(500),
  technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.users(id)
);

-- Create admin user with email and hashed password
-- INSERT INTO public.users (email, password_hash)
-- VALUES ('soodpranav235@gmail.com', 'par@&006');

-- Assign admin role to the user
-- Note: First create the user, then get their ID and insert into user_roles
-- This is a placeholder - execute after creating the user:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM public.users WHERE email = 'soodpranav235@gmail.com';

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- RLS Policies for user_roles table
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for portfolio_items table
CREATE POLICY "Anyone can view portfolio items" ON public.portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create portfolio items" ON public.portfolio_items
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update portfolio items" ON public.portfolio_items
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete portfolio items" ON public.portfolio_items
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_portfolio_items_created_by ON public.portfolio_items(created_by);
CREATE INDEX idx_portfolio_items_created_at ON public.portfolio_items(created_at DESC);
