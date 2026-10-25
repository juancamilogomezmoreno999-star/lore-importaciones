import "server-only";
import type { Order } from "./types";
import { store } from "./config";
import { formatCOP, orderCode, variantLabel } from "./format";
import { statusLabels, statusMessages } from "./orders";

// Los correos se envían con Resend (https://resend.com). Plan gratis: 3.000 correos/mes.

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) {
    console.log(`[correo no enviado: falta configurar Resend] ${subject} → ${to}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.error("Resend", res.status, await res.text());
  } catch (e) {
    console.error("Resend", e);
  }
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f3ec;font-family:Arial,Helvetica,sans-serif;color:#141414">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
  <table width="100%" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
    <tr><td style="background:#0b0b0c;padding:22px;text-align:center">
      <div style="color:#d4af5a;font-size:22px;letter-spacing:4px;font-weight:bold">LORE</div>
      <div style="color:#d4af5a;font-size:10px;letter-spacing:5px">IMPORTACIONES</div>
    </td></tr>
    <tr><td style="padding:28px 24px">
      <h1 style="font-size:20px;margin:0 0 14px">${title}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:18px 24px;background:#faf8f3;font-size:12px;color:#6b6b6b;text-align:center">
      ¿Dudas? Escríbenos por WhatsApp al ${store.whatsappDisplay} · Instagram @${store.instagram}<br/>
      <a href="${store.siteUrl}" style="color:#a8842f">${store.siteUrl.replace(/^https?:\/\//, "")}</a>
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function itemsTable(order: Order) {
  const rows = order.items
    .map(
      (i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(i.name)} × ${i.quantity}
      ${Object.keys(i.variant).length ? `<br/><span style="color:#777;font-size:12px">${esc(variantLabel(i.variant))}</span>` : ""}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatCOP(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
  return `<table width="100%" style="font-size:14px;border-collapse:collapse">${rows}
    <tr><td style="padding:6px 0">Envío</td><td style="text-align:right">${order.shipping ? formatCOP(order.shipping) : "Gratis"}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">${formatCOP(order.total)}</td></tr></table>`;
}

function orderButton(order: Order) {
  return `<p style="margin:22px 0 0"><a href="${store.siteUrl}/pedido/${order.id}" style="background:#0b0b0c;color:#d4af5a;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Ver mi pedido</a></p>`;
}

export async function sendOrderConfirmation(order: Order) {
  const code = orderCode(order.order_number);
  const intro =
    order.payment_method === "contra_entrega"
      ? "Recibimos tu pedido con <b>pago contra entrega</b>. Te escribiremos por WhatsApp para confirmar los detalles."
      : order.payment_status === "aprobado"
        ? "¡Tu pago fue aprobado! Ya empezamos a gestionar tu pedido."
        : "Recibimos tu pedido. Apenas se confirme el pago te avisamos.";
  await send(
    order.email,
    `Pedido ${code} recibido – ${store.name}`,
    layout(
      `¡Gracias por tu compra, ${esc(order.customer_name.split(" ")[0])}!`,
      `<p style="font-size:15px;line-height:1.5">${intro}</p>
       <p style="font-size:14px;color:#555">Número de pedido: <b>${code}</b></p>
       ${itemsTable(order)}
       <p style="font-size:13px;color:#555;margin-top:16px">Entrega en: ${esc(order.address)}, ${esc(order.city)} (${esc(order.department)})</p>
       ${orderButton(order)}`,
    ),
  );
  const admin = process.env.ADMIN_NOTIFY_EMAIL;
  if (admin) {
    await send(
      admin,
      `🛍️ Nuevo pedido ${code} – ${formatCOP(order.total)}`,
      layout(
        `Nuevo pedido ${code}`,
        `<p>${esc(order.customer_name)} · ${esc(order.phone)} · ${esc(order.city)}</p>
         <p>Pago: ${order.payment_method === "contra_entrega" ? "Contra entrega" : "En línea (Bold)"} (${order.payment_status})</p>
         ${itemsTable(order)}
         <p><a href="${store.siteUrl}/admin/pedidos/${order.id}">Abrir en el panel</a></p>`,
      ),
    );
  }
}

export async function sendStatusUpdate(order: Order) {
  const code = orderCode(order.order_number);
  await send(
    order.email,
    `Tu pedido ${code}: ${statusLabels[order.status]}`,
    layout(
      statusLabels[order.status],
      `<p style="font-size:15px;line-height:1.5">Hola ${esc(order.customer_name.split(" ")[0])}, ${statusMessages[order.status]}</p>
       ${order.tracking ? `<p style="font-size:14px;background:#faf8f3;padding:12px;border-radius:8px"><b>Información de seguimiento:</b><br/>${esc(order.tracking)}</p>` : ""}
       <p style="font-size:14px;color:#555">Pedido: <b>${code}</b></p>
       ${orderButton(order)}`,
    ),
  );
}

export async function sendContactNotification(m: { name: string; email: string; phone?: string; message: string }) {
  const admin = process.env.ADMIN_NOTIFY_EMAIL;
  if (!admin) return;
  await send(
    admin,
    `✉️ Nuevo mensaje de ${m.name}`,
    layout(
      "Nuevo mensaje desde la web",
      `<p><b>${esc(m.name)}</b> · ${esc(m.email)} ${m.phone ? `· ${esc(m.phone)}` : ""}</p>
       <p style="white-space:pre-wrap">${esc(m.message)}</p>`,
    ),
  );
}
