import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { formatCOP, formatDate, orderCode, variantLabel } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { ProductImage } from "@/components/ProductImage";

export const metadata = { title: "Pedido" };

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle<Order>();
  if (!order) notFound();
  const code = orderCode(order.order_number);
  const wa = `https://wa.me/57${order.phone}?text=${encodeURIComponent(`¡Hola ${order.customer_name.split(" ")[0]}! Te escribimos de Lore Importaciones sobre tu pedido ${code} 😊`)}`;

  const payment =
    order.payment_method === "contra_entrega" ? "Contra entrega"
    : order.payment_status === "aprobado" ? `Pagado en línea con Bold${order.payment_id ? ` (${order.payment_id})` : ""}`
    : order.payment_status === "rechazado" ? "Pago rechazado"
    : "Esperando pago en línea";

  return (
    <div className="space-y-4">
      <Link href="/admin/pedidos" className="text-sm text-muted">← Pedidos</Link>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{code}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-muted">{formatDate(order.created_at)} · {payment}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card space-y-1 p-4 text-sm">
          <h2 className="mb-2 font-sans font-semibold">Cliente</h2>
          <p><b>{order.customer_name}</b></p>
          <p>C.C. {order.customer_document}</p>
          <p><a href={`tel:${order.phone}`} className="underline">{order.phone}</a> · <a href={`mailto:${order.email}`} className="underline">{order.email}</a></p>
          <p className="pt-2">{order.address}<br />{order.city}, {order.department}</p>
          {order.notes && <p className="mt-2 rounded-lg bg-sand/60 p-2">📝 {order.notes}</p>}
          <a href={wa} target="_blank" rel="noopener" className="btn-whatsapp mt-3 w-full !py-2.5 text-sm">Escribirle por WhatsApp</a>
        </section>
        <section className="card p-4">
          <h2 className="mb-3 font-sans font-semibold">Actualizar estado</h2>
          <OrderStatusForm id={order.id} status={order.status} tracking={order.tracking} />
        </section>
      </div>

      <section className="card p-4">
        <h2 className="mb-2 font-sans font-semibold">Productos</h2>
        <ul className="divide-y divide-ink/5">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex items-center gap-3 py-3 text-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                {i.image && <ProductImage src={i.image} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{i.name} × {i.quantity}</p>
                {Object.keys(i.variant).length > 0 && <p className="text-xs text-muted">{variantLabel(i.variant)}</p>}
              </div>
              <span className="font-semibold">{formatCOP(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-ink/10 pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Envío</span><span>{formatCOP(order.shipping)}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCOP(order.total)}</span></div>
        </div>
      </section>
    </div>
  );
}
