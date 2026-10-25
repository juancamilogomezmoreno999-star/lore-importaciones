import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts, type ProductFilters } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Catálogo de productos importados de USA",
  description: "Tenis, bolsos, perfumes, tecnología y accesorios originales traídos de Estados Unidos. Precios en pesos colombianos y envío a toda Colombia.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const filters: ProductFilters = {
    q: sp.q?.slice(0, 60),
    category: sp.categoria,
    min: sp.min ? Number(sp.min) || undefined : undefined,
    max: sp.max ? Number(sp.max) || undefined : undefined,
    sort: (["precio-asc", "precio-desc"] as const).find((s) => s === sp.orden),
  };
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Catálogo</h1>
      <p className="mt-2 text-muted">Productos originales de Estados Unidos, con precios en pesos colombianos.</p>
      <div className="mt-6">
        <Suspense>
          <CatalogFilters categories={categories} />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-muted">{products.length} {products.length === 1 ? "producto" : "productos"}</p>
      {products.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
        </div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="text-lg font-medium">No encontramos productos con esos filtros 😕</p>
          <p className="mt-2 text-muted">¿Lo buscas en especial? Te lo cotizamos.</p>
          <a href={whatsappLink(`¡Hola! Estoy buscando: ${filters.q ?? ""}`)} target="_blank" rel="noopener" className="btn-whatsapp mt-5">Preguntar por WhatsApp</a>
        </div>
      )}
    </div>
  );
}
