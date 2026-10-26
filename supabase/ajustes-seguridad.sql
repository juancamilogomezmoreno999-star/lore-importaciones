-- ════════════════════════════════════════════════════════════════
--  Ajustes del Security Advisor de Supabase
--  · Reglas de permisos más rápidas y sin duplicados
--  · Función con ruta segura
--  · Las fotos siguen viéndose en la tienda, pero ya nadie puede listar la carpeta
--  Copia todo en Supabase → SQL Editor → New query → Run
--  (va dentro de una transacción: si algo falla, no cambia nada)
-- ════════════════════════════════════════════════════════════════
begin;

-- ── Productos: todos ven los visibles; solo el admin crea, edita y borra ──
drop policy if exists "todos ven productos visibles" on public.products;
drop policy if exists "admin gestiona productos" on public.products;
drop policy if exists "ver productos" on public.products;
drop policy if exists "admin crea productos" on public.products;
drop policy if exists "admin edita productos" on public.products;
drop policy if exists "admin borra productos" on public.products;
create policy "ver productos" on public.products
  for select using (visible = true or (select public.is_admin()));
create policy "admin crea productos" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin edita productos" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin borra productos" on public.products
  for delete to authenticated using ((select public.is_admin()));

-- ── Pedidos: el admin ve todos; cada cliente ve los suyos ─────────
drop policy if exists "admin gestiona pedidos" on public.orders;
drop policy if exists "cliente ve sus pedidos" on public.orders;
drop policy if exists "ver pedidos" on public.orders;
drop policy if exists "admin crea pedidos" on public.orders;
drop policy if exists "admin edita pedidos" on public.orders;
drop policy if exists "admin borra pedidos" on public.orders;
create policy "ver pedidos" on public.orders
  for select to authenticated using ((select public.is_admin()) or user_id = (select auth.uid()));
create policy "admin crea pedidos" on public.orders
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin edita pedidos" on public.orders
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin borra pedidos" on public.orders
  for delete to authenticated using ((select public.is_admin()));

-- ── Cuentas de clientes ───────────────────────────────────────────
drop policy if exists "cliente gestiona su perfil" on public.customer_profiles;
create policy "cliente gestiona su perfil" on public.customer_profiles
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "cliente gestiona su carrito" on public.customer_carts;
create policy "cliente gestiona su carrito" on public.customer_carts
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ── Mensajes y administradores ────────────────────────────────────
drop policy if exists "admin gestiona mensajes" on public.contact_messages;
create policy "admin gestiona mensajes" on public.contact_messages
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins se ven a sí mismos" on public.admins;
create policy "admins se ven a sí mismos" on public.admins
  for select to authenticated using ((select public.is_admin()));

-- ── Función con ruta de búsqueda fija ─────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;

-- ── Fotos: se siguen viendo por su enlace público, pero no se puede listar la carpeta ──
drop policy if exists "fotos públicas" on storage.objects;
drop policy if exists "admin ve fotos" on storage.objects;
create policy "admin ve fotos" on storage.objects
  for select to authenticated using (bucket_id = 'productos' and (select public.is_admin()));

commit;
