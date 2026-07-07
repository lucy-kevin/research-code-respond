-- Research Code Respond — content schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Idempotent: safe to re-run after every update.

-- ── Staff & roles ─────────────────────────────────────────────────────
-- Every admin-portal user gets a row here. Roles:
--   admin  — everything, including managing staff
--   editor — write content, fellows, posts, events; read audience & audit
--   viewer — read-only across the portal
create table if not exists public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- Role of the calling user. SECURITY DEFINER so policies can consult the
-- staff table without tripping over its own RLS (no recursion).
create or replace function public.staff_role()
returns text
language sql stable security definer set search_path = public
as $$
  select role from public.staff where user_id = auth.uid()
$$;

drop policy if exists "Staff can read staff" on public.staff;
create policy "Staff can read staff"
  on public.staff for select to authenticated
  using (public.staff_role() is not null);

drop policy if exists "Admins manage staff" on public.staff;
create policy "Admins manage staff"
  on public.staff for all to authenticated
  using (public.staff_role() = 'admin')
  with check (public.staff_role() = 'admin');

-- Bootstrap: anyone who already had a login becomes an admin, so the
-- existing account keeps full access when this schema first runs.
insert into public.staff (user_id, email, role)
select id, coalesce(email, id::text), 'admin' from auth.users
on conflict (user_id) do nothing;

-- ── Audit log ─────────────────────────────────────────────────────────
-- One row per insert/update/delete on every content table, written by a
-- trigger. actor_email is 'public' for anonymous writes (contact form,
-- event registrations, newsletter signups).
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  actor_email text not null default 'public',
  action text not null,                       -- insert | update | delete
  table_name text not null,
  record_id text not null default '',
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- Read-only for staff. No insert/update/delete policies: the only writer
-- is the SECURITY DEFINER trigger below, which bypasses RLS.
drop policy if exists "Staff can read audit log" on public.audit_log;
create policy "Staff can read audit log"
  on public.audit_log for select to authenticated
  using (public.staff_role() is not null);

create or replace function public.log_audit()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  rec jsonb;
begin
  rec := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.audit_log (actor_id, actor_email, action, table_name, record_id, details)
  values (
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', 'public'),
    lower(tg_op),
    tg_table_name,
    coalesce(rec ->> 'id', rec ->> 'key', rec ->> 'user_id', ''),
    case when tg_op = 'UPDATE'
      then jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
      else rec
    end
  );
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

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
  using (public.staff_role() in ('admin', 'editor'))
  with check (public.staff_role() in ('admin', 'editor'));

-- ── Site content (editable copy per section) ────────────────────────
create table if not exists public.content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content enable row level security;

drop policy if exists "Public can read content" on public.content;
create policy "Public can read content"
  on public.content for select using (true);

drop policy if exists "Admins can write content" on public.content;
create policy "Admins can write content"
  on public.content for all to authenticated
  using (public.staff_role() in ('admin', 'editor'))
  with check (public.staff_role() in ('admin', 'editor'));

-- ── Blog posts ──────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- When subscribers were emailed about this post (null = not yet sent).
alter table public.posts add column if not exists notified_at timestamptz;

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts for select using (published = true);

drop policy if exists "Admins can do everything with posts" on public.posts;
create policy "Admins can do everything with posts"
  on public.posts for all to authenticated
  using (public.staff_role() in ('admin', 'editor'))
  with check (public.staff_role() in ('admin', 'editor'));

-- ── Contact form messages ───────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text not null default '',
  interest text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "Anyone can send a message" on public.messages;
create policy "Anyone can send a message"
  on public.messages for insert
  with check (true);

drop policy if exists "Admins can read messages" on public.messages;
create policy "Admins can read messages"
  on public.messages for select to authenticated
  using (public.staff_role() is not null);

drop policy if exists "Admins can update messages" on public.messages;
create policy "Admins can update messages"
  on public.messages for update to authenticated
  using (public.staff_role() in ('admin', 'editor'));

drop policy if exists "Admins can delete messages" on public.messages;
create policy "Admins can delete messages"
  on public.messages for delete to authenticated
  using (public.staff_role() in ('admin', 'editor'));

-- ── Event registrations ──────────────────────────────────────────────
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,                 -- stable key from the events content
  event_title text not null default '',
  name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (event_slug, email)                -- one registration per person per event
);

alter table public.event_registrations enable row level security;

drop policy if exists "Anyone can register for an event" on public.event_registrations;
create policy "Anyone can register for an event"
  on public.event_registrations for insert
  with check (true);

drop policy if exists "Admins can read registrations" on public.event_registrations;
create policy "Admins can read registrations"
  on public.event_registrations for select to authenticated
  using (public.staff_role() is not null);

drop policy if exists "Admins can delete registrations" on public.event_registrations;
create policy "Admins can delete registrations"
  on public.event_registrations for delete to authenticated
  using (public.staff_role() in ('admin', 'editor'));

-- ── Newsletter subscribers ───────────────────────────────────────────
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers for insert
  with check (true);

drop policy if exists "Admins can read subscribers" on public.subscribers;
create policy "Admins can read subscribers"
  on public.subscribers for select to authenticated
  using (public.staff_role() is not null);

drop policy if exists "Admins can delete subscribers" on public.subscribers;
create policy "Admins can delete subscribers"
  on public.subscribers for delete to authenticated
  using (public.staff_role() in ('admin', 'editor'));

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
  with check (bucket_id = 'photos' and public.staff_role() in ('admin', 'editor'));

drop policy if exists "Admins can update photos" on storage.objects;
create policy "Admins can update photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos' and public.staff_role() in ('admin', 'editor'));

drop policy if exists "Admins can delete photos" on storage.objects;
create policy "Admins can delete photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and public.staff_role() in ('admin', 'editor'));

-- ── Audit triggers ────────────────────────────────────────────────────
-- Every write to these tables lands in audit_log (defined above).
drop trigger if exists audit_fellows on public.fellows;
create trigger audit_fellows
  after insert or update or delete on public.fellows
  for each row execute function public.log_audit();

drop trigger if exists audit_content on public.content;
create trigger audit_content
  after insert or update or delete on public.content
  for each row execute function public.log_audit();

drop trigger if exists audit_posts on public.posts;
create trigger audit_posts
  after insert or update or delete on public.posts
  for each row execute function public.log_audit();

drop trigger if exists audit_messages on public.messages;
create trigger audit_messages
  after insert or update or delete on public.messages
  for each row execute function public.log_audit();

drop trigger if exists audit_event_registrations on public.event_registrations;
create trigger audit_event_registrations
  after insert or update or delete on public.event_registrations
  for each row execute function public.log_audit();

drop trigger if exists audit_subscribers on public.subscribers;
create trigger audit_subscribers
  after insert or update or delete on public.subscribers
  for each row execute function public.log_audit();

drop trigger if exists audit_staff on public.staff;
create trigger audit_staff
  after insert or update or delete on public.staff
  for each row execute function public.log_audit();
