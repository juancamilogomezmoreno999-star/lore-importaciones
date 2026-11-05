# Lore Importaciones · contexto del proyecto

Tienda online de Lorena Moreno Preciado (NIT 31.573.414-7, Cali). Importa productos de USA y los vende en Colombia.
Quien escribe suele ser su hijo (no programador). Todo el texto de la web va en español colombiano; las respuestas al usuario también, en pasos simples.

## Enlaces
- Tienda: https://importaciones-lore-opzt.vercel.app · Panel: /admin
- Repo: github.com/juancamilogomezmoreno999-star/importaciones-lore (rama main; Vercel publica solo al hacer push)
- Commits con autor `juancamilogomezmoreno999-star <329124041+juancamilogomezmoreno999-star@users.noreply.github.com>` (si no, Vercel Hobby bloquea el deploy)
- Supabase (base de datos, auth, fotos), Bold (pagos), Vercel (hosting, plan Hobby por ahora)

## Stack
Next.js 16 (App Router, `proxy.ts` en vez de middleware) + Tailwind v4 + Supabase + Bold. Ver `lib/config.ts` para datos del negocio, envío ($15.000 fijo), % de pasarela (6%), Nequi/Llave 318 200 4203.

## Reglas de negocio
- Dos modalidades: **Entrega inmediata** (`immediate_delivery`, 1–3 días, permite contra entrega) y **Por encargo** (15–20 días hábiles).
- Pagos: Nequi o Llave (recomendado, se confirma a mano en el panel), Bold (tarjeta/PSE, suma 6%), contra entrega solo con todos los productos de entrega inmediata.
- Ventas del mes solo cuentan pedidos en pagado o posterior.
- Garantía según cada marca; retracto 5 días hábiles; textos legales en `app/(tienda)/{terminos,privacidad,devoluciones,cookies}`.
- Registro de consentimientos (`consent_log`) con dos casillas separadas.
- Textos de Nosotros y Preguntas frecuentes los escribió la mamá: no cambiarlos sin pedirlo.

## Diseño ("Itinerario")
Papel blanco, negro puro, oro del logo `#BE9B62`. Títulos Bodoni Moda (opsz 14, peso 600 para legibilidad), texto Archivo. Firma: ruta punteada con avión (`components/FlightRoute.tsx`), etiquetas de equipaje (`.tag`). Evitar estilo genérico de IA.

## Base de datos
`supabase/schema.sql` es la fuente completa. Cambios nuevos se le dan al usuario como SQL para pegar en Supabase → SQL Editor.

## Pendientes
Ver `PENDIENTES.md`. Nunca escribir llaves o contraseñas en el repo ni pedirlas por chat.
