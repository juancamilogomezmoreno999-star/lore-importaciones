import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Editar producto" };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [{ data: product }, { data: cats }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle<Product>(),
    supabase.from("products").select("category"),
  ]);
  if (!product) notFound();
  const categories = Array.from(new Set((cats ?? []).map((d) => d.category as string)));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Editar producto</h1>
        <Link href={`/producto/${product.slug}`} target="_blank" className="text-sm text-gold-dark hover:underline">Ver en tienda ↗</Link>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
