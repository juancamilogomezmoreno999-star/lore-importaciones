import { requireAdmin } from "@/lib/auth";
import type { Order } from "@/lib/types";
import { orderCode, variantLabel } from "@/lib/format";
import { statusLabels, paymentMethodLabels } from "@/lib/orders";

export const dynamic = "force-dynamic";

// Evita que una celda que empiece por = + - @ se ejecute como fórmula al abrir el archivo en Excel
const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

/** Copia de seguridad: descarga todos los pedidos en un archivo que abre Excel o Google Sheets. */
export async function GET() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10000);
  const orders = (data ?? []) as Order[];

  const header = [
    "Pedido", "Fecha", "Estado", "Forma de pago", "Estado del pago", "Cliente", "Cédula", "Celular", "Correo",
    "Departamento", "Ciudad", "Dirección", "Notas", "Productos", "Subtotal", "Envío", "Total", "Guía / seguimiento",
  ];
  const rows = orders.map((o) => [
    orderCode(o.order_number),
    new Date(o.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" }),
    statusLabels[o.status],
    paymentMethodLabels[o.payment_method],
    o.payment_status,
    o.customer_name, o.customer_document, o.phone, o.email,
    o.department, o.city, o.address, o.notes ?? "",
    o.items.map((i) => `${i.name} x${i.quantity}${Object.keys(i.variant).length ? ` (${variantLabel(i.variant)})` : ""}`).join(" | "),
    o.subtotal, o.shipping, o.total, o.tracking ?? "",
  ]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  const day = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-lore-${day}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
