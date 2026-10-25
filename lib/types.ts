export type Variant = { name: string; options: string[] };

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
  created_at?: string;
};

export type OrderItem = {
  product_id: string;
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

export type PaymentMethod = "en_linea" | "contra_entrega";
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
