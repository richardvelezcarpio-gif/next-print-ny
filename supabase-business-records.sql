create extension if not exists pgcrypto;

create table if not exists public.business_records (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('order', 'income', 'expense', 'inventory', 'customer', 'document')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'waiting', 'paid', 'completed', 'cancelled')),
  title text not null,
  customer_name text,
  customer_phone text,
  customer_email text,
  description text,
  amount numeric default 0,
  quantity numeric default 0,
  due_date date,
  file_url text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_records enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant all privileges on table public.business_records to service_role;
grant select, insert, update, delete on table public.business_records to authenticated;

drop policy if exists "service role can manage business records" on public.business_records;
create policy "service role can manage business records"
on public.business_records
for all
to service_role
using (true)
with check (true);

drop policy if exists "authenticated can manage business records" on public.business_records;
create policy "authenticated can manage business records"
on public.business_records
for all
to authenticated
using (true)
with check (true);
