"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { IconSearch } from "./icons";

const priceRanges = [
  { label: "Todos los precios", min: "", max: "" },
  { label: "Hasta $200.000", min: "", max: "200000" },
  { label: "$200.000 – $400.000", min: "200000", max: "400000" },
  { label: "Más de $400.000", min: "400000", max: "" },
];

export function CatalogFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const set = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    start(() => router.replace(`/catalogo${next.size ? `?${next}` : ""}`, { scroll: false }));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) set({ q });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const category = params.get("categoria") ?? "";
  const rangeIndex = Math.max(0, priceRanges.findIndex((r) => r.min === (params.get("min") ?? "") && r.max === (params.get("max") ?? "")));

  return (
    <div className={`space-y-3 transition ${pending ? "opacity-70" : ""}`}>
      <label className="relative block">
        <span className="sr-only">Buscar por nombre</span>
        <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" width={20} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar productos…"
          className="input !rounded-full pl-11"
        />
      </label>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {["", ...categories].map((c) => (
          <button
            key={c || "todas"}
            onClick={() => set({ categoria: c })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${category === c ? "border-ink bg-ink text-gold-light" : "border-ink/10 bg-white hover:border-gold"}`}
          >
            {c || "Todas"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          aria-label="Filtrar por precio"
          className="input !py-2.5 text-sm"
          value={rangeIndex}
          onChange={(e) => {
            const r = priceRanges[Number(e.target.value)];
            set({ min: r.min, max: r.max });
          }}
        >
          {priceRanges.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
        </select>
        <select
          aria-label="Ordenar"
          className="input !py-2.5 text-sm"
          value={params.get("orden") ?? ""}
          onChange={(e) => set({ orden: e.target.value })}
        >
          <option value="">Más recientes</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
        </select>
      </div>
    </div>
  );
}
