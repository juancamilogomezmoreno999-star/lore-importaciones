import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Nuevo producto" };

export default async function NewProduct() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("category");
  const categories = Array.from(new Set((data ?? []).map((d) => d.category as string)));
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
