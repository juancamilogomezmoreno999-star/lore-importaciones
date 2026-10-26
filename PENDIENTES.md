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
- Cuentas de clientes (carrito guardado, datos de envío, Mis pedidos) — probado y funcionando
- Seguridad: límite de intentos (activo) en pedidos, contacto e ingreso al panel (requiere correr `supabase/limite-de-intentos.sql`); botón de copia de seguridad de pedidos en el panel
- Revisión legal: políticas de privacidad, cookies, devoluciones y términos; datos del negocio (NIT 31.573.414-7, Cali); sin testimonios de ejemplo

## Por hacer (en este orden)
1. **Cambiar la llave secreta de Supabase** (quedó escrita en el chat).
2. **Verificación en dos pasos (2FA)** en Vercel, Supabase, GitHub y Bold.
3. **Security Advisor de Supabase**: correr `supabase/ajustes-seguridad.sql`; la protección contra contraseñas filtradas se activa al pasar a plan Pro.
4. **Productos reales**: subirlos desde el panel y ocultar los de ejemplo.
5. **Vercel Pro** con límite de gasto (Spend Management) de US$20–25, y dominio gratis.
6. **Correos automáticos** con Resend (y volver a encender "Confirm email" en Supabase).
7. **UptimeRobot** (aviso si la tienda se cae) y copia de seguridad semanal de pedidos (botón en Pedidos).
8. **Confirmar con Bold o con tu contador** si el 6% incluye retenciones.
9. **Testimonios reales** de clientes (con su permiso) y que un abogado revise los textos legales.
