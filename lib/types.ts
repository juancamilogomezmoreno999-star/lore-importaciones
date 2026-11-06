/** `unavailable`: opciones que se muestran tachadas (por ejemplo tallas agotadas). */
export type Variant = {
  name: string;
  options: string[];
  unavailable?: string[];
  /** Solo en Talla: tallas agotadas por cada color, ej. { Negro: ["M"], Blanco: ["S", "XL"] } */
  unavailableBy?: Record<string, string[]>;
  /** Solo en Color: la foto de cada color, ej. { Negro: "https://…/negra.webp" } */
  images?: Record<string, string>;
};

/** Foto que corresponde a lo elegido (la del color, si tiene); si no, la principal. */
export function imageFor(variants: Variant[], selected: Record<string, string>, fallback: string | null) {
  const color = variants.find((v) => v.name.toLowerCase() === "color");
  const chosen = color ? selected[color.name] : undefined;
  return (chosen && color?.images?.[chosen]) || fallback;
}

/** Opciones agotadas de una variante según lo elegido en las demás (tallas por color). */
export function unavailableFor(v: Variant, selected: Record<string, string>, all: Variant[]): string[] {
  if (v.unavailableBy) {
    const colorName = all.find((x) => x.name.toLowerCase() === "color")?.name;
    const color = colorName ? selected[colorName] : undefined;
    if (color) return v.unavailableBy[color] ?? [];
    // Sin color elegido: solo se tachan las tallas que no hay en ningún color
    const lists = Object.values(v.unavailableBy);
    const colors = all.find((x) => x.name.toLowerCase() === "color")?.options ?? [];
    if (lists.length < colors.length) return [];
    return v.options.filter((o) => colors.every((c) => (v.unavailableBy![c] ?? []).includes(o)));
  }
  return v.unavailable ?? [];
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  variants: Variant[];
  stock: number;
  delivery_time: string;
  featured: boolean;
  visible: boolean;
  immediate_delivery?: boolean; // ya está en Colombia: se puede pagar contra entrega
  created_at?: string;
};

export type OrderItem = {
  product_id: string | null; // null en la línea del costo del pago en línea
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  variant: Record<string, string>;
};

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "comprando_usa"
  | "en_transito"
  | "entregado"
  | "cancelado";

export type PaymentMethod = "en_linea" | "contra_entrega" | "nequi";
export type PaymentStatus = "pendiente" | "aprobado" | "rechazado" | "contra_entrega";

export type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_document: string;
  phone: string;
  email: string;
  city: string;
  department: string;
  address: string;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  tracking: string | null;
  payment_id: string | null;
  stock_discounted: boolean;
  data_consent?: boolean;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
};
