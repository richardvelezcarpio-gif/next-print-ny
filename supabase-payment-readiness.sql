-- Run manually in the Supabase SQL editor after review. This migration is additive;
-- it does not delete rows, tables, or data.
alter table public.business_records
  add column if not exists internal_order_id uuid default gen_random_uuid(),
  add column if not exists order_number text,
  add column if not exists currency text default 'USD',
  add column if not exists subtotal numeric,
  add column if not exists shipping_amount numeric,
  add column if not exists tax_amount numeric,
  add column if not exists delivery_address jsonb,
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_charge_id text,
  add column if not exists stripe_event_id text,
  add column if not exists paypal_order_id text,
  add column if not exists paypal_capture_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists refunded_at timestamptz;

-- Preserve all existing records. Normalize only order rows that have no status yet.
update public.business_records
set payment_status = case when status = 'paid' then 'paid' else 'pending_payment' end
where type = 'order' and coalesce(nullif(payment_status, ''), '') = '';

alter table public.business_records
  alter column payment_status set default 'pending_payment';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'business_records_order_payment_status_check') then
    alter table public.business_records add constraint business_records_order_payment_status_check
      check (type <> 'order' or payment_status in ('pending_payment', 'paid', 'payment_failed', 'cancelled', 'refunded'));
  end if;
end $$;

create unique index if not exists business_records_internal_order_id_idx
  on public.business_records(internal_order_id) where internal_order_id is not null;
create unique index if not exists business_records_order_number_idx
  on public.business_records(order_number) where order_number is not null and order_number <> '';
create unique index if not exists business_records_stripe_session_id_idx
  on public.business_records(stripe_session_id) where stripe_session_id is not null and stripe_session_id <> '';
create unique index if not exists business_records_stripe_payment_intent_id_idx
  on public.business_records(stripe_payment_intent_id) where stripe_payment_intent_id is not null and stripe_payment_intent_id <> '';
create unique index if not exists business_records_stripe_charge_id_idx
  on public.business_records(stripe_charge_id) where stripe_charge_id is not null and stripe_charge_id <> '';
create unique index if not exists business_records_paypal_order_id_idx
  on public.business_records(paypal_order_id) where paypal_order_id is not null and paypal_order_id <> '';
create unique index if not exists business_records_paypal_capture_id_idx
  on public.business_records(paypal_capture_id) where paypal_capture_id is not null and paypal_capture_id <> '';
create unique index if not exists business_records_stripe_event_id_idx
  on public.business_records(stripe_event_id) where stripe_event_id is not null and stripe_event_id <> '';
