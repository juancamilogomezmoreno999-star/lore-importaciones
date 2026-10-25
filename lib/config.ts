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
  email: "contacto@loreimportaciones.com",
  city: "Colombia",
  // Datos del responsable del tratamiento de datos (Ley 1581). Complétalos.
  legalName: "Lore Importaciones",
  legalId: "NIT / C.C. por completar",
};

export const shipping = {
  // Costo de envío nacional en pesos
  cost: 15000,
  // Envío gratis desde este valor de compra (0 = nunca gratis)
  freeFrom: 400000,
};

export const payments = {
  online: true, // pago en línea con Bold
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
