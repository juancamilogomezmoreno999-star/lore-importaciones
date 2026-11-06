"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import type { Product, Variant } from "@/lib/types";
import { saveProduct } from "@/app/admin/(panel)/productos/actions";
import { ImageUploader } from "./ImageUploader";
import { ProductImage } from "@/components/ProductImage";
import { discountPercent } from "@/lib/format";

const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function ProductForm({ product, categories }: { product?: Product; categories: string[] }) {
  const [error, action, pending] = useActionState(saveProduct, null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const find = (n: string) => product?.variants.find((v) => v.name.toLowerCase() === n)?.options.join(", ") ?? "";
  const other = product?.variants.find((v) => !["talla", "color"].includes(v.name.toLowerCase()));
  const [sizes, setSizes] = useState(find("talla"));
  const [colors, setColors] = useState(find("color"));
  const tallaVariant = product?.variants.find((v) => v.name.toLowerCase() === "talla");
  const [soldOutSizes, setSoldOutSizes] = useState<string[]>(tallaVariant?.unavailable ?? []);
  // Tallas agotadas por color: { "Negro": ["M"], ... }
  const [colorImages, setColorImages] = useState<Record<string, string>>(
    product?.variants.find((v) => v.name.toLowerCase() === "color")?.images ?? {},
  );
  const [soldOutBy, setSoldOutBy] = useState<Record<string, string[]>>(tallaVariant?.unavailableBy ?? {});
  const [otherName, setOtherName] = useState(other?.name ?? "");
  const [otherValues, setOtherValues] = useState(other?.options.join(", ") ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compare, setCompare] = useState(product?.compare_at_price?.toString() ?? "");

  const variants: Variant[] = [
    split(colors).length > 0
      ? {
          name: "Talla",
          options: split(sizes),
          unavailableBy: Object.fromEntries(split(colors).map((c) => [c, (soldOutBy[c] ?? []).filter((t) => split(sizes).includes(t))])),
        }
      : { name: "Talla", options: split(sizes), unavailable: soldOutSizes.filter((t) => split(sizes).includes(t)) },
    {
      name: "Color",
      options: split(colors),
      images: Object.fromEntries(split(colors).filter((c) => colorImages[c] && images.includes(colorImages[c])).map((c) => [c, colorImages[c]])),
    },
    { name: otherName.trim(), options: split(otherValues) },
  ].filter((v) => v.name && v.options.length);

  const off = discountPercent(Number(price) || 0, Number(compare) || null);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />

      <section className="card space-y-4 p-4 sm:p-5">
        <h2 className="font-sans font-semibold">Fotos</h2>
        <ImageUploader value={images} onChange={setImages} />
      </section>

      <section className="card space-y-4 p-4 sm:p-5">
        <h2 className="font-sans font-semibold">Información</h2>
        <div>
          <label className="label" htmlFor="name">Nombre del producto</label>
          <input id="name" name="name" required defaultValue={product?.name} className="input" placeholder="Ej: Tenis Nike Air Max 90" />
        </div>
        <div>
          <label className="label" htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={6} defaultValue={product?.description} className="input" placeholder="Cuenta cómo es, materiales, medidas, para quién es… Usa • para hacer listas." />
        </div>
        <div>
          <label className="label" htmlFor="category">Categoría</label>
          <input id="category" name="category" required list="cats" defaultValue={product?.category} className="input" placeholder="Ej: Calzado" />
          <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
      </section>

      <section className="card space-y-4 p-4 sm:p-5">
        <h2 className="font-sans font-semibold">Precio e inventario</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="price">Precio (COP)</label>
            <input id="price" name="price" required inputMode="numeric" pattern="\d*" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className="input" placeholder="389900" />
          </div>
          <div>
            <label className="label" htmlFor="compare_at_price">Precio anterior <span className="font-normal text-muted">(oferta)</span></label>
            <input id="compare_at_price" name="compare_at_price" inputMode="numeric" pattern="\d*" value={compare} onChange={(e) => setCompare(e.target.value.replace(/\D/g, ""))} className="input" placeholder="Opcional" />
          </div>
        </div>
        {off > 0 && <p className="text-sm text-success">Se mostrará con {off}% de descuento ✓</p>}
        <p className="-mt-2 text-xs text-muted">Escribe solo números, sin puntos ni signo $. Ej: 389900</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="stock">Unidades disponibles</label>
            <input id="stock" name="stock" type="number" min={0} required defaultValue={product?.stock ?? 1} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="delivery_time">Tiempo de entrega</label>
            <input id="delivery_time" name="delivery_time" required list="times" defaultValue={product?.delivery_time ?? "1 a 3 días hábiles (entrega inmediata)"} className="input" />
            <datalist id="times">
              <option value="1 a 3 días hábiles (entrega inmediata)" />
              <option value="15 a 20 días hábiles (por encargo)" />
            </datalist>
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-4 sm:p-5">
        <div>
          <h2 className="font-sans font-semibold">Variantes <span className="font-normal text-muted">(opcional)</span></h2>
          <p className="text-xs text-muted">Separa las opciones con comas. Si el producto no tiene tallas o colores, deja el campo vacío.</p>
        </div>
        <div>
          <label className="label" htmlFor="sizes">Tallas</label>
          <input id="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} className="input" placeholder="Ej: S, M, L, XL  ó  36, 37, 38" />
          {split(sizes).length > 0 && split(colors).length === 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs text-muted">Toca las tallas que <b>no hay</b> para tacharlas. Los clientes las verán tachadas y no podrán elegirlas.</p>
              <div className="flex flex-wrap gap-2">
                {split(sizes).map((t) => {
                  const off = soldOutSizes.includes(t);
                  return (
                    <button key={t} type="button" aria-pressed={off} onClick={() => setSoldOutSizes((s) => (off ? s.filter((x) => x !== t) : [...s, t]))} className={`relative min-w-11 rounded-[3px] border px-3 py-2 text-sm font-medium ${off ? "border-line bg-sand text-ink/40 line-through" : "border-ink bg-white"}`}>
                      {t}
                      {off && <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),var(--color-danger)_50%,transparent_calc(50%+1px))]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="label" htmlFor="colors">Colores</label>
          <input id="colors" value={colors} onChange={(e) => setColors(e.target.value)} className="input" placeholder="Ej: Negro, Blanco, Rosa" />
          {split(colors).length > 0 && images.length > 0 && (
            <div className="mt-4 rounded-md bg-sand p-3">
              <p className="mb-3 text-xs text-muted">Foto de cada color: toca la foto que corresponde a cada color. Al elegir el color, el cliente verá esa foto.</p>
              <div className="space-y-3">
                {split(colors).map((c) => (
                  <div key={c}>
                    <p className="mb-1.5 text-sm font-semibold">{c}</p>
                    <div className="flex flex-wrap gap-2">
                      {images.map((src, i) => {
                        const on = colorImages[c] === src;
                        return (
                          <button
                            key={src}
                            type="button"
                            aria-pressed={on}
                            aria-label={`Foto ${i + 1} para ${c}`}
                            onClick={() => setColorImages((m) => ({ ...m, [c]: on ? "" : src }))}
                            className={`relative h-14 w-14 overflow-hidden rounded-[3px] ring-2 ${on ? "ring-ink" : "ring-transparent opacity-60"}`}
                          >
                            <ProductImage src={src} alt="" fill sizes="56px" className="object-cover" />
                            {on && <span className="absolute bottom-0 right-0 bg-ink px-1 text-[10px] text-white">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {split(sizes).length > 0 && split(colors).length > 0 && (
            <div className="mt-4 rounded-md bg-sand p-3">
              <p className="mb-3 text-xs text-muted">Tallas por color: toca las tallas que <b>no hay</b> en cada color para tacharlas.</p>
              <div className="space-y-3">
                {split(colors).map((c) => (
                  <div key={c}>
                    <p className="mb-1.5 text-sm font-semibold">{c}</p>
                    <div className="flex flex-wrap gap-2">
                      {split(sizes).map((t) => {
                        const off = (soldOutBy[c] ?? []).includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={off}
                            aria-label={`${c} talla ${t}${off ? " agotada" : ""}`}
                            onClick={() => setSoldOutBy((m) => ({ ...m, [c]: off ? (m[c] ?? []).filter((x) => x !== t) : [...(m[c] ?? []), t] }))}
                            className={`relative min-w-11 rounded-[3px] border px-3 py-2 text-sm font-medium ${off ? "border-line bg-sand text-ink/40 line-through" : "border-ink bg-white"}`}
                          >
                            {t}
                            {off && <span aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),var(--color-danger)_50%,transparent_calc(50%+1px))]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <div>
            <label className="label" htmlFor="otherName">Otra opción</label>
            <input id="otherName" value={otherName} onChange={(e) => setOtherName(e.target.value)} className="input" placeholder="Ej: Tamaño" />
          </div>
          <div>
            <label className="label" htmlFor="otherValues">Valores</label>
            <input id="otherValues" value={otherValues} onChange={(e) => setOtherValues(e.target.value)} className="input" placeholder="Ej: 50 ml, 100 ml" />
          </div>
        </div>
      </section>

      <section className="card space-y-3 p-4 sm:p-5">
        <label className="flex items-center justify-between gap-4">
          <span><b className="block text-sm">Visible en la tienda</b><span className="text-xs text-muted">Si lo apagas, el producto queda oculto para los clientes.</span></span>
          <input type="checkbox" name="visible" defaultChecked={product?.visible ?? true} className="h-6 w-6 accent-ink" />
        </label>
        <label className="flex items-center justify-between gap-4 border-t border-ink/5 pt-3">
          <span><b className="block text-sm">⚡ Entrega inmediata</b><span className="text-xs text-muted">Ya lo tienes en Colombia. Solo estos productos permiten pago contra entrega.</span></span>
          <input type="checkbox" name="immediate_delivery" defaultChecked={product?.immediate_delivery ?? false} className="h-6 w-6 accent-ink" />
        </label>
        <label className="flex items-center justify-between gap-4 border-t border-ink/5 pt-3">
          <span><b className="block text-sm">Destacado</b><span className="text-xs text-muted">Aparece en la página de inicio.</span></span>
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-6 w-6 accent-ink" />
        </label>
      </section>

      {error && <p role="alert" className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">{error}</p>}
      <div className="sticky bottom-16 z-20 flex gap-3 rounded-2xl bg-[#f4f2ed]/95 py-2 backdrop-blur md:bottom-0">
        <Link href="/admin/productos" className="btn-outline flex-1">Cancelar</Link>
        <button disabled={pending} className="btn-primary flex-[2]">{pending ? "Guardando…" : "Guardar producto"}</button>
      </div>
    </form>
  );
}
