-- Design Approval Portal schema.
-- Safe to run more than once. The existing private project-assets bucket is reused.

create extension if not exists pgcrypto;

create table if not exists public.design_approval_projects (
  id uuid primary key default gen_random_uuid(),
  secure_token text not null unique,
  project_name text not null,
  customer_name text not null,
  customer_email text not null,
  product_service text not null,
  order_number text,
  due_date date,
  customer_notes text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'changes_requested')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.design_approval_samples (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.design_approval_projects(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null
    check (file_type in ('image/jpeg', 'image/png', 'application/pdf')),
  version integer not null default 1 check (version > 0),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'changes_requested')),
  customer_comment text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, version)
);

create index if not exists design_approval_projects_updated_idx
  on public.design_approval_projects(updated_at desc);
create index if not exists design_approval_samples_project_idx
  on public.design_approval_samples(project_id, version);

create or replace function public.set_design_approval_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists design_approval_projects_updated_at
  on public.design_approval_projects;
create trigger design_approval_projects_updated_at
before update on public.design_approval_projects
for each row execute function public.set_design_approval_updated_at();

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', false)
on conflict (id) do nothing;

alter table public.design_approval_projects enable row level security;
alter table public.design_approval_samples enable row level security;

revoke all on public.design_approval_projects from anon, authenticated;
revoke all on public.design_approval_samples from anon, authenticated;
grant all on public.design_approval_projects to service_role;
grant all on public.design_approval_samples to service_role;

drop policy if exists "service role design approval projects"
  on public.design_approval_projects;
create policy "service role design approval projects"
  on public.design_approval_projects
  for all to service_role
  using (true)
  with check (true);

drop policy if exists "service role design approval samples"
  on public.design_approval_samples;
create policy "service role design approval samples"
  on public.design_approval_samples
  for all to service_role
  using (true)
  with check (true);

-- Response workflow additions. These statements are incremental and preserve
-- every existing project and sample.
alter table public.design_approval_projects
  add column if not exists response_round integer not null default 1,
  add column if not exists last_response_at timestamptz,
  add column if not exists approved_sample_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'design_approval_projects_approved_sample_fk'
  ) then
    alter table public.design_approval_projects
      add constraint design_approval_projects_approved_sample_fk
      foreign key (approved_sample_id)
      references public.design_approval_samples(id)
      on delete set null;
  end if;
end;
$$;

create table if not exists public.design_approval_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.design_approval_projects(id) on delete cascade,
  sample_id uuid not null references public.design_approval_samples(id) on delete restrict,
  response_round integer not null check (response_round > 0),
  response_type text not null
    check (response_type in ('approved', 'changes_requested')),
  customer_comment text,
  created_at timestamptz not null default now(),
  unique (project_id, response_round)
);

create index if not exists design_approval_responses_project_idx
  on public.design_approval_responses(project_id, created_at desc);

alter table public.design_approval_responses enable row level security;
revoke all on public.design_approval_responses from anon, authenticated;
grant all on public.design_approval_responses to service_role;

drop policy if exists "service role design approval responses"
  on public.design_approval_responses;
create policy "service role design approval responses"
  on public.design_approval_responses
  for all to service_role
  using (true)
  with check (true);

create or replace function public.submit_design_approval_response(
  p_secure_token text,
  p_version integer,
  p_response_type text,
  p_comment text default null
)
returns table (
  response_type text,
  version integer,
  customer_comment text,
  responded_at timestamptz,
  project_status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_project public.design_approval_projects%rowtype;
  selected_sample public.design_approval_samples%rowtype;
  clean_comment text := nullif(btrim(coalesce(p_comment, '')), '');
  response_time timestamptz := now();
begin
  if p_secure_token is null or p_secure_token !~ '^dap_[A-Za-z0-9_-]{40,80}$' then
    raise exception using errcode = 'P0002', message = 'PROJECT_NOT_FOUND';
  end if;
  if p_response_type not in ('approved', 'changes_requested') then
    raise exception using errcode = '22023', message = 'INVALID_RESPONSE';
  end if;
  if p_response_type = 'changes_requested' and clean_comment is null then
    raise exception using errcode = '22023', message = 'COMMENT_REQUIRED';
  end if;
  if length(coalesce(clean_comment, '')) > 2000 then
    raise exception using errcode = '22023', message = 'COMMENT_TOO_LONG';
  end if;

  select * into selected_project
  from public.design_approval_projects
  where secure_token = p_secure_token
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'PROJECT_NOT_FOUND';
  end if;
  if selected_project.status <> 'pending' then
    raise exception using errcode = 'P0001', message = 'PROJECT_CLOSED';
  end if;

  select sample.* into selected_sample
  from public.design_approval_samples as sample
  where sample.project_id = selected_project.id and sample.version = p_version;

  if not found then
    raise exception using errcode = '22023', message = 'SAMPLE_NOT_FOUND';
  end if;

  insert into public.design_approval_responses (
    project_id, sample_id, response_round, response_type, customer_comment, created_at
  ) values (
    selected_project.id, selected_sample.id, selected_project.response_round,
    p_response_type, clean_comment, response_time
  );

  update public.design_approval_samples
  set status = p_response_type,
      customer_comment = clean_comment,
      responded_at = response_time
  where id = selected_sample.id;

  update public.design_approval_projects
  set status = p_response_type,
      last_response_at = response_time,
      approved_sample_id = case when p_response_type = 'approved' then selected_sample.id else null end
  where id = selected_project.id;

  return query select p_response_type, p_version, clean_comment, response_time, p_response_type;
exception
  when unique_violation then
    raise exception using errcode = 'P0001', message = 'DUPLICATE_RESPONSE';
end;
$$;

create or replace function public.reopen_design_approval_project(p_secure_token text)
returns table (project_status text, response_round integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_project public.design_approval_projects%rowtype;
begin
  select * into selected_project
  from public.design_approval_projects
  where secure_token = p_secure_token
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'PROJECT_NOT_FOUND';
  end if;
  if selected_project.status = 'pending' then
    raise exception using errcode = 'P0001', message = 'PROJECT_ALREADY_OPEN';
  end if;

  update public.design_approval_projects
  set status = 'pending',
      response_round = selected_project.response_round + 1,
      approved_sample_id = null
  where id = selected_project.id;

  return query select 'pending'::text, selected_project.response_round + 1;
end;
$$;

revoke all on function public.submit_design_approval_response(text, integer, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_design_approval_response(text, integer, text, text)
  to service_role;
revoke all on function public.reopen_design_approval_project(text)
  from public, anon, authenticated;
grant execute on function public.reopen_design_approval_project(text)
  to service_role;

-- The existing project-assets service-role policy from supabase-project-portal.sql
-- continues to protect this private bucket. No anonymous storage policy is added.
