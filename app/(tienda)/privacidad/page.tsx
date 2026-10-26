import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { legalContact, legalIdentity, store } from "@/lib/config";

export const metadata: Metadata = { title: "Política de privacidad y tratamiento de datos", alternates: { canonical: "/privacidad" } };

// Texto base conforme a la Ley 1581 de 2012 y el Decreto 1074 de 2015. Conviene que un abogado lo revise.
export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad y tratamiento de datos personales" updated="octubre de 2026">
      <p>En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas aplicables, {legalIdentity}, propietaria de {store.name}, informa cómo recolecta, usa y protege tus datos personales.</p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Nombre: {store.legalName}</li>
        {store.legalId && <li>Identificación: {store.legalId}</li>}
        {store.city && <li>Ubicación: {store.city}</li>}
        {store.email && <li>Correo: {store.email}</li>}
        <li>WhatsApp: {store.whatsappDisplay}</li>
      </ul>

      <h2>2. Datos que recolectamos (solo los necesarios)</h2>
      <ul>
        <li><b>Para tu pedido:</b> nombre, cédula (la exigen las transportadoras y la facturación), celular, correo, departamento, ciudad y dirección de entrega.</li>
        <li><b>Para el formulario de contacto:</b> nombre, correo, celular (opcional) y tu mensaje.</li>
      </ul>
      <p>No recolectamos ni guardamos datos de tarjetas ni cuentas bancarias: los pagos en línea los procesa directamente Bold, y las transferencias por Nequi o Llave se hacen desde tu propia aplicación.</p>

      <h2>3. Finalidades</h2>
      <ul>
        <li>Procesar, facturar, enviar y hacer seguimiento a tus pedidos.</li>
        <li>Comunicarnos contigo sobre el estado de tu compra por correo, llamada o WhatsApp.</li>
        <li>Atender peticiones, quejas, reclamos, garantías y devoluciones.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
      </ul>
      <p>No usamos tus datos para publicidad ni los vendemos a nadie.</p>

      <h2>4. Con quién compartimos tus datos (encargados)</h2>
      <p>Solo compartimos lo necesario con estos proveedores, que nos ayudan a operar y deben proteger tu información:</p>
      <ul>
        <li><b>Supabase</b>: base de datos donde se guardan los pedidos y mensajes (servidores en Estados Unidos).</li>
        <li><b>Vercel</b>: alojamiento de esta página web (servidores en Estados Unidos).</li>
        <li><b>Bold</b>: pasarela de pagos en línea (tarjeta y PSE).</li>
        <li><b>WhatsApp (Meta)</b>: cuando decides escribirnos por ese medio.</li>
        <li><b>Servicio de correo electrónico</b>: para enviarte la confirmación y el estado de tu pedido.</li>
        <li><b>Transportadoras</b>: nombre, celular y dirección para entregarte el pedido.</li>
      </ul>
      <p>Al aceptar esta política autorizas la transferencia de tus datos a estos proveedores, algunos ubicados fuera de Colombia, únicamente para las finalidades descritas.</p>

      <h2>5. Cookies y analíticas</h2>
      <p>Esta página no usa cookies de publicidad ni herramientas de seguimiento o analíticas. Solo usamos almacenamiento técnico necesario, como el que recuerda tu carrito. Más detalles en la <Link href="/cookies">política de cookies</Link>.</p>

      <h2>6. Tus derechos</h2>
      <p>Como titular de los datos tienes derecho a: conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización otorgada; ser informado/a sobre el uso que les damos; presentar quejas ante la Superintendencia de Industria y Comercio (SIC); revocar la autorización o solicitar la supresión de tus datos cuando no exista un deber legal de conservarlos; y acceder gratuitamente a ellos.</p>

      <h2>7. Cómo ejercer tus derechos</h2>
      <p>Escríbenos {legalContact}, indicando tu nombre, cédula y tu solicitud. Las consultas se responden en máximo diez (10) días hábiles y los reclamos en máximo quince (15) días hábiles, según los artículos 14 y 15 de la Ley 1581 de 2012.</p>

      <h2>8. Seguridad y conservación</h2>
      <p>Tu información viaja cifrada (HTTPS) y solo la administradora del negocio tiene acceso al panel, protegido con usuario y contraseña. Conservamos los datos mientras sean necesarios para las finalidades descritas y para cumplir obligaciones legales.</p>

      <h2>9. Vigencia</h2>
      <p>Esta política rige desde su publicación. Cualquier cambio importante será publicado en esta página.</p>
    </LegalPage>
  );
}
