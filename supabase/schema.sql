-- ════════════════════════════════════════════════════════════════
--  LORE IMPORTACIONES · Base de datos
--  Copia TODO este archivo en Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Administradores (correos que pueden entrar al panel) ─────────
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ── Productos ────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null default 'General',
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  images text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  delivery_time text not null default '8 a 12 días hábiles',
  featured boolean not null default false,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_visible_idx on public.products (visible, created_at desc);
create index if not exists products_category_idx on public.products (category);

-- ── Pedidos ──────────────────────────────────────────────────────
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number integer not null unique default nextval('public.order_number_seq'),
  customer_name text not null,
  customer_document text not null,
  phone text not null,
  email text not null,
  city text not null,
  department text not null,
  address text not null,
  notes text,
  items jsonb not null,
  subtotal integer not null,
  shipping integer not null default 0,
  total integer not null,
  payment_method text not null check (payment_method in ('wompi', 'contra_entrega')),
  payment_status text not null default 'pendiente'
    check (payment_status in ('pendiente', 'aprobado', 'rechazado', 'contra_entrega')),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'pagado', 'comprando_usa', 'en_transito', 'entregado', 'cancelado')),
  tracking text,
  wompi_transaction_id text,
  stock_discounted boolean not null default false,
  data_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- ── Mensajes de contacto ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── updated_at automático ────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ── Inventario: descontar / devolver stock de un pedido ──────────
create or replace function public.discount_order_stock(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  update public.orders set stock_discounted = true
    where id = p_order_id and stock_discounted = false;
  if not found then return; end if;
  for it in select * from jsonb_array_elements((select items from public.orders where id = p_order_id)) loop
    update public.products
      set stock = greatest(stock - (it ->> 'quantity')::int, 0)
      where id = (it ->> 'product_id')::uuid;
  end loop;
end; $$;

create or replace function public.restore_order_stock(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  if not (public.is_admin() or auth.role() = 'service_role') then
    raise exception 'no autorizado';
  end if;
  update public.orders set stock_discounted = false
    where id = p_order_id and stock_discounted = true;
  if not found then return; end if;
  for it in select * from jsonb_array_elements((select items from public.orders where id = p_order_id)) loop
    update public.products
      set stock = stock + (it ->> 'quantity')::int
      where id = (it ->> 'product_id')::uuid;
  end loop;
end; $$;

revoke all on function public.discount_order_stock(uuid) from public, anon, authenticated;
grant execute on function public.discount_order_stock(uuid) to service_role;
revoke all on function public.restore_order_stock(uuid) from public, anon;
grant execute on function public.restore_order_stock(uuid) to authenticated, service_role;

-- ── Seguridad a nivel de filas (RLS) ─────────────────────────────
alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "admins se ven a sí mismos" on public.admins;
create policy "admins se ven a sí mismos" on public.admins
  for select to authenticated using (public.is_admin());

drop policy if exists "todos ven productos visibles" on public.products;
create policy "todos ven productos visibles" on public.products
  for select using (visible = true or public.is_admin());

drop policy if exists "admin gestiona productos" on public.products;
create policy "admin gestiona productos" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin gestiona pedidos" on public.orders;
create policy "admin gestiona pedidos" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin gestiona mensajes" on public.contact_messages;
create policy "admin gestiona mensajes" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Nota: los pedidos y mensajes los crea el servidor con la llave de servicio,
-- así que el público no puede leer ni modificar pedidos de nadie.

-- ── Almacenamiento de fotos ──────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true;

drop policy if exists "fotos públicas" on storage.objects;
create policy "fotos públicas" on storage.objects
  for select using (bucket_id = 'productos');

drop policy if exists "admin sube fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'productos' and public.is_admin());

drop policy if exists "admin edita fotos" on storage.objects;
create policy "admin edita fotos" on storage.objects
  for update to authenticated using (bucket_id = 'productos' and public.is_admin());

drop policy if exists "admin borra fotos" on storage.objects;
create policy "admin borra fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'productos' and public.is_admin());

-- ── 6 productos de ejemplo (puedes editarlos o borrarlos desde el panel) ──
insert into public.products (slug, name, description, category, price, compare_at_price, images, variants, stock, delivery_time, featured)
values
('tenis-runner-pro', 'Tenis Runner Pro',
 E'Tenis livianos y cómodos para correr, entrenar o usar todo el día. Suela con amortiguación, malla transpirable y un diseño que combina con todo.\n\n• 100% originales, comprados en tiendas oficiales de USA\n• Tallas en numeración colombiana\n• Incluyen caja original',
 'Calzado', 389900, 459900, array['/demo/tenis-1.svg','/demo/tenis-2.svg'],
 '[{"name":"Talla","options":["36","37","38","39","40","41","42","43"]},{"name":"Color","options":["Blanco","Negro"]}]', 12, '8 a 12 días hábiles', true),
('bolso-monaco', 'Bolso de mano Mónaco',
 E'Bolso elegante de tamaño mediano, perfecto para el día a día o una salida especial. Correa ajustable y desmontable, varios bolsillos internos y cierre metálico dorado.\n\n• Medidas: 28 × 20 × 11 cm\n• Incluye bolsa protectora',
 'Bolsos', 249900, null, array['/demo/bolso-1.svg','/demo/bolso-2.svg'],
 '[{"name":"Color","options":["Negro","Beige","Vino"]}]', 6, '8 a 12 días hábiles', true),
('perfume-gold-oud-100ml', 'Perfume Gold Oud 100 ml',
 E'Fragancia intensa con notas de oud, ámbar y vainilla. Ideal para la noche y ocasiones especiales, con una duración de 8 a 10 horas.\n\n• Presentación: 100 ml, Eau de Parfum\n• Producto sellado y original',
 'Belleza', 319900, 380000, array['/demo/perfume-1.svg','/demo/perfume-2.svg'],
 '[]', 9, '1 a 3 días hábiles (disponible en Colombia)', true),
('audifonos-inalambricos-anc', 'Audífonos inalámbricos con cancelación de ruido',
 E'Sonido envolvente, cancelación activa de ruido y hasta 30 horas de batería. Plegables, con estuche rígido y carga rápida USB-C.\n\n• Bluetooth 5.3\n• Micrófono para llamadas\n• Garantía de 3 meses con nosotros',
 'Tecnología', 459900, 529900, array['/demo/audifonos-1.svg','/demo/audifonos-2.svg'],
 '[{"name":"Color","options":["Negro","Plateado"]}]', 4, '10 a 15 días hábiles', true),
('set-cuidado-facial', 'Set de cuidado facial: sérum + crema hidratante',
 E'Rutina completa para una piel hidratada y luminosa. Sérum con ácido hialurónico y vitamina C, más crema hidratante de uso diario.\n\n• Apto para todo tipo de piel\n• Sérum 30 ml + crema 50 ml',
 'Belleza', 159900, null, array['/demo/facial-1.svg','/demo/facial-2.svg'],
 '[]', 15, '1 a 3 días hábiles (disponible en Colombia)', false),
('reloj-clasico-dorado', 'Reloj clásico análogo',
 E'Reloj de diseño minimalista con caja de acero inoxidable y resistencia al agua 3 ATM. Un detalle que eleva cualquier look y un regalo que siempre queda bien.\n\n• Diámetro: 40 mm\n• Incluye estuche de regalo',
 'Accesorios', 289900, 340000, array['/demo/reloj-1.svg','/demo/reloj-2.svg'],
 '[{"name":"Color","options":["Dorado","Plateado"]}]', 7, '8 a 12 días hábiles', false)
on conflict (slug) do nothing;

-- ── ¡IMPORTANTE! Cambia este correo por el tuyo (el mismo con el que creaste tu usuario) ──
insert into public.admins (email) values ('TU-CORREO@gmail.com') on conflict do nothing;
