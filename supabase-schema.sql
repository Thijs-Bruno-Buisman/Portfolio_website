create table if not exists public.profiles (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.evidence (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.evidence enable row level security;

create policy "Public can read profiles"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can write profiles"
  on public.profiles for all
  to authenticated
  using (true)
  with check (true);

create policy "Public can read evidence"
  on public.evidence for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can write evidence"
  on public.evidence for all
  to authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.evidence;
