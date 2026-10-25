"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import type { Product, Variant } from "@/lib/types";
import { saveProduct } from "@/app/admin/(panel)/productos/actions";
import { ImageUploader } from "./ImageUploader";
import { discountPercent } from "@/lib/format";

const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function ProductForm({ product, categories }: { product?: Product; categories: string[] }) {
  const [error, action, pending] = useActionState(saveProduct, null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const find = (n: string) => product?.variants.find((v) => v.name.toLowerCase() === n)?.options.join(", ") ?? "";
  const other = product?.variants.find((v) => !["talla", "color"].includes(v.name.toLowerCase()));
  const [sizes, setSizes] = useState(find("talla"));
  const [colors, setColors] = useState(find("color"));
  const [otherName, setOtherName] = useState(other?.name ?? "");
  const [otherValues, setOtherValues] = useState(other?.options.join(", ") ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compare, setCompare] = useState(product?.compare_at_price?.toString() ?? "");

  const variants: Variant[] = [
    { name: "Talla", options: split(sizes) },
    { name: "Color", options: split(colors) },
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
            <input id="delivery_time" name="delivery_time" required list="times" defaultValue={product?.delivery_time ?? "8 a 12 días hábiles"} className="input" />
            <datalist id="times">
              <option value="1 a 3 días hábiles (disponible en Colombia)" />
              <option value="8 a 12 días hábiles" />
              <option value="10 a 15 días hábiles" />
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
        </div>
        <div>
          <label className="label" htmlFor="colors">Colores</label>
          <input id="colors" value={colors} onChange={(e) => setColors(e.target.value)} className="input" placeholder="Ej: Negro, Blanco, Rosa" />
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
