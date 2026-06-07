-- =============================================
-- YEREVAN EVENTS — Supabase Database Schema
-- Run this entire file in the Supabase SQL Editor
-- =============================================


-- 1. PROFILES TABLE
-- Stores each user's role (regular user or admin)
-- -----------------------------------------------
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Allow users to read their own profile
-- Allow admins to read all profiles
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- When a new user registers, automatically create their profile row
-- -----------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  raise warning 'handle_new_user failed: %', sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3. EVENTS TABLE
-- Stores all event data
-- -----------------------------------------------
create table if not exists public.events (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  description     text,
  category        text not null default 'other',
  event_date      date not null,
  start_time      time not null,
  end_time        time,
  location_name   text not null,
  address         text,
  price_info      text,
  organizer_name  text,
  image_url       text,
  external_link   text,
  event_language  text default 'English',
  age_restriction text,
  is_featured     boolean default false,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Row Level Security for events:
-- Anyone (even logged-out visitors) can read events
-- Only admins can create, edit, delete events
alter table public.events enable row level security;

create policy "Anyone can read events"
  on public.events for select
  using (true);

create policy "Only admins can insert events"
  on public.events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update events"
  on public.events for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete events"
  on public.events for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-update the updated_at timestamp when an event is edited
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.events;
create trigger set_updated_at
  before update on public.events
  for each row execute procedure public.update_updated_at();

-- Index for fast date-based queries
create index if not exists events_event_date_idx on public.events (event_date);
create index if not exists events_category_idx on public.events (category);
create index if not exists events_is_featured_idx on public.events (is_featured);


-- 4. STORAGE BUCKET FOR EVENT IMAGES
-- Run this separately if the bucket doesn't auto-create
-- -----------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

-- Anyone can view images (bucket is public)
create policy "Public read access for event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

-- Only admins can upload images
create policy "Admins can upload event images"
  on storage.objects for insert
  with check (
    bucket_id = 'event-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete images
create policy "Admins can delete event images"
  on storage.objects for delete
  using (
    bucket_id = 'event-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
