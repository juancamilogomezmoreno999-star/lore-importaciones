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

/** Clave de una combinación: "Color=Negro&Talla=M" (mismo orden que en la base de datos). */
export function variantKey(variant: Record<string, string>) {
  return Object.keys(variant)
    .sort()
    .map((k) => `${k}=${variant[k]}`)
    .join("&");
}

function parseKey(key: string): Record<string, string> {
  return Object.fromEntries(key.split("&").filter(Boolean).map((p) => [p.slice(0, p.indexOf("=")), p.slice(p.indexOf("=") + 1)]));
}

/** Unidades disponibles de la combinación elegida (o de todo el producto si no lleva stock por variante). */
export function stockFor(product: Pick<Product, "stock" | "variant_stock">, selected: Record<string, string>) {
  const vs = product.variant_stock;
  if (!vs || Object.keys(vs).length === 0) return product.stock;
  return vs[variantKey(selected)] ?? 0;
}

/** Opciones agotadas de una variante según lo elegido en las demás. */
export function unavailableFor(
  v: Variant,
  selected: Record<string, string>,
  all: Variant[],
  variantStock?: Record<string, number> | null,
): string[] {
  if (variantStock && Object.keys(variantStock).length > 0) {
    const combos = Object.entries(variantStock).filter(([, n]) => n > 0).map(([k]) => parseKey(k));
    const others = Object.entries(selected).filter(([name]) => name !== v.name);
    return v.options.filter(
      (o) => !combos.some((c) => c[v.name] === o && others.every(([name, val]) => c[name] === undefined || c[name] === val)),
    );
  }
  if (v.unavailableBy) {
    const colorName = all.find((x) => x.name.toLowerCase() === "color")?.name;
    const color = colorName ? selected[colorName] : undefined;
    if (color) return v.unavailableBy[color] ?? [];
    const colors = all.find((x) => x.name.toLowerCase() === "color")?.options ?? [];
    return v.options.filter((o) => colors.length > 0 && colors.every((c) => (v.unavailableBy![c] ?? []).includes(o)));
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
  immediate_delivery?: boolean;
  /** Unidades por combinación de variantes, ej. { "Color=Negro&Talla=M": 2 }. Si existe, manda sobre `stock`. */
  variant_stock?: Record<string, number> | null; // ya está en Colombia: se puede pagar contra entrega
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
