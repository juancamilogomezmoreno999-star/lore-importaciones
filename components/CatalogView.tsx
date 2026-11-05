"use client";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { CatalogFilters } from "./CatalogFilters";
import { IconWhatsApp } from "./icons";
import { whatsappLink } from "@/lib/config";

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

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Catálogo que filtra en el navegador: cambiar de pestaña o filtro es instantáneo. */
export function CatalogView({ products, categories }: { products: Product[]; categories: string[] }) {
  const sp = useSearchParams();
  const tab: Tab = sp.get("tipo") === "encargo" ? "encargo" : "inmediata";
  const q = sp.get("q") ?? "";
  const cat = sp.get("categoria") ?? "";
  const min = Number(sp.get("min")) || 0;
  const max = Number(sp.get("max")) || 0;
  const orden = sp.get("orden");

  let list = products.filter((p) => Boolean(p.immediate_delivery) === (tab === "inmediata"));
  if (q) list = list.filter((p) => norm(p.name).includes(norm(q)));
  if (cat) list = list.filter((p) => p.category === cat);
  if (min) list = list.filter((p) => p.price >= min);
  if (max) list = list.filter((p) => p.price <= max);
  if (orden === "precio-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (orden === "precio-desc") list = [...list].sort((a, b) => b.price - a.price);

  const go = (t: Tab) => {
    const next = new URLSearchParams(sp.toString());
    if (t === "encargo") next.set("tipo", "encargo");
    else next.delete("tipo");
    window.history.replaceState(null, "", `/catalogo${next.size ? `?${next}` : ""}`);
  };
  const askLink = whatsappLink("¡Hola! Quiero pedir por encargo un producto de USA. Busco: ");

  return (
    <>
      <div className="mt-6 grid grid-cols-2 border-b border-line" role="tablist" aria-label="Tipo de entrega">
        {(Object.keys(tabs) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => go(t)}
            className={`-mb-px border-b-2 px-1 pb-3 pt-1 text-left transition-colors sm:px-2 ${tab === t ? "border-ink text-ink" : "border-transparent text-ink/55 hover:text-ink"}`}
          >
            <span className="block text-[15px] font-semibold [font-stretch:108%] sm:text-base">{tabs[t].label}</span>
            <span className="block text-xs text-muted">{tabs[t].hint}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 max-w-2xl text-ink/75">{tabs[tab].text}</p>

      {tab === "encargo" && (
        <div className="mt-5 flex flex-col items-start gap-3 rounded-md bg-sand p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">¿No ves lo que buscas? Pídelo por encargo</p>
            <p className="mt-1 text-sm text-muted">Escríbenos qué producto, marca, referencia, talla o color quieres. Revisamos y te confirmamos precio y disponibilidad antes de pedirlo.</p>
          </div>
          <a href={askLink} target="_blank" rel="noopener" className="btn-whatsapp shrink-0 !py-3 text-sm">
            <IconWhatsApp width={18} /> Pedir por WhatsApp
          </a>
        </div>
      )}

      <div className="mt-6"><CatalogFilters categories={categories} /></div>
      <p className="mt-6 text-sm text-muted">{list.length} {list.length === 1 ? "producto" : "productos"}</p>
      {list.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
        </div>
      ) : tab === "inmediata" ? (
        <div className="card mt-4 p-10 text-center">
          <p className="text-lg font-medium">No encontramos productos de entrega inmediata con esos filtros 😕</p>
          <p className="mt-2 text-muted">Mira las opciones por encargo o escríbenos y te lo conseguimos.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => go("encargo")} className="btn-outline">Ver por encargo</button>
            <a href={whatsappLink(`¡Hola! Estoy buscando: ${q}`)} target="_blank" rel="noopener" className="btn-whatsapp">Preguntar por WhatsApp</a>
          </div>
        </div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="text-lg font-medium">Cuéntanos qué quieres traer de USA ✈️</p>
          <p className="mt-2 text-muted">Lo buscamos en Estados Unidos y te confirmamos precio y tiempo de entrega.</p>
          <a href={askLink} target="_blank" rel="noopener" className="btn-whatsapp mt-5"><IconWhatsApp width={18} /> Pedir por WhatsApp</a>
        </div>
      )}
    </>
  );
}
