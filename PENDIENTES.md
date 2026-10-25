# Lore Importaciones · Pendientes

Tienda: https://importaciones-lore-opzt.vercel.app
Panel: https://importaciones-lore-opzt.vercel.app/admin

## Ya está listo ✅
- Tienda en línea, carrito y checkout
- Panel de administración conectado a Supabase
- Pedidos contra entrega y mensajes de contacto

## Por hacer (en este orden)
1. **Bold (pagos en línea)**: en panel.bold.co → Integraciones → Llaves de integración (ambiente de Pruebas).
   Si no aparece, pedirle a Bold que active el "Botón de pagos para integración manual".
   En Vercel van `NEXT_PUBLIC_BOLD_API_KEY` (Config) y `BOLD_SECRET_KEY` (Secret).
   Webhook en Bold: `https://importaciones-lore-opzt.vercel.app/api/bold/webhook`
2. **Productos reales**: subirlos desde el panel y ocultar los 6 de ejemplo.
3. **Textos**: cambiar los testimonios de ejemplo, revisar preguntas frecuentes y poner NIT/cédula en `lib/config.ts`.
4. **Cambiar la llave secreta de Supabase** (quedó escrita en el chat).
5. **Correos automáticos** con Resend.
6. **Dominio propio** (.com o .co).
7. **Vercel Pro** (US$20/mes) antes de vender: el plan gratis no permite uso comercial.
