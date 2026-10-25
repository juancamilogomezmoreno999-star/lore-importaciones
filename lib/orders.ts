import type { OrderStatus } from "./types";
import { shipping, payments } from "./config";

export const statusLabels: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado / confirmado",
  comprando_usa: "Comprando en USA",
  en_transito: "En tránsito a Colombia",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const statusMessages: Record<OrderStatus, string> = {
  pendiente: "Recibimos tu pedido. Estamos esperando la confirmación del pago o te contactaremos para confirmarlo.",
  pagado: "¡Tu pago está confirmado! Ya empezamos a gestionar tu pedido.",
  comprando_usa: "Estamos comprando tu producto en Estados Unidos. 🇺🇸",
  en_transito: "Tu pedido va en camino a Colombia. ✈️ Pronto lo tendrás contigo.",
  entregado: "Tu pedido fue entregado. ¡Gracias por confiar en nosotros! 💛",
  cancelado: "Tu pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp.",
};

export const statusFlow: OrderStatus[] = ["pagado", "comprando_usa", "en_transito", "entregado"];
export const allStatuses = Object.keys(statusLabels) as OrderStatus[];

export function shippingFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  if (shipping.freeFrom > 0 && subtotal >= shipping.freeFrom) return 0;
  return shipping.cost;
}

export function cashOnDeliveryAllowed(city: string) {
  const c = payments.cashOnDelivery;
  if (!c.enabled) return false;
  if (c.cities.length === 0) return true;
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
  return c.cities.some((x) => norm(x) === norm(city));
}
