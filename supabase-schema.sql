-- Run this script in the Supabase SQL Editor.
-- It is safe to run again: existing tables are kept and policies are replaced.

create table if not exists public.portfolio_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

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

insert into storage.buckets (id, name, public, file_size_limit)
values ('evidence-files', 'evidence-files', true, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

alter table public.portfolio_owners enable row level security;
alter table public.profiles enable row level security;
alter table public.evidence enable row level security;

-- The browser calls this function to decide whether to show edit controls.
-- SECURITY DEFINER lets the function check the private owner table.
create or replace function public.is_portfolio_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.portfolio_owners
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_owner() from public;
grant execute on function public.is_portfolio_owner() to authenticated;

revoke all on table public.portfolio_owners from anon, authenticated;
grant select on table public.profiles, public.evidence to anon, authenticated;
grant insert, update, delete on table public.profiles, public.evidence to authenticated;

drop policy if exists "Public can read profiles" on public.profiles;
drop policy if exists "Authenticated users can write profiles" on public.profiles;
drop policy if exists "Portfolio owner can insert profiles" on public.profiles;
drop policy if exists "Portfolio owner can update profiles" on public.profiles;
drop policy if exists "Portfolio owner can delete profiles" on public.profiles;

create policy "Public can read profiles"
  on public.profiles for select
  to anon, authenticated
  using (true);
create policy "Portfolio owner can insert profiles"
  on public.profiles for insert
  to authenticated
  with check ((select public.is_portfolio_owner()));
create policy "Portfolio owner can update profiles"
  on public.profiles for update
  to authenticated
  using ((select public.is_portfolio_owner()))
  with check ((select public.is_portfolio_owner()));
create policy "Portfolio owner can delete profiles"
  on public.profiles for delete
  to authenticated
  using ((select public.is_portfolio_owner()));

drop policy if exists "Public can read evidence" on public.evidence;
drop policy if exists "Authenticated users can write evidence" on public.evidence;
drop policy if exists "Portfolio owner can insert evidence" on public.evidence;
drop policy if exists "Portfolio owner can update evidence" on public.evidence;
drop policy if exists "Portfolio owner can delete evidence" on public.evidence;

create policy "Public can read evidence"
  on public.evidence for select
  to anon, authenticated
  using (true);
create policy "Portfolio owner can insert evidence"
  on public.evidence for insert
  to authenticated
  with check ((select public.is_portfolio_owner()));
create policy "Portfolio owner can update evidence"
  on public.evidence for update
  to authenticated
  using ((select public.is_portfolio_owner()))
  with check ((select public.is_portfolio_owner()));
create policy "Portfolio owner can delete evidence"
  on public.evidence for delete
  to authenticated
  using ((select public.is_portfolio_owner()));

drop policy if exists "Public can read evidence files" on storage.objects;
drop policy if exists "Portfolio owner can upload evidence files" on storage.objects;
drop policy if exists "Portfolio owner can update evidence files" on storage.objects;
drop policy if exists "Portfolio owner can delete evidence files" on storage.objects;

create policy "Public can read evidence files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'evidence-files');
create policy "Portfolio owner can upload evidence files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'evidence-files' and (select public.is_portfolio_owner()));
create policy "Portfolio owner can update evidence files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'evidence-files' and (select public.is_portfolio_owner()))
  with check (bucket_id = 'evidence-files' and (select public.is_portfolio_owner()));
create policy "Portfolio owner can delete evidence files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'evidence-files' and (select public.is_portfolio_owner()));

-- Add both content tables to Realtime only when they are not already present.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'evidence'
  ) then
    alter publication supabase_realtime add table public.evidence;
  end if;
end
$$;

-- After signing in once, register exactly one owner manually.
-- Replace the example UUID with the User UID shown in Authentication > Users:
-- insert into public.portfolio_owners (user_id)
-- values ('00000000-0000-0000-0000-000000000000')
-- on conflict (user_id) do nothing;
