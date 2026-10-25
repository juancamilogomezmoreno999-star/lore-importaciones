import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { Order } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { boldApiKey, integritySignature } from "@/lib/bold";
import { formatCOP, orderCode, variantLabel } from "@/lib/format";
import { store, whatsappLink } from "@/lib/config";
import { BoldButton } from "@/components/BoldButton";
import { IconShield, IconWhatsApp } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pagar pedido", robots: { index: false, follow: false } };

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data: order } = await createServiceClient().from("orders").select("*").eq("id", id).maybeSingle<Order>();
  if (!order) notFound();
  if (order.payment_method !== "en_linea" || order.payment_status !== "pendiente") redirect(`/pedido/${order.id}`);

  const code = orderCode(order.order_number);
  return (
    <div className="container-x max-w-lg py-10">
      <p className="eyebrow text-center">Último paso</p>
      <h1 className="mt-2 text-center text-3xl font-semibold">Paga tu pedido {code}</h1>
      <p className="mt-2 text-center text-muted">Toca el botón y elige cómo pagar: tarjeta, PSE, Nequi o Bancolombia.</p>

      <div className="card mt-6 p-5">
        <ul className="divide-y divide-ink/5 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 py-2">
              <span>{i.name} × {i.quantity}{Object.keys(i.variant).length > 0 && <span className="block text-xs text-muted">{variantLabel(i.variant)}</span>}</span>
              <span className="font-semibold">{formatCOP(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 space-y-1 border-t border-ink/10 pt-3 text-sm">
          <div className="flex justify-between"><span>Envío</span><span>{order.shipping ? formatCOP(order.shipping) : "Gratis"}</span></div>
          <div className="flex justify-between text-lg font-bold"><span>Total a pagar</span><span>{formatCOP(order.total)}</span></div>
        </div>
        <div className="mt-5">
          <BoldButton
            apiKey={boldApiKey}
            orderId={order.id}
            amount={order.total}
            signature={integritySignature(order.id, order.total)}
            description={`${store.name} · Pedido ${code}`}
            redirectionUrl={`${store.siteUrl}/pedido/${order.id}`}
            customer={{ email: order.email, fullName: order.customer_name, phone: order.phone, documentNumber: order.customer_document }}
          />
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted"><IconShield width={16} /> Pago seguro con Bold. No guardamos datos de tu tarjeta.</p>
      </div>

      <a href={whatsappLink(`¡Hola! Necesito ayuda para pagar mi pedido ${code}`)} target="_blank" rel="noopener" className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#128C4B]">
        <IconWhatsApp width={18} /> ¿Problemas para pagar? Escríbenos
      </a>
    </div>
  );
}
