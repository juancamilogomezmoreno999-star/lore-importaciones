import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { formatCOP, formatDate, orderCode } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [pending, active, unread, products, recent, monthOrders] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pendiente"),
    supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pagado", "comprando_usa", "en_transito"]),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total, status, payment_status").gte("created_at", monthStart.toISOString()),
  ]);
  const sales = (monthOrders.data ?? [])
    .filter((o) => o.status !== "cancelado" && (o.payment_status === "aprobado" || o.payment_status === "contra_entrega"))
    .reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Ventas del mes", value: formatCOP(sales), href: "/admin/pedidos" },
    { label: "Pedidos pendientes", value: pending.count ?? 0, href: "/admin/pedidos?estado=pendiente" },
    { label: "Pedidos en proceso", value: active.count ?? 0, href: "/admin/pedidos" },
    { label: "Mensajes sin leer", value: unread.count ?? 0, href: "/admin/mensajes" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">¡Hola! 👋</h1>
        <Link href="/admin/productos/nuevo" className="btn-gold !py-2.5 text-sm">+ Nuevo producto</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{s.value}</p>
          </Link>
        ))}
      </div>
      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-sans font-semibold">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm text-gold-dark">Ver todos</Link>
        </div>
        {(recent.data as Order[] | null)?.length ? (
          <ul className="divide-y divide-ink/5">
            {(recent.data as Order[]).map((o) => (
              <li key={o.id}>
                <Link href={`/admin/pedidos/${o.id}`} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <b className="block text-sm">{orderCode(o.order_number)} · {o.customer_name}</b>
                    <span className="text-xs text-muted">{formatDate(o.created_at)} · {o.city}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm font-semibold">{formatCOP(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-muted">Aún no hay pedidos. ¡Ya llegarán! ✨</p>
        )}
      </section>
      <p className="text-center text-xs text-muted">Tienes {products.count ?? 0} productos en la tienda.</p>
    </div>
  );
}
