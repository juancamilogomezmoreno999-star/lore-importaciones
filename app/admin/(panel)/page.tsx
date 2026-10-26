import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { formatCOP, formatDate, orderCode } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResetSalesButton } from "@/components/admin/ResetSalesButton";

export default async function Dashboard() {
  const { supabase, user } = await requireAdmin();
  // Inicio del mes en hora de Colombia (UTC-5)
  const [y, m] = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }).split("-");
  const monthStart = new Date(`${y}-${m}-01T00:00:00-05:00`);
  // Si se reinició el contador este mes, solo se cuentan las ventas desde ese momento
  const resetAt = user.user_metadata?.sales_reset_at ? new Date(user.user_metadata.sales_reset_at) : null;
  const resetActive = Boolean(resetAt && resetAt > monthStart);
  const salesFrom = resetActive ? resetAt! : monthStart;

  const [pending, active, unread, products, recent, monthOrders] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pendiente"),
    supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["pagado", "comprando_usa", "en_transito"]),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total, status, payment_status").gte("created_at", salesFrom.toISOString()),
  ]);
  const sales = (monthOrders.data ?? [])
    // Una venta cuenta cuando el pedido pasa a "Pagado / confirmado" o a un estado posterior
    // (contra entrega y Nequi incluidos). Pendientes y cancelados no suman.
    .filter((o) => ["pagado", "comprando_usa", "en_transito", "entregado"].includes(o.status) && ["aprobado", "contra_entrega"].includes(o.payment_status))
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
        {stats.map((s, i) => (
          <div key={s.label} className="card p-4">
            <Link href={s.href} className="block">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="mt-1 text-xl font-bold">{s.value}</p>
            </Link>
            {i === 0 && (
              <>
                {resetActive && <p className="mt-1 text-[11px] text-muted">Desde {formatDate(salesFrom.toISOString())}</p>}
                <ResetSalesButton active={resetActive} />
              </>
            )}
          </div>
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
