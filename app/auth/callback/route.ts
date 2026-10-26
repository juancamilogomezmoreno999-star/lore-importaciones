import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

// Enlaces de los correos de Supabase (confirmar cuenta, recuperar contraseña) llegan aquí.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/cuenta";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/cuenta";
  if (code) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/cuenta/ingresar?error=enlace", url.origin));
}
