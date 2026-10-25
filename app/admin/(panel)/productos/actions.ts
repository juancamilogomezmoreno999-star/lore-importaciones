"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";

const money = z.coerce.number().int("Usa solo números, sin puntos ni comas").min(0);

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  name: z.string().trim().min(3, "El nombre es muy corto").max(140),
  description: z.string().trim().max(5000).default(""),
  category: z.string().trim().min(2, "Escribe una categoría").max(60),
  price: money.refine((n) => n > 0, "Escribe el precio"),
  compare_at_price: z.union([z.literal(""), money]).transform((v) => (v === "" || v === 0 ? null : v)),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  delivery_time: z.string().trim().min(2, "Escribe el tiempo de entrega").max(80),
  featured: z.string().optional().transform((v) => v === "on"),
  visible: z.string().optional().transform((v) => v === "on"),
  images: z.string().transform((s) => z.array(z.string().max(500).regex(/^(https:\/\/|\/)/)).max(12).parse(JSON.parse(s || "[]"))),
  variants: z.string().transform((s) =>
    z.array(z.object({ name: z.string().trim().min(1).max(40), options: z.array(z.string().trim().min(1).max(60)).min(1).max(40) })).max(5).parse(JSON.parse(s || "[]")),
  ),
});

function revalidateStore(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/producto/${slug}`);
}

export async function saveProduct(_prev: string | null, form: FormData): Promise<string | null> {
  const { supabase } = await requireAdmin();
  let parsed;
  try {
    parsed = schema.safeParse(Object.fromEntries(form));
  } catch {
    return "Revisa las fotos y las variantes: hay un dato inválido.";
  }
  if (!parsed.success) return parsed.error.issues[0].message;
  const { id, ...data } = parsed.data;
  if (data.compare_at_price !== null && data.compare_at_price <= data.price) {
    return "El precio anterior debe ser mayor que el precio actual (o déjalo vacío).";
  }

  if (id) {
    const { data: old } = await supabase.from("products").select("slug").eq("id", id).single();
    const { error } = await supabase.from("products").update(data).eq("id", id);
    if (error) return "No se pudo guardar: " + error.message;
    revalidateStore(old?.slug);
  } else {
    // Slug único a partir del nombre
    const base = slugify(data.name) || "producto";
    let slug = base;
    for (let i = 2; ; i++) {
      const { data: exists } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
      if (!exists) break;
      slug = `${base}-${i}`;
    }
    const { error } = await supabase.from("products").insert({ ...data, slug });
    if (error) return "No se pudo crear: " + error.message;
    revalidateStore(slug);
  }
  redirect("/admin/productos?ok=1");
}

export async function toggleVisible(id: string, visible: boolean) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").update({ visible }).eq("id", id).select("slug").single();
  revalidateStore(data?.slug);
  revalidatePath("/admin/productos");
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { data: product } = await supabase.from("products").select("slug, images").eq("id", id).single();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return;
  // Borra las fotos subidas a Supabase Storage
  const paths = (product?.images ?? [])
    .map((url: string) => url.split("/storage/v1/object/public/productos/")[1])
    .filter(Boolean);
  if (paths.length) await supabase.storage.from("productos").remove(paths);
  revalidateStore(product?.slug);
  revalidatePath("/admin/productos");
}
