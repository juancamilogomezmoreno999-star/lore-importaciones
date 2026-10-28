import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts, type ProductFilters } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { IconWhatsApp } from "@/components/icons";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Productos originales de USA: entrega inmediata desde Colombia o por encargo desde Estados Unidos. Precios en pesos colombianos y envío a toda Colombia.",
  alternates: { canonical: "/catalogo" },
};

const tabs = {
  inmediata: {
    label: "⚡ Entrega inmediata",
    hint: "Ya están en Colombia",
    text: "Productos originales de USA, disponibles en Colombia y listos para entrega. Llegan a tus manos en 1 a 3 días hábiles.",
  },
  encargo: {
    label: "✈️ Por encargo",
    hint: "Los traemos de USA para ti",
    text: "Productos que traemos de Estados Unidos especialmente para ti. Llegan a tus manos en 15 a 20 días hábiles desde que se confirma el pago.",
  },
} as const;
type Tab = keyof typeof tabs;

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const tab: Tab = sp.tipo === "encargo" ? "encargo" : "inmediata";
  const filters: ProductFilters = {
    q: sp.q?.slice(0, 60),
    category: sp.categoria,
    min: sp.min ? Number(sp.min) || undefined : undefined,
    max: sp.max ? Number(sp.max) || undefined : undefined,
    sort: (["precio-asc", "precio-desc"] as const).find((s) => s === sp.orden),
    immediate: tab === "inmediata",
  };
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);
  const askLink = whatsappLink("¡Hola! Quiero pedir por encargo un producto de USA. Busco: ");

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">Catálogo</h1>

      {/* Las dos opciones */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-sand/70 p-1.5" role="tablist" aria-label="Tipo de entrega">
        {(Object.keys(tabs) as Tab[]).map((t) => (
          <Link
            key={t}
            href={t === "inmediata" ? "/catalogo" : "/catalogo?tipo=encargo"}
            role="tab"
            aria-selected={tab === t}
            scroll={false}
            className={`rounded-xl px-3 py-3 text-center transition ${tab === t ? "bg-ink text-gold-light shadow" : "text-ink/70 hover:bg-white/60"}`}
          >
            <span className="block text-sm font-semibold sm:text-base">{tabs[t].label}</span>
            <span className={`block text-[11px] sm:text-xs ${tab === t ? "text-gold-light/70" : "text-muted"}`}>{tabs[t].hint}</span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-muted">{tabs[tab].text}</p>

      {tab === "encargo" && (
        <div className="card mt-5 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">¿No ves lo que buscas? Pídelo por encargo</p>
            <p className="mt-1 text-sm text-muted">Escríbenos qué producto, marca, referencia, talla o color quieres. Revisamos y te confirmamos precio y disponibilidad antes de pedirlo.</p>
          </div>
          <a href={askLink} target="_blank" rel="noopener" className="btn-whatsapp shrink-0 !py-3 text-sm">
            <IconWhatsApp width={18} /> Pedir por WhatsApp
          </a>
        </div>
      )}

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
      ) : tab === "inmediata" ? (
        <div className="card mt-4 p-10 text-center">
          <p className="text-lg font-medium">No encontramos productos de entrega inmediata con esos filtros 😕</p>
          <p className="mt-2 text-muted">Mira las opciones por encargo o escríbenos y te lo conseguimos.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/catalogo?tipo=encargo" className="btn-outline">Ver por encargo</Link>
            <a href={whatsappLink(`¡Hola! Estoy buscando: ${filters.q ?? ""}`)} target="_blank" rel="noopener" className="btn-whatsapp">Preguntar por WhatsApp</a>
          </div>
        </div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="text-lg font-medium">Cuéntanos qué quieres traer de USA ✈️</p>
          <p className="mt-2 text-muted">Lo buscamos en Estados Unidos y te confirmamos precio y tiempo de entrega.</p>
          <a href={askLink} target="_blank" rel="noopener" className="btn-whatsapp mt-5"><IconWhatsApp width={18} /> Pedir por WhatsApp</a>
        </div>
      )}
    </div>
  );
}
