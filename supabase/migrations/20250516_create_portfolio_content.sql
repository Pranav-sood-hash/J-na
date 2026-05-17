-- Create portfolio_content table
create table if not exists public.portfolio_content (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('certificate', 'video', 'website')),
  title text not null,
  description text,
  media_url text,
  external_link text,
  tags text[] default null,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists idx_portfolio_content_type on public.portfolio_content(type);
create index if not exists idx_portfolio_content_visible on public.portfolio_content(is_visible);
create index if not exists idx_portfolio_content_created_at on public.portfolio_content(created_at desc);

-- Enable RLS (Row Level Security)
alter table public.portfolio_content enable row level security;

-- Create policy for public read access
create policy "Enable public read access" on public.portfolio_content
  for select using (is_visible = true);

-- Create policy for authenticated write access
create policy "Enable authenticated insert" on public.portfolio_content
  for insert with check (true);

create policy "Enable authenticated update" on public.portfolio_content
  for update using (true) with check (true);

create policy "Enable authenticated delete" on public.portfolio_content
  for delete using (true);

-- Create a trigger to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_trigger
  before update on public.portfolio_content
  for each row
  execute function public.handle_updated_at();
