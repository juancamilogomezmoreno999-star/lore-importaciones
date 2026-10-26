// ─────────────────────────────────────────────────────────────
// Datos del negocio. Cambia aquí y se actualiza en toda la web.
// ─────────────────────────────────────────────────────────────

export const store = {
  name: "Lore Importaciones",
  shortName: "Lore",
  tagline: "Lo mejor de Estados Unidos, directo a tu puerta en Colombia",
  description:
    "Importamos productos originales desde Estados Unidos y te los entregamos en cualquier ciudad de Colombia. Tenis, bolsos, perfumes, tecnología y más, con pago seguro y acompañamiento por WhatsApp.",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  whatsapp: "573182004203", // con indicativo 57, sin espacios ni +
  whatsappDisplay: "318 200 4203",
  whatsappMessage: "¡Hola Lore Importaciones! 👋 Vengo de la página web y quiero más información.",
  instagram: "lore_importaciones",
  // ⚠️ Pon aquí un correo real que revises (se muestra en la web y en las políticas)
  email: "",
  // Datos del negocio (Ley 1480 y Ley 1581). Complétalos: se muestran en el pie de página.
  legalName: "Lorena Moreno Preciado",
  legalId: "", // NIT o cédula, ej: "C.C. 12.345.678" o "NIT 900.123.456-7"
  city: "", // ciudad y departamento, ej: "Cali, Valle del Cauca"
};

// Testimonios: SOLO opiniones reales de clientes, con su permiso. Si la lista está vacía, la sección no se muestra.
export const testimonials: { name: string; city: string; text: string }[] = [];

export const shipping = {
  // Costo de envío nacional en pesos
  cost: 15000,
  // Envío gratis desde este valor de compra (0 = nunca gratis)
  freeFrom: 0,
};

export const payments = {
  online: true, // pago en línea con Bold
  // Costo de la pasarela que se le suma al cliente cuando paga en línea (0 = no se cobra).
  // Se calcula para que, después de la comisión de Bold, recibas el valor completo del pedido.
  onlineFeePercent: 6,
  // Transferencia a Nequi o Llave (Bre-B): el cliente envía el dinero y manda el comprobante por WhatsApp
  nequi: {
    enabled: true,
    number: "3182004203",
    display: "318 200 4203",
  },
  cashOnDelivery: {
    enabled: true,
    // Ciudades donde aceptas contra entrega. Lista vacía = todo el país.
    cities: [] as string[],
    // Recargo opcional por contra entrega (0 = sin recargo)
    fee: 0,
  },
};

export function whatsappLink(message: string = store.whatsappMessage) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const instagramLink = `https://instagram.com/${store.instagram}`;

/** Cómo contactar al negocio para temas legales (correo si existe, si no WhatsApp). */
export const legalContact = store.email
  ? `al correo ${store.email} o por WhatsApp al ${store.whatsappDisplay}`
  : `por WhatsApp al ${store.whatsappDisplay} o en el formulario de contacto de esta página`;

/** "Lorena Moreno Preciado (C.C. …)" o solo el nombre si aún no se ha puesto la identificación. */
export const legalIdentity = store.legalId ? `${store.legalName} (${store.legalId})` : store.legalName;
