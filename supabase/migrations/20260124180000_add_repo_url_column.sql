-- Add repo_url column to portfolio_content table if it does not exist yet
ALTER TABLE public.portfolio_content ADD COLUMN IF NOT EXISTS repo_url TEXT;
