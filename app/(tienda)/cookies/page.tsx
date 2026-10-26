import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { store, LEGAL_UPDATED } from "@/lib/config";

export const metadata: Metadata = { title: "Política de cookies", alternates: { canonical: "/cookies" } };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" updated={LEGAL_UPDATED}>
      <p>Las cookies y el almacenamiento local son pequeños archivos que una página guarda en tu navegador. En {store.name} usamos <b>solo los estrictamente necesarios</b> para que la tienda funcione.</p>

      <h2>Lo que usamos</h2>
      <ul>
        <li><b>Carrito de compras</b> (almacenamiento local de tu navegador): recuerda los productos que agregaste, aunque cierres la página.</li>
        <li><b>Aviso de cookies</b> (almacenamiento local): recuerda que ya viste este aviso para no mostrártelo otra vez.</li>
        <li><b>Sesión de tu cuenta</b> (cookies): solo si inicias sesión, para mantenerte conectado/a y guardar tu carrito en tu cuenta. También la usa la administradora en el panel.</li>
      </ul>

      <h2>Lo que NO usamos</h2>
      <ul>
        <li>No usamos cookies de publicidad.</li>
        <li>No usamos herramientas de seguimiento ni analíticas (como Google Analytics o el píxel de Meta).</li>
        <li>No vendemos ni compartimos información de navegación con terceros.</li>
      </ul>

      <h2>Servicios externos</h2>
      <p>Si pagas con Bold o nos escribes por WhatsApp, esas plataformas pueden usar sus propias cookies según sus políticas. Solo se activan cuando tú decides usarlas.</p>

      <h2>Cómo borrarlas</h2>
      <p>Puedes borrar las cookies y el almacenamiento local desde la configuración de tu navegador. Si lo haces, se vaciará tu carrito.</p>

      <p>Si en el futuro agregamos herramientas de analíticas o publicidad, actualizaremos esta política y te pediremos tu consentimiento antes de activarlas. Más información en nuestra <Link href="/privacidad">política de tratamiento de datos</Link>.</p>
    </LegalPage>
  );
}
