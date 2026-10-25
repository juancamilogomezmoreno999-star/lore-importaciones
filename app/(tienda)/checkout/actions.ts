"use server";
import { z } from "zod";
import type { Order, OrderItem, Product } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { sampleProducts } from "@/lib/sample-products";
import { cashOnDeliveryAllowed, shippingFor } from "@/lib/orders";
import { payments, store } from "@/lib/config";
import { buildCheckoutUrl, isWompiConfigured } from "@/lib/wompi";
import { sendOrderConfirmation } from "@/lib/email";

const schema = z.object({
  customer_name: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  customer_document: z.string().trim().regex(/^\d{5,12}$/, "La cédula debe tener solo números (5 a 12 dígitos)"),
  phone: z.string().trim().transform((s) => s.replace(/\D/g, "").replace(/^57/, "")).pipe(z.string().regex(/^3\d{9}$/, "Escribe un celular colombiano de 10 dígitos")),
  email: z.string().trim().toLowerCase().email("Revisa tu correo electrónico").max(160),
  department: z.string().trim().min(2, "Elige tu departamento").max(60),
  city: z.string().trim().min(2, "Escribe tu ciudad o municipio").max(80),
  address: z.string().trim().min(6, "Escribe tu dirección completa").max(250),
  notes: z.string().trim().max(500).optional().default(""),
  payment_method: z.enum(["wompi", "contra_entrega"]),
  data_consent: z.boolean().refine((v) => v, "Debes aceptar la política de tratamiento de datos"),
  website: z.string().max(0).optional(), // campo trampa anti-spam
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
        variant: z.record(z.string().max(40), z.string().max(60)),
      }),
    )
    .min(1, "Tu carrito está vacío")
    .max(30),
});

export type CheckoutInput = z.input<typeof schema>;
export type CheckoutResult = { ok: true; redirect: string } | { ok: false; error: string; field?: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? "") };
  }
  const data = parsed.data;

  if (data.payment_method === "contra_entrega" && !cashOnDeliveryAllowed(data.city)) {
    return { ok: false, error: "El pago contra entrega no está disponible para tu ciudad." };
  }
  if (data.payment_method === "wompi" && isSupabaseConfigured && !isWompiConfigured) {
    return { ok: false, error: "El pago en línea aún no está activo. Elige contra entrega o escríbenos por WhatsApp." };
  }

  // Los precios y el stock SIEMPRE se leen de la base de datos, nunca del navegador.
  const ids = Array.from(new Set(data.items.map((i) => i.productId)));
  let products: Product[];
  const db = isSupabaseConfigured ? createServiceClient() : null;
  if (db) {
    const { data: rows, error } = await db.from("products").select("*").in("id", ids).eq("visible", true);
    if (error) return { ok: false, error: "No pudimos procesar tu pedido. Intenta de nuevo." };
    products = rows as Product[];
  } else {
    products = sampleProducts.filter((p) => ids.includes(p.id));
  }

  const items: OrderItem[] = [];
  for (const line of data.items) {
    const p = products.find((x) => x.id === line.productId);
    if (!p) return { ok: false, error: "Uno de los productos ya no está disponible. Revisa tu carrito." };
    const totalQty = data.items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.quantity, 0);
    if (totalQty > p.stock) {
      return { ok: false, error: `Solo tenemos ${p.stock} unidad(es) de "${p.name}". Ajusta la cantidad en tu carrito.` };
    }
    // Solo se aceptan variantes que existen en el producto
    const variant: Record<string, string> = {};
    for (const v of p.variants) {
      const chosen = line.variant[v.name];
      if (v.options.length && (!chosen || !v.options.includes(chosen))) {
        return { ok: false, error: `Elige ${v.name.toLowerCase()} para "${p.name}".` };
      }
      if (chosen) variant[v.name] = chosen;
    }
    items.push({ product_id: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? null, price: p.price, quantity: line.quantity, variant });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal) + (data.payment_method === "contra_entrega" ? payments.cashOnDelivery.fee : 0);
  const total = subtotal + shipping;

  if (!db) {
    // Modo demostración: no se guarda nada
    return { ok: true, redirect: `/pedido/demo?total=${total}&metodo=${data.payment_method}` };
  }

  const isCod = data.payment_method === "contra_entrega";
  const { data: order, error } = await db
    .from("orders")
    .insert({
      customer_name: data.customer_name,
      customer_document: data.customer_document,
      phone: data.phone,
      email: data.email,
      department: data.department,
      city: data.city,
      address: data.address,
      notes: data.notes || null,
      items,
      subtotal,
      shipping,
      total,
      payment_method: data.payment_method,
      payment_status: isCod ? "contra_entrega" : "pendiente",
      status: "pendiente",
      data_consent: true,
    })
    .select("*")
    .single<Order>();
  if (error || !order) {
    console.error("createOrder", error?.message);
    return { ok: false, error: "No pudimos guardar tu pedido. Intenta de nuevo o escríbenos por WhatsApp." };
  }

  if (isCod) {
    await db.rpc("discount_order_stock", { p_order_id: order.id });
    await sendOrderConfirmation(order);
    return { ok: true, redirect: `/pedido/${order.id}` };
  }

  const url = buildCheckoutUrl({
    reference: order.id,
    amountInCents: total * 100,
    redirectUrl: `${store.siteUrl}/pedido/${order.id}`,
    customer: { email: data.email, fullName: data.customer_name, phone: data.phone, document: data.customer_document },
  });
  return { ok: true, redirect: url };
}
