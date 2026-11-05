import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { CatalogView } from "@/components/CatalogView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Productos originales de USA: entrega inmediata desde Colombia o por encargo desde Estados Unidos. Precios en pesos colombianos y envío a toda Colombia.",
  alternates: { canonical: "/catalogo" },
};

// La página se genera de antemano con todos los productos; filtrar y cambiar de pestaña es instantáneo.
export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <div className="container-x py-8">
      <h1 className="text-4xl sm:text-5xl">Catálogo</h1>
      <Suspense>
        <CatalogView products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
