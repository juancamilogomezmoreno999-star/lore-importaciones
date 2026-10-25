"use client";
import Link from "next/link";
import { cartKey, useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { IconMinus, IconPlus, IconTrash, IconBag } from "@/components/icons";
import { formatCOP, variantLabel } from "@/lib/format";
import { shippingFor } from "@/lib/orders";
import { shipping } from "@/lib/config";

export default function CartPage() {
  const { items, subtotal, update, remove, ready } = useCart();
  const ship = shippingFor(subtotal);
  const missingForFree = shipping.freeFrom > 0 ? shipping.freeFrom - subtotal : 0;

  if (!ready) return <div className="container-x min-h-[50vh] py-10" />;

  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <IconBag width={48} height={48} className="mx-auto text-gold" />
        <h1 className="mt-4 text-3xl font-semibold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted">Dale una mirada a lo que tenemos para ti.</p>
        <Link href="/catalogo" className="btn-primary mt-6">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-semibold">Tu carrito</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-3">
          {items.map((i) => {
            const key = cartKey(i);
            return (
              <li key={key} className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
                <Link href={`/producto/${i.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-28 sm:w-28">
                  {i.image && <ProductImage src={i.image} alt={i.name} fill sizes="112px" className="object-cover" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link href={`/producto/${i.slug}`} className="line-clamp-2 text-sm font-medium sm:text-base">{i.name}</Link>
                    <button onClick={() => remove(key)} className="-mr-1 -mt-1 shrink-0 p-1 text-ink/40 hover:text-danger" aria-label="Quitar">
                      <IconTrash width={18} />
                    </button>
                  </div>
                  {Object.keys(i.variant).length > 0 && <p className="mt-1 text-xs text-muted">{variantLabel(i.variant)}</p>}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-ink/15">
                      <button className="p-2" onClick={() => update(key, i.quantity - 1)} aria-label="Menos"><IconMinus width={14} /></button>
                      <span className="w-6 text-center text-sm font-semibold">{i.quantity}</span>
                      <button className="p-2" onClick={() => update(key, i.quantity + 1)} aria-label="Más"><IconPlus width={14} /></button>
                    </div>
                    <span className="font-bold">{formatCOP(i.price * i.quantity)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-28">
          <h2 className="font-sans text-lg font-semibold">Resumen</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCOP(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Envío</span><span>{ship ? formatCOP(ship) : "¡Gratis!"}</span></div>
          {missingForFree > 0 && (
            <p className="rounded-lg bg-sand/70 p-3 text-xs">Te faltan <b>{formatCOP(missingForFree)}</b> para tener envío gratis 🚚</p>
          )}
          <div className="flex justify-between border-t border-ink/10 pt-3 text-lg font-bold"><span>Total</span><span>{formatCOP(subtotal + ship)}</span></div>
          <Link href="/checkout" className="btn-primary w-full py-4 text-base">Continuar con la compra</Link>
          <Link href="/catalogo" className="block text-center text-sm text-muted hover:underline">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  );
}
