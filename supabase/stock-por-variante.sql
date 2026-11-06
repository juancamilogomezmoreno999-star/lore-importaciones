-- ════════════════════════════════════════════════════════════════
--  Stock por color y talla
--  Copia todo en Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════
begin;

-- Unidades por combinación, ej. {"Color=Negro&Talla=M": 2, "Color=Blanco&Talla=S": 1}
alter table public.products add column if not exists variant_stock jsonb;

-- Clave de una combinación: "Color=Negro&Talla=M" (en orden alfabético)
create or replace function public.variant_key(v jsonb)
returns text language sql immutable set search_path = public as $$
  select coalesce(string_agg(e.key || '=' || e.value, '&' order by e.key), '')
  from jsonb_each_text(coalesce(v, '{}'::jsonb)) e;
$$;

create or replace function public.discount_order_stock(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb; k text;
begin
  update public.orders set stock_discounted = true
    where id = p_order_id and stock_discounted = false;
  if not found then return; end if;
  for it in select * from jsonb_array_elements((select items from public.orders where id = p_order_id)) loop
    k := public.variant_key(it -> 'variant');
    update public.products
      set stock = greatest(stock - (it ->> 'quantity')::int, 0),
          variant_stock = case
            when variant_stock ? k then jsonb_set(variant_stock, array[k], to_jsonb(greatest((variant_stock ->> k)::int - (it ->> 'quantity')::int, 0)))
            else variant_stock end
      where id = (it ->> 'product_id')::uuid;
  end loop;
end; $$;

create or replace function public.restore_order_stock(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb; k text;
begin
  if not (public.is_admin() or auth.role() = 'service_role') then
    raise exception 'no autorizado';
  end if;
  update public.orders set stock_discounted = false
    where id = p_order_id and stock_discounted = true;
  if not found then return; end if;
  for it in select * from jsonb_array_elements((select items from public.orders where id = p_order_id)) loop
    k := public.variant_key(it -> 'variant');
    update public.products
      set stock = stock + (it ->> 'quantity')::int,
          variant_stock = case
            when variant_stock ? k then jsonb_set(variant_stock, array[k], to_jsonb((variant_stock ->> k)::int + (it ->> 'quantity')::int))
            else variant_stock end
      where id = (it ->> 'product_id')::uuid;
  end loop;
end; $$;

revoke all on function public.discount_order_stock(uuid) from public, anon, authenticated;
grant execute on function public.discount_order_stock(uuid) to service_role;
revoke all on function public.restore_order_stock(uuid) from public, anon;
grant execute on function public.restore_order_stock(uuid) to authenticated, service_role;

commit;
