-- ═══════════════════════════════════════════════════════════════════
--  KindQuest — Fix: Auto-create profiles on sign-up
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  Safe to run multiple times (idempotent).
--  Fixes:
--    1. Ensures profiles table has all required columns
--    2. Replaces handle_new_user() with the correct, complete version
--    3. Drops + recreates the trigger cleanly
--    4. Backfills any auth.users that have no profile row yet
-- ═══════════════════════════════════════════════════════════════════


-- ── STEP 1: Ensure profiles table has every required column ─────────
--    Safe if columns already exist (uses IF NOT EXISTS).

alter table public.profiles
  add column if not exists full_name  text,
  add column if not exists avatar_url text,
  add column if not exists email      text,
  add column if not exists role       text not null default 'user',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();


-- ── STEP 2: Replace handle_new_user() — complete, correct version ───
--
--  Inserts ALL profile fields explicitly:
--    • id           → from auth.users
--    • full_name    → from signup metadata (empty string fallback)
--    • avatar_url   → from signup metadata (null is fine)
--    • email        → from auth.users.email
--    • role         → always 'user' for new signups
--    • created_at   → now()
--    • updated_at   → now()
--
--  ON CONFLICT DO NOTHING = safe to call multiple times, never
--  overwrites an existing profile (e.g. if trigger fires twice).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''          -- prevents search-path injection attacks
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_url,
    email,
    role,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email,
    'user',
    now(),
    now()
  )
  on conflict (id) do nothing;   -- never clobber an existing profile

  return new;
end;
$$;


-- ── STEP 3: Drop old trigger (may be broken) and recreate it ────────
--
--  The trigger must point to auth.users so it fires on every signup.
--  We drop first in case the previous trigger was misconfigured.

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- ── STEP 4: Backfill — create profiles for all existing auth.users ──
--
--  Inserts a profile row for every user in auth.users that does NOT
--  already have one. Existing profiles are untouched (ON CONFLICT).
--
--  Columns:
--    full_name  → from stored metadata, falls back to empty string
--    email      → from auth.users.email
--    role       → 'user' (promote to admin manually if needed)
--    created_at → user's original signup time
--    updated_at → now() (backfill time)

insert into public.profiles (
  id,
  full_name,
  avatar_url,
  email,
  role,
  created_at,
  updated_at
)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  u.raw_user_meta_data ->> 'avatar_url',
  u.email,
  'user',
  coalesce(u.created_at, now()),
  now()
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;   -- only insert if no profile exists yet


-- ── STEP 5: Verify ──────────────────────────────────────────────────
--
--  Run these SELECTs manually after the script to confirm success.
--
--  Check trigger exists:
--    select trigger_name, event_object_schema, event_object_table,
--           action_timing, event_manipulation
--    from information_schema.triggers
--    where trigger_name = 'on_auth_user_created';
--
--  Check all auth.users have profiles:
--    select count(*) from auth.users u
--    left join public.profiles p on p.id = u.id
--    where p.id is null;   -- should return 0
--
--  Check a few profiles:
--    select id, full_name, email, role, created_at
--    from public.profiles
--    order by created_at desc
--    limit 10;
