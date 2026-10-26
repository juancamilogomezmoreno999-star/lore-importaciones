-- ════════════════════════════════════════════════════════════════
--  Registro de consentimientos: prueba de cuándo y cómo cada persona
--  aceptó los términos y la política de datos (Decreto 1377 de 2013).
--  Copia todo en Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

create table if not exists public.consent_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  context text not null,                 -- 'pedido', 'registro' o 'contacto'
  email text,
  user_id uuid references auth.users(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  accepted_terms boolean not null default false,
  accepted_privacy boolean not null default false,
  terms_version text,
  privacy_version text,
  ip text,
  user_agent text
);
create index if not exists consent_log_order_idx on public.consent_log (order_id);
create index if not exists consent_log_email_idx on public.consent_log (lower(email));

-- Solo el servidor escribe; solo la administradora puede consultarlo
alter table public.consent_log enable row level security;
drop policy if exists "admin ve consentimientos" on public.consent_log;
create policy "admin ve consentimientos" on public.consent_log
  for select to authenticated using ((select public.is_admin()));
