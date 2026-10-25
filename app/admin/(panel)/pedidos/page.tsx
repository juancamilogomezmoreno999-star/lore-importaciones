import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import type { Order, OrderStatus } from "@/lib/types";
import { allStatuses, statusLabels } from "@/lib/orders";
import { formatCOP, formatDate, orderCode } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata = { title: "Pedidos" };

export default async function AdminOrders({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const estado = allStatuses.find((s) => s === sp.estado) as OrderStatus | undefined;
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (estado) query = query.eq("status", estado);
  // Por defecto ocultamos pedidos en línea abandonados (sin pagar ni rechazados)
  if (!estado) query = query.not("payment_status", "eq", "rechazado");
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        <Link href="/admin/pedidos" className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${!estado ? "bg-ink text-gold-light" : "bg-white"}`}>Todos</Link>
        {allStatuses.map((s) => (
          <Link key={s} href={`/admin/pedidos?estado=${s}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${estado === s ? "bg-ink text-gold-light" : "bg-white"}`}>{statusLabels[s]}</Link>
        ))}
      </div>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`/admin/pedidos/${o.id}`} className="card flex items-center justify-between gap-3 p-4">
              <span className="min-w-0">
                <b className="block text-sm">{orderCode(o.order_number)} · {o.customer_name}</b>
                <span className="block text-xs text-muted">{formatDate(o.created_at)} · {o.city}</span>
                <span className="text-xs text-muted">
                  {o.payment_method === "contra_entrega" ? "💵 Contra entrega" : o.payment_status === "aprobado" ? "💳 Pagado en línea" : o.payment_status === "rechazado" ? "❌ Pago rechazado" : "⏳ Esperando pago"}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-bold">{formatCOP(o.total)}</span>
                <StatusBadge status={o.status} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <p className="card p-8 text-center text-muted">No hay pedidos en este estado.</p>}
    </div>
  );
}
