-- ════════════════════════════════════════════════════════════════
--  Cuentas de clientes: datos de envío guardados, carrito y "Mis pedidos"
--  Copia todo en Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  document text,
  phone text,
  department text,
  city text,
  address text,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

alter table public.customer_profiles enable row level security;
alter table public.customer_carts enable row level security;

-- Cada cliente solo ve y modifica lo suyo
drop policy if exists "cliente gestiona su perfil" on public.customer_profiles;
create policy "cliente gestiona su perfil" on public.customer_profiles
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cliente gestiona su carrito" on public.customer_carts;
create policy "cliente gestiona su carrito" on public.customer_carts
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "cliente ve sus pedidos" on public.orders;
create policy "cliente ve sus pedidos" on public.orders
  for select to authenticated using (user_id = auth.uid());
