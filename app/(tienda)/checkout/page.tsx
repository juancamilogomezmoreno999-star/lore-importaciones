"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { IconShield } from "@/components/icons";
import { formatCOP, variantLabel } from "@/lib/format";
import { cashOnDeliveryAllowed, COD_ONLY_IMMEDIATE_MSG, ONLINE_FEE_LABEL, onlineFeeFor, shippingFor } from "@/lib/orders";
import { payments } from "@/lib/config";
import { departamentos } from "@/lib/colombia";
import { createOrder } from "./actions";
import { FieldError } from "@/components/FieldError";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Method = "en_linea" | "contra_entrega" | "nequi";

export default function CheckoutPage() {
  const { items, subtotal, ready, clear, user } = useCart();
  const [saved, setSaved] = useState<Record<string, string> | null>(null);
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<{ msg: string; field?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<Method>(payments.nequi.enabled ? "nequi" : "en_linea");
  const [city, setCity] = useState("");

  // Si el cliente tiene cuenta, llenamos el formulario con sus datos guardados
  useEffect(() => {
    if (!user) return;
    createBrowserSupabase()
      .from("customer_profiles")
      .select("full_name, document, phone, department, city, address")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const d = {
          customer_name: data?.full_name || user.user_metadata?.full_name || "",
          customer_document: data?.document || "",
          phone: data?.phone || "",
          email: user.email || "",
          department: data?.department || "",
          address: data?.address || "",
        };
        setSaved(d);
        if (data?.city) setCity(data.city);
      });
  }, [user]);

  const allImmediate = items.length > 0 && items.every((i) => i.immediate);
  const codCityOk = city === "" || cashOnDeliveryAllowed(city);
  const codAvailable = payments.cashOnDelivery.enabled && allImmediate && codCityOk;
  const ship = shippingFor(subtotal) + (method === "contra_entrega" ? payments.cashOnDelivery.fee : 0);
  const fee = method === "en_linea" ? onlineFeeFor(subtotal + ship) : 0;

  useEffect(() => {
    if (method === "contra_entrega" && !codAvailable) setMethod(payments.nequi.enabled ? "nequi" : "en_linea");
  }, [method, codAvailable]);

  if (!ready) return <div className="container-x min-h-[50vh]" />;
  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-3xl font-semibold">No hay productos para pagar</h1>
        <Link href="/catalogo" className="btn-primary mt-6">Ir al catálogo</Link>
      </div>
    );
  }

  const validate = (f: FormData) => {
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const e: Record<string, string> = {};
    if (get("customer_name").length < 3) e.customer_name = "Escribe tu nombre completo.";
    if (!/^\d{5,12}$/.test(get("customer_document"))) e.customer_document = "Escribe tu cédula, solo números (5 a 12 dígitos).";
    const phone = get("phone").replace(/\D/g, "").replace(/^57/, "");
    if (!/^3\d{9}$/.test(phone)) e.phone = "Escribe un celular colombiano de 10 dígitos (ej: 300 123 4567).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) e.email = "Escribe un correo válido (ej: nombre@gmail.com).";
    if (!get("department")) e.department = "Elige tu departamento.";
    if (get("city").length < 2) e.city = "Escribe tu ciudad o municipio.";
    if (get("address").length < 6) e.address = "Escribe tu dirección completa.";
    if (f.get("accept_terms") !== "on") e.accept_terms = "Debes aceptar los términos y condiciones para continuar.";
    if (f.get("accept_privacy") !== "on") e.accept_privacy = "Debes autorizar el tratamiento de tus datos para continuar.";
    return e;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setError(null);
    const found = validate(f);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = document.getElementsByName(first)[0] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
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
        accept_terms: f.get("accept_terms") === "on",
        accept_privacy: f.get("accept_privacy") === "on",
        website: get("website"),
        save_profile: f.get("save_profile") === "on",
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
      });
      if (!res.ok) {
        if (res.field && res.field in { customer_name: 1, customer_document: 1, phone: 1, email: 1, department: 1, city: 1, address: 1, accept_terms: 1, accept_privacy: 1 }) {
          setErrors({ [res.field]: res.error });
        } else {
          setError({ msg: res.error, field: res.field });
        }
        if (res.field) document.getElementsByName(res.field)[0]?.focus();
        return;
      }
      clear();
      router.push(res.redirect);
    });
  };

  const fieldErr = (name: string) => (errors[name] || error?.field === name ? "!border-danger focus:!ring-danger/20" : "");
  const aria = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {});

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-semibold">Finalizar compra</h1>
      <form
        key={saved ? "con-datos" : "sin-datos"}
        noValidate
        onSubmit={onSubmit}
        onChange={(e) => {
          const n = (e.target as unknown as HTMLInputElement).name;
          if (errors[n]) setErrors(({ [n]: _, ...rest }) => rest);
        }} className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card space-y-4 p-5">
            <h2 className="font-sans text-lg font-semibold">1. Tus datos</h2>
            {!user && (
              <p className="rounded-xl bg-sand/70 p-3 text-sm">
                ¿Tienes cuenta? <Link href="/cuenta/ingresar?next=/checkout" className="font-semibold underline">Ingresa</Link> y llenamos estos datos por ti. También puedes comprar sin cuenta.
              </p>
            )}
            <div>
              <label className="label" htmlFor="customer_name">Nombre completo</label>
              <input id="customer_name" {...aria("customer_name")} name="customer_name" defaultValue={saved?.customer_name} required autoComplete="name" className={`input ${fieldErr("customer_name")}`} />
              <FieldError id="customer_name" msg={errors.customer_name} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="customer_document">Cédula</label>
                <input id="customer_document" {...aria("customer_document")} name="customer_document" defaultValue={saved?.customer_document} required inputMode="numeric" pattern="\d{5,12}" title="Solo números" className={`input ${fieldErr("customer_document")}`} />
              <FieldError id="customer_document" msg={errors.customer_document} />
              </div>
              <div>
                <label className="label" htmlFor="phone">Celular (WhatsApp)</label>
                <input id="phone" {...aria("phone")} name="phone" defaultValue={saved?.phone} required type="tel" inputMode="tel" autoComplete="tel-national" placeholder="300 123 4567" className={`input ${fieldErr("phone")}`} />
              <FieldError id="phone" msg={errors.phone} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">Correo electrónico</label>
              <input id="email" {...aria("email")} name="email" type="email" defaultValue={saved?.email} required autoComplete="email" placeholder="para enviarte el estado de tu pedido" className={`input ${fieldErr("email")}`} />
              <FieldError id="email" msg={errors.email} />
            </div>
          </section>

          <section className="card space-y-4 p-5">
            <h2 className="font-sans text-lg font-semibold">2. ¿A dónde te lo enviamos?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="department">Departamento</label>
                <select id="department" {...aria("department")} name="department" required defaultValue={saved?.department ?? ""} className={`input ${fieldErr("department")}`}>
                  <option value="" disabled>Elige…</option>
                  {departamentos.map((d) => <option key={d}>{d}</option>)}
                </select>
                <FieldError id="department" msg={errors.department} />
              </div>
              <div>
                <label className="label" htmlFor="city">Ciudad o municipio</label>
                <input id="city" {...aria("city")} name="city" required autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className={`input ${fieldErr("city")}`} />
              <FieldError id="city" msg={errors.city} />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="address">Dirección completa</label>
              <input id="address" {...aria("address")} name="address" defaultValue={saved?.address} required autoComplete="street-address" placeholder="Calle, número, barrio, apto/casa" className={`input ${fieldErr("address")}`} />
              <FieldError id="address" msg={errors.address} />
            </div>
            <div>
              <label className="label" htmlFor="notes">Notas para la entrega (opcional)</label>
              <textarea id="notes" name="notes" rows={2} maxLength={500} placeholder="Ej: dejar en portería, llamar antes de llegar" className="input" />
            </div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {user && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="save_profile" defaultChecked className="h-5 w-5 accent-ink" />
                Guardar estos datos en mi cuenta para próximas compras
              </label>
            )}
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-sans text-lg font-semibold">3. ¿Cómo quieres pagar?</h2>
            {payments.nequi.enabled && (
              <label className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition ${method === "nequi" ? "border-ink ring-1 ring-ink" : "border-ink/15"}`}>
                <span className="absolute -top-2.5 right-3 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-ink">⭐ Recomendado</span>
                <input type="radio" name="pm" className="mt-1 accent-ink" checked={method === "nequi"} onChange={() => setMethod("nequi")} />
                <span>
                  <span className="block font-semibold">Nequi o Llave</span>
                  <span className="block text-sm text-muted">Envías el dinero a nuestro Nequi o Llave <b className="text-ink">{payments.nequi.display}</b> y nos mandas el comprobante por WhatsApp. Sin costo adicional.</span>
                </span>
              </label>
            )}
            {payments.online && (
              <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${method === "en_linea" ? "border-ink ring-1 ring-ink" : "border-ink/15"}`}>
                <input type="radio" name="pm" className="mt-1 accent-ink" checked={method === "en_linea"} onChange={() => setMethod("en_linea")} />
                <span>
                  <span className="block font-semibold">Pago en línea con Bold</span>
                  <span className="block text-sm text-muted">Recomendado solo si vas a pagar con PSE o tarjeta de crédito. Pagas en la ventana segura de Bold.{payments.onlineFeePercent > 0 ? ` Se suma el costo de la pasarela de pagos (comisión del ${payments.onlineFeePercent}%).` : ""}</span>
                </span>
              </label>
            )}
            {payments.cashOnDelivery.enabled && (
              <label className={`flex gap-3 rounded-xl border p-4 transition ${codAvailable ? "cursor-pointer" : "opacity-50"} ${method === "contra_entrega" ? "border-ink ring-1 ring-ink" : "border-ink/15"}`}>
                <input type="radio" name="pm" className="mt-1 accent-ink" disabled={!codAvailable} checked={method === "contra_entrega"} onChange={() => setMethod("contra_entrega")} />
                <span>
                  <span className="block font-semibold">Pago contra entrega</span>
                  <span className="block text-sm text-muted">
                    {codAvailable ? "Pagas en efectivo cuando recibes. Te escribimos por WhatsApp para confirmar." : !allImmediate ? COD_ONLY_IMMEDIATE_MSG : "No disponible para tu ciudad."}
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
            {fee > 0 && <div className="flex justify-between"><span>{ONLINE_FEE_LABEL}</span><span>{formatCOP(fee)}</span></div>}
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-bold"><span>Total</span><span>{formatCOP(subtotal + ship + fee)}</span></div>

          <div className="space-y-2 pt-2 text-xs leading-relaxed text-ink/70">
            <label className="flex gap-2">
              <input type="checkbox" name="accept_terms" {...aria("accept_terms")} className={`mt-0.5 h-4 w-4 shrink-0 accent-ink ${errors.accept_terms ? "outline outline-2 outline-offset-1 outline-danger" : ""}`} />
              <span>He leído y acepto los <Link href="/terminos" target="_blank" className="underline">términos y condiciones</Link> y la <Link href="/devoluciones" target="_blank" className="underline">política de cambios y devoluciones</Link>.</span>
            </label>
            <FieldError id="accept_terms" msg={errors.accept_terms} />
            <label className="flex gap-2">
              <input type="checkbox" name="accept_privacy" {...aria("accept_privacy")} className={`mt-0.5 h-4 w-4 shrink-0 accent-ink ${errors.accept_privacy ? "outline outline-2 outline-offset-1 outline-danger" : ""}`} />
              <span>Autorizo el tratamiento de mis datos personales según la <Link href="/privacidad" target="_blank" className="underline">política de tratamiento de datos personales</Link> (Ley 1581 de 2012).</span>
            </label>
            <FieldError id="accept_privacy" msg={errors.accept_privacy} />
          </div>

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
