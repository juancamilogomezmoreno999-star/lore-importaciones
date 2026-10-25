"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { IconBag, IconCheck, IconMinus, IconPlus, IconWhatsApp } from "./icons";
import { whatsappLink } from "@/lib/config";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    const missing = product.variants.find((v) => v.options.length > 0 && !selected[v.name]);
    if (missing) {
      setError(`Elige ${missing.name.toLowerCase()} 👆`);
      return;
    }
    setError("");
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? null,
      price: product.price,
      quantity: qty,
      stock: product.stock,
      variant: selected,
    });
    setAdded(true);
  };

  return (
    <div className="space-y-5">
      {product.variants.filter((v) => v.options.length > 0).map((v) => (
        <fieldset key={v.name}>
          <legend className="mb-2 text-sm font-semibold">
            {v.name}: <span className="font-normal text-muted">{selected[v.name] ?? "elige una opción"}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {v.options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => { setSelected((s) => ({ ...s, [v.name]: o })); setAdded(false); setError(""); }}
                className={`min-w-12 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${selected[v.name] === o ? "border-ink bg-ink text-gold-light" : "border-ink/15 bg-white hover:border-ink/50"}`}
              >
                {o}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      {!soldOut && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">Cantidad</span>
          <div className="flex items-center rounded-full border border-ink/15 bg-white">
            <button type="button" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"><IconMinus width={16} /></button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button type="button" className="p-3" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Más"><IconPlus width={16} /></button>
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-danger">{error}</p>}

      <div className="sticky bottom-0 -mx-4 space-y-2 border-t border-ink/5 bg-cream/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        {soldOut ? (
          <a href={whatsappLink(`¡Hola! Me interesa "${product.name}", ¿cuándo vuelve a estar disponible?`)} target="_blank" rel="noopener" className="btn-whatsapp w-full">
            <IconWhatsApp width={20} /> Agotado · Pregúntanos por WhatsApp
          </a>
        ) : added ? (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setAdded(false)} className="btn-outline"><IconCheck width={18} /> Agregado</button>
            <Link href="/carrito" className="btn-primary">Ir a pagar</Link>
          </div>
        ) : (
          <button type="button" onClick={handleAdd} className="btn-primary w-full py-4 text-base">
            <IconBag width={20} /> Agregar al carrito
          </button>
        )}
      </div>
      {!soldOut && (
        <a href={whatsappLink(`¡Hola! Tengo una pregunta sobre "${product.name}"`)} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 text-sm font-medium text-[#128C4B]">
          <IconWhatsApp width={18} /> ¿Dudas? Pregúntanos por WhatsApp
        </a>
      )}
    </div>
  );
}
