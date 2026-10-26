# Lore Importaciones · Pendientes

Tienda: https://importaciones-lore-opzt.vercel.app
Panel: https://importaciones-lore-opzt.vercel.app/admin

## Enlaces importantes 🔖
| Para qué | Enlace |
|---|---|
| Tu tienda | https://importaciones-lore-opzt.vercel.app |
| Tu panel (productos, pedidos, mensajes) | https://importaciones-lore-opzt.vercel.app/admin |
| Bold (pagos y ventas) | https://panel.bold.co |
| Vercel (publicación y llaves) | https://vercel.com/lore-importaciones/importaciones-lore-opzt |
| Supabase (base de datos y usuario) | https://supabase.com/dashboard |
| GitHub (el código) | https://github.com/juancamilogomezmoreno999-star/importaciones-lore |

## Ya está listo ✅
- Tienda en línea, carrito y checkout
- Panel de administración conectado a Supabase
- Pedidos contra entrega y mensajes de contacto
- Pagos en línea con Bold, en producción (probado con un pago real de $1.000)
- Costo de la pasarela (6%) sumado a los pagos en línea (Bold confirmó que se puede cobrar al cliente); envío fijo de $15.000 sin envío gratis
- Pago por Nequi o Llave (318 200 4203) como opción recomendada; se confirma en el panel cambiando el pedido a Pagado
- Productos de entrega inmediata (⚡); contra entrega solo para esos productos
- Logo, colores de marca y videos reales (presentación de Lorena y pedidos llegando)
- Seguridad: límite de intentos en pedidos, contacto e ingreso al panel (requiere correr `supabase/limite-de-intentos.sql`); botón de copia de seguridad de pedidos en el panel
- Revisión legal: políticas de privacidad, cookies, devoluciones y términos; datos del negocio (NIT 31.573.414-7, Cali); sin testimonios de ejemplo

## Por hacer (en este orden)
1. **Confirmar con Bold o con tu contador** si el 6% incluye retenciones (si la comisión real es menor, bajar el porcentaje en `lib/config.ts`).
2. **Productos reales**: subirlos desde el panel y ocultar los 6 de ejemplo.
3. **Testimonios reales** de clientes (con su permiso) y que un abogado revise los textos legales.
4. **Cambiar la llave secreta de Supabase** (quedó escrita en el chat).
5. **Correos automáticos** con Resend.
6. **Dominio propio** (.com o .co).
7. **Vercel Pro** (US$20/mes) antes de vender: el plan gratis no permite uso comercial.
