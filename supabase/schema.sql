-- ═══════════════════════════════════════════════════════════
--  KindQuest — Supabase SQL Schema  (v3)
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  Safe to run on a fresh project OR on top of v1 / v2.
--  All statements use IF NOT EXISTS / CREATE OR REPLACE.
-- ═══════════════════════════════════════════════════════════


-- ── 1. PROFILES table ────────────────────────────────────

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Drop old policies if they exist, then recreate cleanly
drop policy if exists "profiles: select own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;

create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);


-- ── 2. Auto-create profile on sign-up ────────────────────
--
--  Runs AFTER every INSERT on auth.users (new signup or OAuth).
--  Inserts all profile fields explicitly — never relies on column
--  defaults for required data. ON CONFLICT DO NOTHING makes it
--  safe to re-run without clobbering existing rows.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
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
  on conflict (id) do nothing;   -- safe to re-run; never clobbers existing rows
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 3. GAME_RESULTS table ─────────────────────────────────
--
--  Field names match exactly what the app inserts:
--    correct_answers  – number of correct answers
--    percentage       – 0–100 stored as numeric(5,2)
--    language         – language code used during game ('uz'|'ru'|'en')
--    created_at       – when the game was finished

create table if not exists public.game_results (
  id               uuid           primary key default gen_random_uuid(),
  user_id          uuid           not null references auth.users(id) on delete cascade,
  score            integer        not null default 0,
  correct_answers  integer        not null default 0,
  total_questions  integer        not null default 0,
  percentage       numeric(5,2)   not null default 0,
  language         text           not null default 'uz',
  created_at       timestamptz    not null default now()
);

-- ── Migrate existing tables from v1 / v2 if needed ───────
-- (safe to ignore errors if the table is brand new)
do $$
begin
  -- rename correct_count → correct_answers if the old column exists
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'game_results'
      and column_name  = 'correct_count'
  ) then
    alter table public.game_results rename column correct_count to correct_answers;
  end if;

  -- rename played_at → created_at if the old column exists
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'game_results'
      and column_name  = 'played_at'
  ) then
    alter table public.game_results rename column played_at to created_at;
  end if;

  -- add language column if missing
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'game_results'
      and column_name  = 'language'
  ) then
    alter table public.game_results add column language text not null default 'uz';
  end if;

  -- change percentage to numeric(5,2) if it is still integer
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'game_results'
      and column_name  = 'percentage'
      and data_type    = 'integer'
  ) then
    alter table public.game_results
      alter column percentage type numeric(5,2) using percentage::numeric(5,2);
  end if;
end;
$$;

alter table public.game_results enable row level security;

drop policy if exists "game_results: select own" on public.game_results;
drop policy if exists "game_results: insert own" on public.game_results;
drop policy if exists "game_results: delete own" on public.game_results;

create policy "game_results: select own"
  on public.game_results for select
  using (auth.uid() = user_id);

create policy "game_results: insert own"
  on public.game_results for insert
  with check (auth.uid() = user_id);

create policy "game_results: delete own"
  on public.game_results for delete
  using (auth.uid() = user_id);


-- ── 4. Updated-at trigger for profiles ───────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();


-- ═══════════════════════════════════════════════════════════
--  ADMIN PANEL SCHEMA  (v4 additions)
--  Run after the base schema above.
-- ═══════════════════════════════════════════════════════════


-- ── 5. Admin role + email columns for profiles ────────────

alter table public.profiles
  add column if not exists role  text not null default 'user',
  add column if not exists email text;

-- Redefine handle_new_user() with the COMPLETE, AUTHORITATIVE version.
-- This replaces the section-2 definition with one that:
--   • explicitly inserts ALL fields (id, full_name, avatar_url, email, role)
--   • sets role = 'user' explicitly (not via column default)
--   • uses ON CONFLICT DO NOTHING (safe, never overwrites)
--   • recreates the trigger so it stays attached after column additions

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
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
  on conflict (id) do nothing;   -- idempotent: never clobbers existing profiles
  return new;
end;
$$;

-- Recreate the trigger so it is guaranteed to exist after this section runs
-- (handles the case where section 2 was never run on this database)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Backfill: insert profiles for any auth.users without one ─────────
-- Safe: ON CONFLICT DO NOTHING means existing profiles are not touched.
-- Assigns role = 'user'; promote admins manually via the admin panel.

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
where p.id is null
on conflict (id) do nothing;


-- ── 6. is_admin() helper — avoids RLS recursion ───────────

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- ── 7. Admin RLS policies ─────────────────────────────────

-- Profiles: admin can read ALL users
drop policy if exists "profiles: admin read all" on public.profiles;
create policy "profiles: admin read all"
  on public.profiles for select
  using (is_admin());

-- Game results: admin can read ALL results
drop policy if exists "game_results: admin read all" on public.game_results;
create policy "game_results: admin read all"
  on public.game_results for select
  using (is_admin());


-- ── 8. QUESTIONS table ────────────────────────────────────
--
--  Stores quiz questions with trilingual content.
--  Uses flat columns for options (option_a_uz … option_d_en).
--  correct_answer stores the letter 'A'|'B'|'C'|'D'.
--
--  NOTE: If upgrading from the old array-based schema, run
--  supabase/fix-questions-table.sql instead (it drops+recreates).

create table if not exists public.questions (
  id             uuid         primary key default gen_random_uuid(),
  category       text         not null default 'general',

  question_uz    text         not null default '',
  question_ru    text         not null default '',
  question_en    text         not null default '',

  option_a_uz    text         not null default '',
  option_a_ru    text         not null default '',
  option_a_en    text         not null default '',

  option_b_uz    text         not null default '',
  option_b_ru    text         not null default '',
  option_b_en    text         not null default '',

  option_c_uz    text         not null default '',
  option_c_ru    text         not null default '',
  option_c_en    text         not null default '',

  option_d_uz    text         not null default '',
  option_d_ru    text         not null default '',
  option_d_en    text         not null default '',

  correct_answer text         not null default 'A'
                              check (correct_answer in ('A', 'B', 'C', 'D')),

  explanation_uz text,
  explanation_ru text,
  explanation_en text,

  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

alter table public.questions enable row level security;

-- Anyone (including guests) can read questions for the game
drop policy if exists "questions: read all" on public.questions;
create policy "questions: read all"
  on public.questions for select
  using (true);

-- Only admins can create/edit/delete questions
drop policy if exists "questions: admin insert" on public.questions;
create policy "questions: admin insert"
  on public.questions for insert
  with check (is_admin());

drop policy if exists "questions: admin update" on public.questions;
create policy "questions: admin update"
  on public.questions for update
  using (is_admin());

drop policy if exists "questions: admin delete" on public.questions;
create policy "questions: admin delete"
  on public.questions for delete
  using (is_admin());

-- Updated-at trigger for questions
drop trigger if exists set_questions_updated_at on public.questions;
create trigger set_questions_updated_at
  before update on public.questions
  for each row execute procedure public.set_updated_at();
