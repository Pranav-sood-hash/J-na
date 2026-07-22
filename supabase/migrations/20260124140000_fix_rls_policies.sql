-- Fix Row Level Security policies for portfolio_content and storage.objects
-- Allows content creation and file uploads from the portfolio admin dashboard

-- Drop existing restricted policies on portfolio_content
DROP POLICY IF EXISTS "Admins can create content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Admins can update content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Admins can delete content" ON public.portfolio_content;
DROP POLICY IF EXISTS "Admins can view all content" ON public.portfolio_content;

-- Create permissive policies for portfolio_content
CREATE POLICY "Allow public insert portfolio_content"
  ON public.portfolio_content FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update portfolio_content"
  ON public.portfolio_content FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete portfolio_content"
  ON public.portfolio_content FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public select all portfolio_content"
  ON public.portfolio_content FOR SELECT
  TO anon, authenticated
  USING (true);

-- Drop existing restricted policies on storage.objects
DROP POLICY IF EXISTS "Admins can upload portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio media" ON storage.objects;

-- Create permissive storage policies for portfolio-media bucket
CREATE POLICY "Allow upload portfolio media"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Allow update portfolio media"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Allow delete portfolio media"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'portfolio-media');
