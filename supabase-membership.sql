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
  monthly_price numeric(10,2) not null default 35,
  paypal_subscription_id text unique,
  paypal_plan_id text,
  payment_provider text default '',
  payment_status text default '',
  membership_status text default '',
  subscription_status text default '',
  stripe_subscription_id text unique,
  stripe_customer_id text,
  next_billing_date timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_memberships
  alter column monthly_price set default 35,
  add column if not exists payment_provider text default '',
  add column if not exists payment_status text default '',
  add column if not exists membership_status text default '',
  add column if not exists subscription_status text default '',
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists next_billing_date timestamptz;

create unique index if not exists member_memberships_stripe_subscription_idx
  on public.member_memberships(stripe_subscription_id)
  where stripe_subscription_id is not null and stripe_subscription_id <> '';

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
