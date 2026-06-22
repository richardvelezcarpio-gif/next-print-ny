create extension if not exists pgcrypto;

create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  business_name text default '',
  phone text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'inactive',
  monthly_price numeric(10,2) not null default 30,
  paypal_subscription_id text unique,
  paypal_plan_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.member_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  editor_type text not null,
  product text default '',
  design_data jsonb not null default '{}'::jsonb,
  thumbnail_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_designs_user_updated_idx on public.member_designs(user_id, updated_at desc);

create table if not exists public.member_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_type text default '',
  file_size bigint default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists member_files_user_url_idx on public.member_files(user_id, file_url);

alter table public.member_profiles enable row level security;
alter table public.member_memberships enable row level security;
alter table public.member_designs enable row level security;
alter table public.member_files enable row level security;

insert into storage.buckets (id, name, public)
values ('member-assets', 'member-assets', false)
on conflict (id) do nothing;
