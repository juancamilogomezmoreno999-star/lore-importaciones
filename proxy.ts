import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refresca la sesión (panel y cuentas de clientes) y protege /admin.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  if (!url || !key) {
    if (!isAdmin) return NextResponse.next();
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login?demo=1", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // getSession lee y refresca la sesión desde la cookie sin consultar al servidor;
  // la verificación completa (usuario + permiso de admin) la hace requireAdmin en cada página y acción.
  const { data: { session } } = await supabase.auth.getSession();

  if (isAdmin && !session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*", "/cuenta/:path*"] };
