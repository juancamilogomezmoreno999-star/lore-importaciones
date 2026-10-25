import type { OrderStatus } from "@/lib/types";
import { statusLabels } from "@/lib/orders";

const colors: Record<OrderStatus, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  pagado: "bg-emerald-100 text-emerald-800",
  comprando_usa: "bg-blue-100 text-blue-800",
  en_transito: "bg-violet-100 text-violet-800",
  entregado: "bg-ink text-gold-light",
  cancelado: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[status]}`}>{statusLabels[status]}</span>;
}
