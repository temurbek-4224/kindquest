-- ═══════════════════════════════════════════════════════════════════
--  KindQuest — Fix: Questions table (flat-column schema)
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  Safe to run even if the old questions table exists — drops it first.
--  Fixes:
--    1. Drops old array-based questions table (options_uz text[], etc.)
--    2. Creates new flat-column questions table
--    3. Adds correct RLS policies (read all / admin CRUD)
--    4. Recreates updated_at trigger
-- ═══════════════════════════════════════════════════════════════════


-- ── STEP 1: Drop old questions table and its policies ────────────
--    CASCADE drops all dependent policies, triggers, and constraints.

drop table if exists public.questions cascade;


-- ── STEP 2: Create new questions table with flat columns ─────────

create table public.questions (
  id               uuid         primary key default gen_random_uuid(),
  category         text         not null default 'general',

  question_uz      text         not null default '',
  question_ru      text         not null default '',
  question_en      text         not null default '',

  option_a_uz      text         not null default '',
  option_a_ru      text         not null default '',
  option_a_en      text         not null default '',

  option_b_uz      text         not null default '',
  option_b_ru      text         not null default '',
  option_b_en      text         not null default '',

  option_c_uz      text         not null default '',
  option_c_ru      text         not null default '',
  option_c_en      text         not null default '',

  option_d_uz      text         not null default '',
  option_d_ru      text         not null default '',
  option_d_en      text         not null default '',

  correct_answer   text         not null default 'A'
                                check (correct_answer in ('A', 'B', 'C', 'D')),

  explanation_uz   text,
  explanation_ru   text,
  explanation_en   text,

  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);


-- ── STEP 3: Enable RLS ────────────────────────────────────────────

alter table public.questions enable row level security;


-- ── STEP 4: RLS policies ──────────────────────────────────────────
--
--  • Anyone (including guests) can read questions for the game.
--  • Only admins can create / edit / delete questions.
--    Uses public.is_admin() which must already exist (created in schema.sql).

drop policy if exists "questions: read all"     on public.questions;
drop policy if exists "questions: admin insert" on public.questions;
drop policy if exists "questions: admin update" on public.questions;
drop policy if exists "questions: admin delete" on public.questions;

create policy "questions: read all"
  on public.questions for select
  using (true);

create policy "questions: admin insert"
  on public.questions for insert
  with check (public.is_admin());

create policy "questions: admin update"
  on public.questions for update
  using (public.is_admin());

create policy "questions: admin delete"
  on public.questions for delete
  using (public.is_admin());


-- ── STEP 5: updated_at trigger ───────────────────────────────────
--
--  Reuses the existing set_updated_at() function from schema.sql.
--  Drop + recreate because CASCADE above already dropped the old trigger.

drop trigger if exists set_questions_updated_at on public.questions;

create trigger set_questions_updated_at
  before update on public.questions
  for each row execute procedure public.set_updated_at();


-- ── STEP 6: Verify ───────────────────────────────────────────────
--
--  Run these SELECTs manually after the script to confirm success.
--
--  Check table exists with correct columns:
--    select column_name, data_type, is_nullable
--    from information_schema.columns
--    where table_schema = 'public' and table_name = 'questions'
--    order by ordinal_position;
--
--  Check RLS policies:
--    select policyname, cmd
--    from pg_policies
--    where tablename = 'questions';
--
--  Check trigger exists:
--    select trigger_name from information_schema.triggers
--    where event_object_table = 'questions';
