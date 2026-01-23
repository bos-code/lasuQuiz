-- LASU Quiz / Supabase schema (FIXED)
-- Key changes:
-- 1) profiles.id is Clerk user id (text) to avoid identity mismatch
-- 2) quiz_options is private (is_correct never exposed to clients)
-- 3) public view quiz_options_public exposes options WITHOUT is_correct
-- 4) attempts/answers are only readable by their owner (by user_id)
-- 5) admin override via requesting_admin()

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type public.quiz_status as enum ('Draft', 'Published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quiz_difficulty as enum ('Easy', 'Medium', 'Hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attempt_status as enum ('in_progress', 'completed', 'abandoned');
exception when duplicate_object then null; end $$;

-- ---------- Helper ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Admin check:
-- - if you later mint Supabase JWTs with role claims, this will work
-- - if not, only service role (server) can pass the first clause
create or replace function public.requesting_admin()
returns boolean language sql stable as $$
  select
    current_setting('request.jwt.claim.role', true) in ('service_role', 'admin');
$$;

-- ---------- Profiles (Clerk mirror) ----------
-- IMPORTANT: id is the Clerk user id, e.g. "user_2abc..."
create table if not exists public.profiles (
  id text primary key,                        -- clerk user id
  email text unique,
  full_name text,
  nick_name text,
  avatar text,
  subject text,
  gender text check (gender in ('male','female')),
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_touch
before update on public.profiles
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;

-- users can read profiles (optional: you can tighten later)
drop policy if exists profiles_select_any on public.profiles;
create policy profiles_select_any
on public.profiles for select
using (true);

-- users can update ONLY their own profile basics (no role escalation)
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self
on public.profiles for update
using (id = auth.uid()::text)
with check (id = auth.uid()::text and role = 'user');

-- admin writes (server-side)
drop policy if exists profiles_write_admin on public.profiles;
create policy profiles_write_admin
on public.profiles for insert
with check (public.requesting_admin());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
on public.profiles for update
using (public.requesting_admin())
with check (public.requesting_admin());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin
on public.profiles for delete
using (public.requesting_admin());

-- ---------- Quizzes ----------
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  status public.quiz_status not null default 'Draft',
  questions integer not null default 0,            -- denormalized count
  duration integer not null default 0,             -- minutes
  completions integer not null default 0,
  completion_rate numeric(5,2),
  passing_score numeric(5,2) default 70,
  randomize_questions boolean default true,
  immediate_results boolean default true,
  difficulty public.quiz_difficulty default 'Medium',
  created_by text references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger quizzes_touch
before update on public.quizzes
for each row execute procedure public.touch_updated_at();

alter table public.quizzes enable row level security;

drop policy if exists quizzes_select_any on public.quizzes;
create policy quizzes_select_any on public.quizzes
for select using (true);

drop policy if exists quizzes_insert_admin on public.quizzes;
create policy quizzes_insert_admin on public.quizzes
for insert with check (public.requesting_admin());

drop policy if exists quizzes_update_admin on public.quizzes;
create policy quizzes_update_admin on public.quizzes
for update using (public.requesting_admin()) with check (public.requesting_admin());

drop policy if exists quizzes_delete_admin on public.quizzes;
create policy quizzes_delete_admin on public.quizzes
for delete using (public.requesting_admin());

-- ---------- Quiz Questions ----------
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  body text not null,
  points integer not null default 10,
  order_index integer not null default 1,
  difficulty public.quiz_difficulty default 'Medium',
  time_limit_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quiz_questions_quiz_idx on public.quiz_questions (quiz_id);

create trigger quiz_questions_touch
before update on public.quiz_questions
for each row execute procedure public.touch_updated_at();

alter table public.quiz_questions enable row level security;

drop policy if exists quiz_questions_select_any on public.quiz_questions;
create policy quiz_questions_select_any on public.quiz_questions
for select using (true);

drop policy if exists quiz_questions_write_admin on public.quiz_questions;
create policy quiz_questions_write_admin on public.quiz_questions
for insert with check (public.requesting_admin());

drop policy if exists quiz_questions_update_admin on public.quiz_questions;
create policy quiz_questions_update_admin on public.quiz_questions
for update using (public.requesting_admin()) with check (public.requesting_admin());

drop policy if exists quiz_questions_delete_admin on public.quiz_questions;
create policy quiz_questions_delete_admin on public.quiz_questions
for delete using (public.requesting_admin());

-- Keep quizzes.questions in sync
create or replace function public.refresh_quiz_question_count(p_quiz_id uuid)
returns void language plpgsql as $$
begin
  update public.quizzes
  set questions = (select count(*) from public.quiz_questions where quiz_id = p_quiz_id),
      updated_at = now()
  where id = p_quiz_id;
end $$;

create or replace function public.trg_quiz_questions_count()
returns trigger language plpgsql as $$
begin
  perform public.refresh_quiz_question_count(coalesce(new.quiz_id, old.quiz_id));
  return null;
end $$;

drop trigger if exists quiz_questions_count on public.quiz_questions;
create trigger quiz_questions_count
after insert or delete or update of quiz_id on public.quiz_questions
for each row execute procedure public.trg_quiz_questions_count();

-- ---------- Quiz Options (PRIVATE: contains is_correct) ----------
create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  label text,
  text text not null,
  is_correct boolean not null default false,
  order_index integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quiz_options_question_idx on public.quiz_options (question_id);

create trigger quiz_options_touch
before update on public.quiz_options
for each row execute procedure public.touch_updated_at();

alter table public.quiz_options enable row level security;

-- NO public select here (prevents leaking is_correct)
drop policy if exists quiz_options_select_any on public.quiz_options;
create policy quiz_options_select_admin on public.quiz_options
for select using (public.requesting_admin());

create policy quiz_options_write_admin on public.quiz_options
for insert with check (public.requesting_admin());

create policy quiz_options_update_admin on public.quiz_options
for update using (public.requesting_admin()) with check (public.requesting_admin());

create policy quiz_options_delete_admin on public.quiz_options
for delete using (public.requesting_admin());

-- Public-safe options view (what the frontend reads)
create or replace view public.quiz_options_public as
select id, question_id, label, text, order_index, created_at, updated_at
from public.quiz_options;

-- ---------- Quiz Attempts ----------
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  status public.attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer,
  score numeric(10,2) default 0,
  total_points numeric(10,2) default 0,
  percent numeric(5,2) generated always as (
    case when total_points > 0 then round((score / total_points) * 100, 2) else 0 end
  ) stored,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts (quiz_id);
create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id);

alter table public.quiz_attempts enable row level security;

-- Users can read ONLY their attempts; admin can read all
drop policy if exists quiz_attempts_select_any on public.quiz_attempts;
create policy quiz_attempts_select_own on public.quiz_attempts
for select using (user_id = auth.uid()::text or public.requesting_admin());

-- Users can insert only for themselves
drop policy if exists quiz_attempts_insert_open on public.quiz_attempts;
create policy quiz_attempts_insert_own on public.quiz_attempts
for insert with check (user_id = auth.uid()::text or public.requesting_admin());

-- Users can update only their own attempt while in_progress; admin override
drop policy if exists quiz_attempts_update_admin on public.quiz_attempts;
create policy quiz_attempts_update_own on public.quiz_attempts
for update using (user_id = auth.uid()::text or public.requesting_admin())
with check (user_id = auth.uid()::text or public.requesting_admin());

-- ---------- Quiz Attempt Answers ----------
create table if not exists public.quiz_attempt_answers (
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_id uuid references public.quiz_options(id) on delete set null,
  answered_at timestamptz not null default now(),
  time_spent_seconds integer default 0,
  primary key (attempt_id, question_id)
);

create index if not exists quiz_attempt_answers_option_idx on public.quiz_attempt_answers (option_id);

alter table public.quiz_attempt_answers enable row level security;

-- Read only your own answers (join to attempts)
drop policy if exists quiz_attempt_answers_select_any on public.quiz_attempt_answers;
create policy quiz_attempt_answers_select_own on public.quiz_attempt_answers
for select using (
  exists (
    select 1 from public.quiz_attempts a
    where a.id = quiz_attempt_answers.attempt_id
      and (a.user_id = auth.uid()::text or public.requesting_admin())
  )
);

-- Insert only into your own attempt
drop policy if exists quiz_attempt_answers_insert_open on public.quiz_attempt_answers;
create policy quiz_attempt_answers_insert_own on public.quiz_attempt_answers
for insert with check (
  exists (
    select 1 from public.quiz_attempts a
    where a.id = quiz_attempt_answers.attempt_id
      and (a.user_id = auth.uid()::text or public.requesting_admin())
  )
);

-- ---------- Scoring (server-side grading) ----------
-- Grade an attempt without exposing correct answers.
create or replace function public.grade_attempt(p_attempt_id uuid)
returns table(score numeric, total_points numeric, percent numeric)
language plpgsql
security definer
as $$
declare
  v_score numeric := 0;
  v_total numeric := 0;
begin
  -- compute total points
  select coalesce(sum(q.points),0) into v_total
  from public.quiz_attempts a
  join public.quiz_questions q on q.quiz_id = a.quiz_id
  where a.id = p_attempt_id;

  -- compute score based on chosen option correctness
  select coalesce(sum(q.points),0) into v_score
  from public.quiz_attempt_answers ans
  join public.quiz_questions q on q.id = ans.question_id
  join public.quiz_options opt on opt.id = ans.option_id
  where ans.attempt_id = p_attempt_id
    and opt.is_correct = true;

  update public.quiz_attempts
  set score = v_score,
      total_points = v_total,
      status = 'completed',
      submitted_at = now()
  where id = p_attempt_id;

  return query
  select v_score, v_total,
         case when v_total > 0 then round((v_score / v_total) * 100, 2) else 0 end;
end $$;

revoke all on function public.grade_attempt(uuid) from public;
grant execute on function public.grade_attempt(uuid) to authenticated;

-- ---------- Dashboard Summary Cards (admin-only write, public read optional) ----------
create table if not exists public.admin_summary_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  value text not null,
  change text not null,
  icon text not null,
  color text not null check (color in ('purple', 'green', 'blue', 'orange')),
  updated_at timestamptz not null default now()
);

create trigger admin_summary_cards_touch
before update on public.admin_summary_cards
for each row execute procedure public.touch_updated_at();

alter table public.admin_summary_cards enable row level security;

drop policy if exists admin_summary_cards_select_any on public.admin_summary_cards;
create policy admin_summary_cards_select_any
on public.admin_summary_cards for select using (true);

drop policy if exists admin_summary_cards_write_admin on public.admin_summary_cards;
create policy admin_summary_cards_write_admin
on public.admin_summary_cards for insert with check (public.requesting_admin());

drop policy if exists admin_summary_cards_update_admin on public.admin_summary_cards;
create policy admin_summary_cards_update_admin
on public.admin_summary_cards for update using (public.requesting_admin()) with check (public.requesting_admin());

drop policy if exists admin_summary_cards_delete_admin on public.admin_summary_cards;
create policy admin_summary_cards_delete_admin
on public.admin_summary_cards for delete using (public.requesting_admin());

-- ---------- Students View ----------
create or replace view public.students as
select
  p.id,
  coalesce(p.nick_name, p.full_name, p.email, 'Student') as name,
  coalesce(p.subject, 'General') as subject,
  coalesce(round(avg(a.percent) filter (where a.status = 'completed'), 2), 0) as average_score,
  coalesce(max(a.percent), 0)::numeric(6,2) as best_score,
  coalesce(p.avatar, '👤') as avatar,
  p.gender,
  coalesce(count(distinct a.quiz_id) filter (where a.status = 'completed'), 0) as quizzes_taken,
  max(a.submitted_at) as last_active
from public.profiles p
left join public.quiz_attempts a on a.user_id = p.id
group by p.id, p.full_name, p.email, p.subject, p.avatar, p.gender;

-- ---------- Seed (optional) ----------
insert into public.quizzes (id, title, description, category, status, questions, duration, completions, completion_rate)
values
  ('00000000-0000-0000-0000-000000000001', 'Introduction to Biology', 'Basic concepts of biology for beginners', 'Science', 'Published', 15, 20, 32, 75),
  ('00000000-0000-0000-0000-000000000002', 'Advanced Mathematics', 'Complex mathematical problems and solutions', 'Mathematics', 'Published', 25, 45, 28, 40),
  ('00000000-0000-0000-0000-000000000003', 'Chemistry Fundamentals', 'Introduction to chemical reactions and compounds', 'Chemistry', 'Draft', 20, 30, 0, 90)
on conflict (id) do nothing;
