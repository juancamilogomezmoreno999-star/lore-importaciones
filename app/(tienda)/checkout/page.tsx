"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { IconShield } from "@/components/icons";
import { formatCOP, variantLabel } from "@/lib/format";
import { cashOnDeliveryAllowed, shippingFor } from "@/lib/orders";
import { payments } from "@/lib/config";
import { departamentos } from "@/lib/colombia";
import { createOrder } from "./actions";

type Method = "en_linea" | "contra_entrega";

export default function CheckoutPage() {
  const { items, subtotal, ready, clear } = useCart();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<{ msg: string; field?: string } | null>(null);
  const [method, setMethod] = useState<Method>("en_linea");
  const [city, setCity] = useState("");

  const codAvailable = payments.cashOnDelivery.enabled && (city === "" || cashOnDeliveryAllowed(city));
  const ship = shippingFor(subtotal) + (method === "contra_entrega" ? payments.cashOnDelivery.fee : 0);

  if (!ready) return <div className="container-x min-h-[50vh]" />;
  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-3xl font-semibold">No hay productos para pagar</h1>
        <Link href="/catalogo" className="btn-primary mt-6">Ir al catálogo</Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setError(null);
    start(async () => {
      const res = await createOrder({
        customer_name: get("customer_name"),
        customer_document: get("customer_document"),
        phone: get("phone"),
        email: get("email"),
        department: get("department"),
        city: get("city"),
        address: get("address"),
        notes: get("notes"),
        payment_method: method,
        data_consent: f.get("data_consent") === "on",
        website: get("website"),
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
      });
      if (!res.ok) {
        setError({ msg: res.error, field: res.field });
        if (res.field) document.getElementsByName(res.field)[0]?.focus();
        return;
      }
      clear();
      router.push(res.redirect);
    });
  };

  const fieldErr = (name: string) => (error?.field === name ? "!border-danger" : "");

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-semibold">Finalizar compra</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card space-y-4 p-5">
            <h2 className="font-sans text-lg font-semibold">1. Tus datos</h2>
            <div>
              <label className="label" htmlFor="customer_name">Nombre completo</label>
              <input id="customer_name" name="customer_name" required autoComplete="name" className={`input ${fieldErr("customer_name")}`} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="customer_document">Cédula</label>
                <input id="customer_document" name="customer_document" required inputMode="numeric" pattern="\d{5,12}" title="Solo números" className={`input ${fieldErr("customer_document")}`} />
              </div>
              <div>
                <label className="label" htmlFor="phone">Celular (WhatsApp)</label>
                <input id="phone" name="phone" required type="tel" inputMode="tel" autoComplete="tel-national" placeholder="300 123 4567" className={`input ${fieldErr("phone")}`} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="para enviarte el estado de tu pedido" className={`input ${fieldErr("email")}`} />
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <h2 className="font-sans text-lg font-semibold">2. ¿A dónde te lo enviamos?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="department">Departamento</label>
                <select id="department" name="department" required defaultValue="" className={`input ${fieldErr("department")}`}>
                  <option value="" disabled>Elige…</option>
                  {departamentos.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="city">Ciudad o municipio</label>
                <input id="city" name="city" required autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className={`input ${fieldErr("city")}`} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="address">Dirección completa</label>
              <input id="address" name="address" required autoComplete="street-address" placeholder="Calle, número, barrio, apto/casa" className={`input ${fieldErr("address")}`} />
            </div>
            <div>
              <label className="label" htmlFor="notes">Notas para la entrega (opcional)</label>
              <textarea id="notes" name="notes" rows={2} maxLength={500} placeholder="Ej: dejar en portería, llamar antes de llegar" className="input" />
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-sans text-lg font-semibold">3. ¿Cómo quieres pagar?</h2>
            {payments.online && (
              <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${method === "en_linea" ? "border-ink ring-1 ring-ink" : "border-ink/15"}`}>
                <input type="radio" name="pm" className="mt-1 accent-ink" checked={method === "en_linea"} onChange={() => setMethod("en_linea")} />
                <span>
                  <span className="block font-semibold">Pago en línea</span>
                  <span className="block text-sm text-muted">Tarjeta débito o crédito, PSE, Nequi, Bancolombia y más. Pagas en la ventana segura de Bold.</span>
                </span>
              </label>
            )}
            {payments.cashOnDelivery.enabled && (
              <label className={`flex gap-3 rounded-xl border p-4 transition ${codAvailable ? "cursor-pointer" : "opacity-50"} ${method === "contra_entrega" ? "border-ink ring-1 ring-ink" : "border-ink/15"}`}>
                <input type="radio" name="pm" className="mt-1 accent-ink" disabled={!codAvailable} checked={method === "contra_entrega"} onChange={() => setMethod("contra_entrega")} />
                <span>
                  <span className="block font-semibold">Pago contra entrega</span>
                  <span className="block text-sm text-muted">
                    {codAvailable ? "Pagas en efectivo cuando recibes. Te escribimos por WhatsApp para confirmar." : "No disponible para tu ciudad."}
                    {payments.cashOnDelivery.fee > 0 && ` Recargo: ${formatCOP(payments.cashOnDelivery.fee)}.`}
                  </span>
                </span>
              </label>
            )}
          </section>
        </div>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-28">
          <h2 className="font-sans text-lg font-semibold">Tu pedido</h2>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.productId + JSON.stringify(i.variant)} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {i.image && <ProductImage src={i.image} alt="" fill sizes="56px" className="object-cover" />}
                  <span className="absolute -right-0 -top-0 rounded-bl-lg bg-ink px-1.5 text-[11px] font-bold text-gold-light">{i.quantity}</span>
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{i.name}</p>
                  {Object.keys(i.variant).length > 0 && <p className="text-xs text-muted">{variantLabel(i.variant)}</p>}
                </div>
                <span className="text-sm font-semibold">{formatCOP(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-ink/10 pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(subtotal)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>{ship ? formatCOP(ship) : "¡Gratis!"}</span></div>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-bold"><span>Total</span><span>{formatCOP(subtotal + ship)}</span></div>

          <label className="flex gap-2 pt-2 text-xs leading-relaxed text-ink/70">
            <input type="checkbox" name="data_consent" required className="mt-0.5 accent-ink" />
            <span>Acepto los <Link href="/terminos" target="_blank" className="underline">términos y condiciones</Link> y autorizo el tratamiento de mis datos según la <Link href="/privacidad" target="_blank" className="underline">política de privacidad</Link> (Ley 1581 de 2012).</span>
          </label>

          {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">{error.msg}</p>}

          <button type="submit" disabled={pending} className="btn-primary w-full py-4 text-base">
            {pending ? "Procesando…" : method === "en_linea" ? "Continuar al pago" : "Confirmar pedido"}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><IconShield width={16} /> No guardamos datos de tu tarjeta</p>
        </aside>
      </form>
    </div>
  );
}
