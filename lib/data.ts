import "server-only";
import type { Product } from "./types";
import { sampleProducts } from "./sample-products";
import { isSupabaseConfigured } from "./supabase/env";
import { createPublicClient } from "./supabase/public";

export type ProductFilters = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  sort?: "recientes" | "precio-asc" | "precio-desc";
};

const columns =
  "id, slug, name, description, category, price, compare_at_price, images, variants, stock, delivery_time, featured, visible, created_at";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    let list = sampleProducts.filter((p) => p.visible);
    if (filters.q) list = list.filter((p) => normalize(p.name).includes(normalize(filters.q!)));
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.min) list = list.filter((p) => p.price >= filters.min!);
    if (filters.max) list = list.filter((p) => p.price <= filters.max!);
    if (filters.sort === "precio-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (filters.sort === "precio-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }

  const supabase = createPublicClient();
  let query = supabase.from("products").select(columns).eq("visible", true);
  if (filters.q) query = query.ilike("name", `%${filters.q.replace(/[%_,()]/g, " ")}%`);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.min) query = query.gte("price", filters.min);
  if (filters.max) query = query.lte("price", filters.max);
  if (filters.sort === "precio-asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "precio-desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query.limit(200);
  if (error) {
    console.error("getProducts", error.message);
    return [];
  }
  return data as Product[];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!isSupabaseConfigured) return sampleProducts.filter((p) => p.featured).slice(0, limit);
  const { data } = await createPublicClient()
    .from("products")
    .select(columns)
    .eq("visible", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return sampleProducts.find((p) => p.slug === slug) ?? null;
  const { data } = await createPublicClient()
    .from("products")
    .select(columns)
    .eq("slug", slug)
    .eq("visible", true)
    .maybeSingle();
  return (data as Product) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts({ category: product.category });
  const others = all.filter((p) => p.id !== product.id);
  if (others.length >= limit) return others.slice(0, limit);
  const more = (await getFeaturedProducts(limit * 2)).filter(
    (p) => p.id !== product.id && !others.some((o) => o.id === p.id),
  );
  return [...others, ...more].slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  const list = isSupabaseConfigured
    ? (((await createPublicClient().from("products").select("category").eq("visible", true)).data ??
        []) as { category: string }[])
    : sampleProducts;
  return Array.from(new Set(list.map((p) => p.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}
