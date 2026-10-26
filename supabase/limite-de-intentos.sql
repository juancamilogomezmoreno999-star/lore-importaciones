-- ════════════════════════════════════════════════════════════════
--  Límite de intentos (rate limiting): evita pedidos, mensajes e
--  ingresos falsos en masa. Copia todo en Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════════════════

create table if not exists public.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

-- Sin políticas: nadie puede leerla ni escribirla desde el navegador; solo el servidor.
alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.rate_limits;
begin
  insert into public.rate_limits as t (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case when t.window_start < now() - make_interval(secs => p_window_seconds) then now() else t.window_start end,
    count        = case when t.window_start < now() - make_interval(secs => p_window_seconds) then 1 else t.count + 1 end
  returning * into r;

  -- Limpieza ocasional de registros viejos
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return r.count <= p_limit;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
