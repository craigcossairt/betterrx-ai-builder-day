create table if not exists public.orders (
  id text primary key,
  status text not null,
  patient_id text not null,
  body jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists orders_demo_all on public.orders;
create policy orders_demo_all
  on public.orders
  for all
  using (true)
  with check (true);
