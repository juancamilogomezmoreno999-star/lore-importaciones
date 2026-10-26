"use server";
import { z } from "zod";
import type { Order, OrderItem, Product } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/server";
import { rateLimit, TOO_MANY } from "@/lib/rate-limit";
import { recordConsent } from "@/lib/consent";
import { sampleProducts } from "@/lib/sample-products";
import { cashOnDeliveryAllowed, COD_ONLY_IMMEDIATE_MSG, ONLINE_FEE_LABEL, onlineFeeFor, shippingFor } from "@/lib/orders";
import { payments } from "@/lib/config";
import { isBoldConfigured } from "@/lib/bold";
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
  payment_method: z.enum(["en_linea", "contra_entrega", "nequi"]),
  accept_terms: z.boolean().refine((v) => v, "Debes aceptar los términos y condiciones"),
  accept_privacy: z.boolean().refine((v) => v, "Debes autorizar el tratamiento de tus datos personales"),
  website: z.string().max(0).optional(), // campo trampa anti-spam
  save_profile: z.boolean().optional(),
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
  if (!(await rateLimit("pedido", 8, 600))) return { ok: false, error: TOO_MANY };
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? "") };
  }
  const data = parsed.data;

  if (data.payment_method === "nequi" && !payments.nequi.enabled) {
    return { ok: false, error: "El pago por Nequi no está disponible en este momento." };
  }
  if (data.payment_method === "contra_entrega" && !cashOnDeliveryAllowed(data.city)) {
    return { ok: false, error: "El pago contra entrega no está disponible para tu ciudad." };
  }
  if (data.payment_method === "en_linea" && isSupabaseConfigured && !isBoldConfigured) {
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

  if (data.payment_method === "contra_entrega" && !products.every((p) => p.immediate_delivery)) {
    return { ok: false, error: `Pago contra entrega: ${COD_ONLY_IMMEDIATE_MSG}` };
  }

  const productsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingFor(productsTotal) + (data.payment_method === "contra_entrega" ? payments.cashOnDelivery.fee : 0);
  // El costo de la pasarela se guarda como una línea más del pedido para que el cliente lo vea claramente
  const fee = data.payment_method === "en_linea" ? onlineFeeFor(productsTotal + shipping) : 0;
  if (fee > 0) {
    items.push({ product_id: null, name: ONLINE_FEE_LABEL, slug: "", image: null, price: fee, quantity: 1, variant: {} });
  }
  const subtotal = productsTotal + fee;
  const total = subtotal + shipping;

  if (!db) {
    // Modo demostración: no se guarda nada
    return { ok: true, redirect: `/pedido/demo?total=${total}&metodo=${data.payment_method}` };
  }

  const isCod = data.payment_method === "contra_entrega";

  // Si el cliente inició sesión, el pedido queda ligado a su cuenta ("Mis pedidos")
  const { data: { user } } = await (await createSessionClient()).auth.getUser();
  const orderRow: Record<string, unknown> = {
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
    };
  let { data: order, error } = await db
    .from("orders")
    .insert(user ? { ...orderRow, user_id: user.id } : orderRow)
    .select("*")
    .single<Order>();
  if (error && user) {
    // Por si la columna user_id aún no existe en la base de datos
    ({ data: order, error } = await db.from("orders").insert(orderRow).select("*").single<Order>());
  }
  if (user && data.save_profile) {
    await db.from("customer_profiles").upsert({
      user_id: user.id,
      full_name: data.customer_name,
      document: data.customer_document,
      phone: data.phone,
      department: data.department,
      city: data.city,
      address: data.address,
      updated_at: new Date().toISOString(),
    });
  }
  if (error || !order) {
    console.error("createOrder", error?.message);
    return { ok: false, error: "No pudimos guardar tu pedido. Intenta de nuevo o escríbenos por WhatsApp." };
  }

  await recordConsent({ context: "pedido", email: data.email, terms: true, privacy: true, userId: user?.id, orderId: order.id });

  // Contra entrega y Nequi: se aparta el inventario de una vez y se confirma por WhatsApp
  if (isCod || data.payment_method === "nequi") {
    await db.rpc("discount_order_stock", { p_order_id: order.id });
    await sendOrderConfirmation(order);
    return { ok: true, redirect: `/pedido/${order.id}` };
  }

  // El cliente termina de pagar en /pagar/[id] con el botón de Bold
  return { ok: true, redirect: `/pagar/${order.id}` };
}
