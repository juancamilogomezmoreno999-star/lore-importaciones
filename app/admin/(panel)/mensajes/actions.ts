"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export async function markRead(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").update({ read }).eq("id", id);
  revalidatePath("/admin/mensajes");
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/mensajes");
}
