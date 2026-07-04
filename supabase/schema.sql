-- Research Code Respond — content schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

-- ── Fellows ──────────────────────────────────────────────────────────
create table if not exists public.fellows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default '',
  code text not null default '',            -- ISO flag code, e.g. "ke"
  track text not null default '',
  profession text not null default '',
  bio text not null default '',
  why text not null default '',
  hope text not null default '',
  photo_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.fellows enable row level security;

drop policy if exists "Public can read fellows" on public.fellows;
create policy "Public can read fellows"
  on public.fellows for select using (true);

drop policy if exists "Admins can write fellows" on public.fellows;
create policy "Admins can write fellows"
  on public.fellows for all to authenticated
  using (true) with check (true);

-- ── Photo storage ────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can view photos" on storage.objects;
create policy "Public can view photos"
  on storage.objects for select using (bucket_id = 'photos');

drop policy if exists "Admins can upload photos" on storage.objects;
create policy "Admins can upload photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');

drop policy if exists "Admins can update photos" on storage.objects;
create policy "Admins can update photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos');

drop policy if exists "Admins can delete photos" on storage.objects;
create policy "Admins can delete photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos');
