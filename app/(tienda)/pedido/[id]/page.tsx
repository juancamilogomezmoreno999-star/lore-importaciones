import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Order } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { fetchTransaction } from "@/lib/wompi";
import { applyWompiTransaction } from "@/lib/payments";
import { formatCOP, formatDate, orderCode, variantLabel } from "@/lib/format";
import { statusFlow, statusLabels, statusMessages } from "@/lib/orders";
import { whatsappLink } from "@/lib/config";
import { IconCheck, IconWhatsApp } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Estado de tu pedido", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  if (id === "demo") {
    return (
      <div className="container-x max-w-xl py-14 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white"><IconCheck width={32} height={32} /></div>
        <h1 className="mt-5 text-3xl font-semibold">¡Pedido de prueba creado!</h1>
        <p className="mt-3 text-muted">
          Estás en <b>modo demostración</b>: el pedido por {formatCOP(Number(sp.total) || 0)} no se guardó ni se cobró.
          Cuando conectes Supabase y Wompi (ver README) aquí verás el pedido real
          {sp.metodo === "wompi" ? " y el cliente será llevado a pagar en Wompi." : "."}
        </p>
        <Link href="/catalogo" className="btn-primary mt-8">Volver a la tienda</Link>
      </div>
    );
  }

  if (!isSupabaseConfigured || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = createServiceClient();
  let { data: order } = await db.from("orders").select("*").eq("id", id).maybeSingle<Order>();
  if (!order) notFound();

  // Al volver de Wompi, consultamos la transacción directamente (por si el webhook aún no llega).
  if (sp.id && order.payment_method === "wompi" && order.payment_status === "pendiente") {
    const tx = await fetchTransaction(sp.id);
    if (tx && tx.reference === order.id) order = (await applyWompiTransaction(tx)) ?? order;
  }

  const approved = order.payment_status === "aprobado" || order.payment_method === "contra_entrega";
  const rejected = order.payment_status === "rechazado";
  const currentIdx = statusFlow.indexOf(order.status);
  const code = orderCode(order.order_number);

  return (
    <div className="container-x max-w-2xl py-10">
      <div className="text-center">
        {rejected ? (
          <>
            <h1 className="text-3xl font-semibold">El pago no se pudo completar</h1>
            <p className="mt-3 text-muted">Tu pedido {code} sigue guardado. Escríbenos por WhatsApp y te ayudamos a completar el pago con otro medio.</p>
          </>
        ) : approved ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white"><IconCheck width={32} height={32} /></div>
            <h1 className="mt-5 text-3xl font-semibold">¡Gracias, {order.customer_name.split(" ")[0]}!</h1>
            <p className="mt-3 text-muted">{statusMessages[order.status]} Te enviamos los detalles a <b>{order.email}</b>.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">Estamos confirmando tu pago</h1>
            <p className="mt-3 text-muted">Esto puede tardar unos minutos (con PSE a veces un poco más). Te avisamos por correo apenas se confirme.</p>
          </>
        )}
        <p className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink/10">Pedido {code}</p>
      </div>

      {order.status !== "cancelado" && (
        <ol className="card mt-8 grid grid-cols-4 gap-1 p-4 text-center text-[11px] sm:text-xs">
          {statusFlow.map((s, i) => (
            <li key={s} className="flex flex-col items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i <= currentIdx ? "bg-ink text-gold-light" : "bg-sand text-ink/40"}`}>{i + 1}</span>
              <span className={i <= currentIdx ? "font-semibold" : "text-muted"}>{statusLabels[s]}</span>
            </li>
          ))}
        </ol>
      )}
      {order.tracking && <p className="card mt-4 p-4 text-sm"><b>Seguimiento:</b> {order.tracking}</p>}

      <div className="card mt-4 p-5">
        <ul className="divide-y divide-ink/5">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 py-2 text-sm">
              <span>{i.name} × {i.quantity}{Object.keys(i.variant).length > 0 && <span className="block text-xs text-muted">{variantLabel(i.variant)}</span>}</span>
              <span className="font-semibold">{formatCOP(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t border-ink/10 pt-3 text-sm">
          <div className="flex justify-between"><span>Envío</span><span>{order.shipping ? formatCOP(order.shipping) : "Gratis"}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatCOP(order.total)}</span></div>
          <p className="pt-2 text-xs text-muted">Realizado el {formatDate(order.created_at)} · Entrega en {order.city}, {order.department} · {order.payment_method === "contra_entrega" ? "Pago contra entrega" : "Pago en línea"}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href={whatsappLink(`¡Hola! Tengo una pregunta sobre mi pedido ${code}`)} target="_blank" rel="noopener" className="btn-whatsapp"><IconWhatsApp width={20} /> Preguntar por mi pedido</a>
        <Link href="/catalogo" className="btn-outline">Seguir comprando</Link>
      </div>
    </div>
  );
}
