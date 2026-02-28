-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) to create the api_keys table.

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key text not null,
  type text not null default 'dev' check (type in ('dev', 'prod')),
  usage integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Optional: enable Row Level Security if you want per-user keys later
-- alter table public.api_keys enable row level security;

-- Optional: create policy for service role (full access)
-- create policy "Service role has full access" on public.api_keys
--   for all using (true) with check (true);
