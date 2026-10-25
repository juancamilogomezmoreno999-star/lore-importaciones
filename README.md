# Lore Importaciones · Tienda online

Tienda online con panel de administración para **Lore Importaciones**.
Hecha con **Next.js 16 + Supabase + Wompi + Resend**. Pensada primero para celular.

> 💡 **Puedes verla sin configurar nada.** Si no hay datos de Supabase, la tienda funciona en
> *modo demostración* con 6 productos de ejemplo (el carrito y el checkout funcionan, pero no se guardan pedidos).

---

## Índice

1. [¿Qué incluye?](#1-qué-incluye)
2. [¿Por qué esta tecnología y cuánto cuesta al mes?](#2-por-qué-esta-tecnología-y-cuánto-cuesta-al-mes)
3. [Guía para publicar la tienda, paso a paso](#3-guía-para-publicar-la-tienda-paso-a-paso)
4. [Conectar Wompi (pagos)](#4-conectar-wompi-pagos)
5. [Correos automáticos (Resend)](#5-correos-automáticos-resend)
6. [Cómo usar el panel](#6-cómo-usar-el-panel)
7. [Personalizar: logo, colores, WhatsApp y envíos](#7-personalizar-logo-colores-whatsapp-y-envíos)
8. [Lista de verificación antes de lanzar](#8-lista-de-verificación-antes-de-lanzar)
9. [Para el desarrollador](#9-para-el-desarrollador)

---

## 1. ¿Qué incluye?

**Para tus clientes**
- Inicio con banner, productos destacados, “¿Cómo funciona?”, testimonios y botón de WhatsApp.
- Catálogo con búsqueda por nombre y filtros por categoría, precio y orden.
- Página de producto: galería deslizable, descripción, tallas/colores, stock, tiempo de entrega y “Agregar al carrito”.
- Carrito y checkout: nombre, cédula, celular, correo, departamento, ciudad, dirección, resumen y costo de envío.
- Pagos con **Wompi** (tarjeta, PSE, Nequi, Bancolombia…) y **pago contra entrega** opcional.
  **Nunca se guardan datos de tarjetas en tu servidor**: el cliente paga en la página segura de Wompi.
- Página de seguimiento del pedido con su estado.
- Botón flotante de WhatsApp (318 200 4203) con mensaje prellenado, formulario de contacto e Instagram.
- Sobre nosotros, Preguntas frecuentes, Términos y condiciones y Política de datos (Ley 1581).
- SEO: títulos y descripciones, `sitemap.xml`, `robots.txt`, datos estructurados para Google e imágenes optimizadas.

**Para ti (panel en `/admin`)**
- Inicio con ventas del mes, pedidos pendientes y mensajes sin leer.
- Productos: crear, editar, ocultar/mostrar y eliminar. Precio anterior para ofertas, variantes, stock y
  **hasta 12 fotos subidas desde el celular** (se comprimen automáticamente).
- Pedidos: ver datos del cliente, cambiar el estado (pagado → comprando en USA → en tránsito → entregado)
  y **el cliente recibe un correo con cada cambio**. Botón para escribirle por WhatsApp.
- Mensajes del formulario de contacto.
- El inventario se descuenta solo cuando se aprueba un pago y se devuelve si cancelas el pedido.

**Seguridad**
- HTTPS automático (Vercel).
- Contraseñas cifradas por Supabase Auth (bcrypt); nunca se guardan en texto plano.
- Panel protegido en tres capas: sesión obligatoria, lista de correos administradores y reglas de la base de
  datos (RLS) que impiden que alguien de afuera lea o modifique pedidos, aunque conozca las direcciones.
- Precios y stock se recalculan en el servidor (nadie puede cambiar el precio desde su navegador).
- Los pagos se confirman verificando la firma de Wompi y el monto exacto.

---

## 2. ¿Por qué esta tecnología y cuánto cuesta al mes?

| Pieza | Para qué sirve | Por qué la elegí |
|---|---|---|
| **Next.js** | La página web | Es la tecnología más usada para tiendas rápidas. Carga muy rápido en celular y es excelente para Google. |
| **Vercel** | Donde vive la página (hosting) | Lo hacen los mismos creadores de Next.js. HTTPS gratis, publicación automática, servidores rápidos. |
| **Supabase** | Base de datos, usuarios y fotos | Todo en un solo lugar, con panel visual (como una hoja de cálculo) y copias de seguridad. Plan gratis generoso. |
| **Wompi** | Pagos | Pasarela colombiana del Grupo Bancolombia. Acepta tarjeta, PSE, Nequi, Bancolombia. Sin mensualidad. |
| **Resend** | Correos automáticos | Fácil de configurar, 3.000 correos gratis al mes. |

### Costo mensual aproximado (valores de referencia; verifica en cada página porque cambian)

| Concepto | Para empezar | Cuando crezcas |
|---|---|---|
| Vercel (hosting) | **US$20/mes** (plan Pro)* | US$20/mes |
| Supabase (base de datos + fotos) | **US$0** (plan Free) | US$25/mes (plan Pro) |
| Resend (correos) | **US$0** (hasta 3.000/mes) | US$20/mes |
| Dominio `.com` | ≈ US$12–15 **al año** | |
| Dominio `.co` | ≈ US$30–45 **al año** | |
| Wompi | **Sin mensualidad.** Comisión por venta aprox. 2,65 % + $700 COP + IVA | |
| **Total al mes** | **≈ US$21–24 (≈ $85.000–$100.000 COP)** | ≈ US$45–70 |

\* El plan gratis de Vercel (Hobby) **no permite uso comercial**, por eso recomiendo el Pro para una tienda.
Puedes hacer todas las pruebas en el plan gratis y pasarte al Pro antes de vender.

**Nota sobre Supabase Free:** si el proyecto no recibe visitas durante 7 días seguidos se “pausa” (se reactiva
desde el panel de Supabase). Con una tienda activa no suele pasar; si te preocupa, pasa al plan Pro.

---

## 3. Guía para publicar la tienda, paso a paso

Tiempo estimado: 1 a 2 horas la primera vez. No necesitas instalar nada en tu computador.

### Paso 1 · Crea las cuentas (todas gratis para empezar)

1. **GitHub** → https://github.com/signup (aquí se guarda el código).
2. **Supabase** → https://supabase.com (entra con tu cuenta de GitHub).
3. **Vercel** → https://vercel.com/signup (entra con tu cuenta de GitHub).
4. **Wompi** → https://comercios.wompi.co (cuenta de comercio; te pedirán RUT/cédula y cuenta bancaria).
5. **Resend** → https://resend.com (para los correos).

### Paso 2 · Configura Supabase (la base de datos)

1. En Supabase, clic en **New project**.
   - Nombre: `lore-importaciones`
   - Contraseña de base de datos: genera una segura y **guárdala**.
   - Región: **East US (North Virginia)** o **São Paulo** (las más cercanas a Colombia).
2. Cuando el proyecto esté listo, ve al menú izquierdo → **SQL Editor** → **New query**.
3. Abre el archivo `supabase/schema.sql` de este proyecto, copia **todo** su contenido y pégalo.
4. **Antes de ejecutar**, baja hasta la última línea y cambia `TU-CORREO@gmail.com` por tu correo real.
5. Clic en **Run**. Debe decir *Success*. Esto crea las tablas, la seguridad, el espacio para fotos y los 6 productos de ejemplo.
6. Crea tu usuario de administrador: menú **Authentication → Users → Add user → Create new user**.
   - Usa **el mismo correo** del punto 4 y una contraseña fuerte (mínimo 12 caracteres).
   - Marca **Auto Confirm User**.
7. Evita que extraños creen cuentas: **Authentication → Sign In / Providers** → desactiva **Allow new users to sign up**.
8. Copia tus llaves: **Project Settings → API** (o *API Keys*). Necesitarás:
   - `Project URL` → será `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (**secreta**, no la compartas con nadie) → será `SUPABASE_SERVICE_ROLE_KEY`

> ¿Quieres agregar otra persona administradora? Crea su usuario (punto 6) y en SQL Editor ejecuta:
> `insert into public.admins (email) values ('correo@ejemplo.com');`

### Paso 3 · Sube el código a GitHub

1. En GitHub, clic en **+ → New repository**, nombre `lore-importaciones`, privado (**Private**), **Create repository**.
2. En la página del repositorio vacío, clic en **uploading an existing file**.
3. Arrastra **todas** las carpetas y archivos de este proyecto **excepto** `node_modules` y `.next` (si existen).
4. Clic en **Commit changes**.

### Paso 4 · Publica en Vercel

1. En Vercel: **Add New… → Project** → elige el repositorio `lore-importaciones` → **Import**.
2. Abre **Environment Variables** y agrega una por una (los nombres están en `.env.example`):

   | Nombre | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | Por ahora `https://lore-importaciones.vercel.app` (luego tu dominio) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public de Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role de Supabase |
   | `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | (paso 4 de Wompi, más abajo) |
   | `WOMPI_INTEGRITY_SECRET` | (Wompi) |
   | `WOMPI_EVENTS_SECRET` | (Wompi) |
   | `RESEND_API_KEY` | (Resend) |
   | `EMAIL_FROM` | `Lore Importaciones <pedidos@tudominio.com>` |
   | `ADMIN_NOTIFY_EMAIL` | Tu correo, para recibir aviso de pedidos y mensajes |

   Si aún no tienes Wompi o Resend, déjalas para después: la tienda funciona igual (sin pago en línea / sin correos).
3. Clic en **Deploy**. En 1–2 minutos tendrás tu tienda en `https://algo.vercel.app`. 🎉
4. Prueba entrar a `https://tu-tienda.vercel.app/admin` con el usuario del Paso 2.

> **Cada vez que cambies una variable** en Vercel, ve a **Deployments → ⋯ → Redeploy** para que tome efecto.

### Paso 5 · Conecta tu dominio (.com o .co)

1. Compra el dominio. Opciones: directamente en **Vercel → Domains → Buy** (lo más fácil, queda conectado solo),
   o en **Namecheap**, **GoDaddy** o **Cloudflare**. Para `.co` también **GoDaddy** o **Namecheap**.
   - `.com` es más conocido mundialmente y más barato. `.co` suena a Colombia, pero cuesta más y la gente a veces escribe `.com` por error.
   - Recomendación: compra el `.com` (y si puedes, también el `.co` y redirígelo al `.com`).
2. Si lo compraste fuera de Vercel: en Vercel → tu proyecto → **Settings → Domains → Add**, escribe `loreimportaciones.com`.
   Vercel te mostrará unos registros (tipo **A** y **CNAME**). Cópialos en el panel DNS de donde compraste el dominio.
   Puede tardar desde minutos hasta 24 horas. El HTTPS (candadito) se activa solo.
3. Agrega también `www.loreimportaciones.com` y deja que redirija al dominio principal.
4. Actualiza `NEXT_PUBLIC_SITE_URL` en Vercel con tu dominio (`https://loreimportaciones.com`) y haz **Redeploy**.
5. En Supabase → **Authentication → URL Configuration** → **Site URL** = tu dominio.

### Paso 6 · Aparece en Google

1. Entra a https://search.google.com/search-console → **Agregar propiedad** → tu dominio.
2. Verifica (Google te da un registro DNS para pegar donde compraste el dominio).
3. En **Sitemaps** escribe `sitemap.xml` y envía.
4. Crea también tu **Perfil de Empresa en Google** (Google Maps) y pon el enlace de la web.

---

## 4. Conectar Wompi (pagos)

**Cómo funciona:** el cliente llena sus datos → clic en *Pagar* → va a la página segura de Wompi
(tarjeta, PSE, Nequi, Bancolombia, etc.) → paga → vuelve a tu tienda y ve su pedido confirmado.
Wompi también avisa a tu tienda por detrás (webhook), así que el pedido se marca como **Pagado** aunque el cliente cierre el navegador.

### 4.1 Primero en modo de pruebas (sin dinero real)

1. Entra a https://comercios.wompi.co → menú **Desarrolladores**.
2. Asegúrate de estar en el ambiente de **Pruebas (Sandbox)**.
3. Copia:
   - **Llave pública** (`pub_test_...`) → `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`
   - En **Secretos para integración técnica**: **Integridad** (`test_integrity_...`) → `WOMPI_INTEGRITY_SECRET`
   - **Eventos** (`test_events_...`) → `WOMPI_EVENTS_SECRET`
4. En **URL de Eventos** (sandbox) escribe: `https://TU-DOMINIO/api/wompi/webhook` y guarda.
5. Pégalas en Vercel y haz **Redeploy**.
6. Haz una compra de prueba. Wompi tiene datos de prueba, por ejemplo:
   - Tarjeta aprobada: `4242 4242 4242 4242`, cualquier fecha futura y CVC `123`.
   - Tarjeta rechazada: `4111 1111 1111 1111`.
   - Nequi aprobado: celular `3991111111`. (Consulta la lista vigente en https://docs.wompi.co/docs/colombia/datos-de-prueba-en-sandbox/)
7. Revisa en `/admin/pedidos` que el pedido aparezca como **Pagado** y que el stock haya bajado.

### 4.2 Pasar a producción (dinero real)

1. Completa la verificación de tu comercio en Wompi (documentos y cuenta bancaria donde recibirás el dinero).
2. Cambia a ambiente de **Producción** y copia las llaves `pub_prod_...`, `prod_integrity_...`, `prod_events_...`.
3. Configura la **URL de Eventos** de producción: `https://TU-DOMINIO/api/wompi/webhook`.
4. Reemplaza las 3 variables en Vercel → **Redeploy**.
   La tienda detecta sola si la llave es de prueba (`pub_test_`) o de producción (`pub_prod_`).
5. Haz una compra real pequeña para confirmar (puedes reembolsarla desde Wompi).

**¿Prefieres Mercado Pago o PayU?** Se puede cambiar: toda la lógica de pagos está en `lib/wompi.ts`,
`lib/payments.ts` y `app/api/wompi/webhook/route.ts`. Elegí Wompi porque es colombiano, tiene Nequi y PSE
integrados, no cobra mensualidad y su integración es la más sencilla y segura.

### Pago contra entrega

Está activado para todo el país. Para limitarlo a ciertas ciudades, cobrar un recargo o apagarlo,
edita `lib/config.ts` → `payments.cashOnDelivery`. Ejemplo para solo Cali y Jamundí con recargo de $5.000:

```ts
cashOnDelivery: { enabled: true, cities: ["Cali", "Jamundí"], fee: 5000 },
```

---

## 5. Correos automáticos (Resend)

Se envían correos cuando: el cliente hace un pedido, se aprueba el pago, y cada vez que cambias el estado
del pedido en el panel. Tú recibes aviso de pedidos nuevos y mensajes de contacto en `ADMIN_NOTIFY_EMAIL`.

1. En https://resend.com → **Domains → Add Domain** → escribe tu dominio.
2. Resend te dará 3 o 4 registros DNS; pégalos donde compraste el dominio (o en Vercel → Domains si lo compraste allá). Espera a que salga **Verified**.
3. **API Keys → Create API Key** (permiso *Sending access*) → cópiala en `RESEND_API_KEY`.
4. `EMAIL_FROM` debe usar ese dominio, por ejemplo `Lore Importaciones <pedidos@loreimportaciones.com>`.
5. **Redeploy** en Vercel.

---

## 6. Cómo usar el panel

Entra a **`https://tudominio.com/admin`** desde el celular o el computador.
Consejo: en el celular, abre esa dirección y usa *“Agregar a pantalla de inicio”*: te queda como una app.

- **Agregar producto:** *Productos → + Nuevo* → toca **📷 Agregar fotos** (puedes tomarlas con la cámara o elegirlas
  de la galería) → nombre, descripción, categoría, precio → **Guardar**. Aparece en la tienda en segundos.
  - **Oferta:** pon el precio nuevo en *Precio* y el de antes en *Precio anterior*. Se mostrará tachado con el % de descuento.
  - **Tallas / colores:** escríbelos separados por comas: `S, M, L` o `Negro, Blanco`.
  - **Precio:** solo números, sin puntos: `389900`.
  - **Destacado:** sale en la página de inicio. **Visible:** apágalo para ocultarlo sin borrarlo.
- **Pedidos:** abre un pedido, elige el nuevo estado, escribe la guía de la transportadora si la tienes, deja marcado
  *“Enviar correo al cliente”* → **Guardar**. Si eliges *Cancelado*, las unidades vuelven al inventario.
- **Mensajes:** responde por correo o WhatsApp con un toque y márcalos como leídos.

---

## 7. Personalizar: logo, colores, WhatsApp y envíos

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, WhatsApp, Instagram, correo, NIT | `lib/config.ts` → `store` |
| Costo de envío y envío gratis | `lib/config.ts` → `shipping` |
| Colores (negro y dorado) | `app/globals.css` → bloque `@theme` |
| Logo | Guarda tu logo como `public/logo.png` y sigue la instrucción dentro de `components/Logo.tsx` |
| Ícono de la pestaña | `app/icon.svg` (o reemplázalo por `app/icon.png`) |
| Testimonios y textos del inicio | `app/(tienda)/page.tsx` |
| Preguntas frecuentes | `app/(tienda)/preguntas-frecuentes/page.tsx` |
| Términos y privacidad | `app/(tienda)/terminos/page.tsx` y `app/(tienda)/privacidad/page.tsx` |

Puedes editar cualquier archivo directamente en GitHub (abre el archivo → ícono del lápiz → **Commit changes**).
Vercel publica el cambio solo en 1–2 minutos.

**Cuando me pases el logo** ajusto los tonos exactos del dorado y el negro para que coincidan.

---

## 8. Lista de verificación antes de lanzar

- [ ] Cambiaste el correo en `schema.sql` (tabla `admins`) y desactivaste el registro de usuarios en Supabase.
- [ ] Reemplazaste los **testimonios de ejemplo** por opiniones reales de tus clientes (con su permiso).
- [ ] Revisaste las **preguntas frecuentes**: tiempos, si el precio incluye impuestos, garantía y devoluciones según *tu* forma de trabajar.
- [ ] Completaste en `lib/config.ts` tu **NIT o cédula** (`legalId`) y el correo de contacto real.
- [ ] Un abogado revisó **Términos** y **Política de datos** (son una buena base, pero cada negocio es distinto).
- [ ] Borraste u ocultaste los 6 productos de ejemplo y subiste los tuyos con fotos reales.
- [ ] Hiciste una compra de prueba con Wompi en sandbox, otra contra entrega, y llegaron los correos.
- [ ] Pasaste Wompi a producción y configuraste la URL de eventos.
- [ ] Vercel en plan Pro (uso comercial).
- [ ] Enviaste el sitemap en Google Search Console.

---

## 9. Para el desarrollador

```bash
npm install
cp .env.example .env.local   # opcional: sin variables corre en modo demostración
npm run dev                  # http://localhost:3000
npm run build && npm start   # producción
```

**Estructura**

```
app/
  (tienda)/            páginas públicas: inicio, catálogo, producto, carrito, checkout, pedido, contacto, legales
  admin/login          ingreso (Supabase Auth, server action)
  admin/(panel)/       dashboard, productos, pedidos, mensajes (requireAdmin en layout y en cada acción)
  api/wompi/webhook    eventos de Wompi (firma SHA-256 verificada)
  sitemap.ts robots.ts
components/            UI de la tienda y del panel
lib/
  config.ts            datos del negocio, envíos y medios de pago
  data.ts              lectura de productos (Supabase o datos de ejemplo)
  wompi.ts payments.ts integración de pagos
  email.ts             plantillas y envío con Resend
  supabase/            clientes: público (caché), sesión (panel), servicio (servidor)
proxy.ts               protege /admin (Next 16: antes "middleware")
supabase/schema.sql    tablas, RLS, funciones de inventario, bucket de fotos y datos semilla
```

**Decisiones**
- Páginas públicas con ISR (`revalidate = 60`) y `revalidatePath` al guardar en el panel: carga instantánea y cambios visibles al momento.
- Las acciones del panel usan el cliente con la sesión del admin, así RLS sigue aplicando; la llave de servicio solo se usa en el servidor para crear pedidos, leer stock y procesar webhooks.
- Wompi Web Checkout con firma de integridad; la confirmación se valida por webhook firmado **y** consultando la API de Wompi al volver el cliente, comparando referencia y monto. El proceso es idempotente.
- Inventario: se descuenta al aprobar el pago (o al crear un pedido contra entrega) con una función SQL `security definer` solo ejecutable por el servidor, y se restituye al cancelar.
- Fotos: se redimensionan a 1600 px y se convierten a WebP en el navegador antes de subir a Supabase Storage; `next/image` sirve AVIF/WebP según el dispositivo.
