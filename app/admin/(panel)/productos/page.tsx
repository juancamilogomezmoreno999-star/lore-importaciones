import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { formatCOP } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { ProductRowActions } from "@/components/admin/ProductRowActions";

export const metadata = { title: "Productos" };

export default async function AdminProducts({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (sp.q) query = query.ilike("name", `%${sp.q.replace(/[%_,()]/g, " ")}%`);
  const { data } = await query;
  const products = (data ?? []) as Product[];

  return (
    <div className="space-y-4">
      {sp.ok && <p className="rounded-xl bg-success/10 p-3 text-sm font-medium text-success">✓ Producto guardado. Ya se ve en la tienda.</p>}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-gold !py-2.5 text-sm">+ Nuevo</Link>
      </div>
      <form>
        <input name="q" defaultValue={sp.q} type="search" placeholder="Buscar producto…" className="input" />
      </form>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className={`card flex gap-3 p-3 ${p.visible ? "" : "opacity-60"}`}>
            <Link href={`/admin/productos/${p.id}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-sand">
              {p.images[0] && <ProductImage src={p.images[0]} alt="" fill sizes="80px" className="object-cover" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/productos/${p.id}`} className="line-clamp-1 text-sm font-semibold hover:underline">{p.name}</Link>
              <p className="text-xs text-muted">
                {formatCOP(p.price)} · <span className={p.stock <= 0 ? "font-semibold text-danger" : p.stock <= 3 ? "font-semibold text-amber-700" : ""}>{p.stock} en stock</span>
                {!p.visible && " · Oculto"}{p.featured && " · ⭐ Destacado"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link href={`/admin/productos/${p.id}`} className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-gold-light">Editar</Link>
                <ProductRowActions id={p.id} name={p.name} visible={p.visible} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="card p-8 text-center text-muted">No hay productos todavía. ¡Agrega el primero!</p>}
    </div>
  );
}
