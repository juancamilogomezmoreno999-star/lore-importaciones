import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
import { store } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = store.siteUrl;
  const pages = ["", "/catalogo", "/sobre-nosotros", "/preguntas-frecuentes", "/contacto", "/terminos", "/privacidad"];
  const products = await getProducts();
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${base}/producto/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
