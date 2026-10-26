"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  stock: number;
  variant: Record<string, string>;
  immediate?: boolean;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  /** Cliente con sesión iniciada (null si es visitante). */
  user: User | null;
  authReady: boolean;
  add: (item: CartItem) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "lore-carrito-v1";

/**
 * Junta el carrito guardado en la cuenta con el del navegador.
 * Si un producto está en los dos, se queda la cantidad mayor (así recargar la página no duplica nada).
 */
function mergeCarts(account: CartItem[], local: CartItem[]) {
  const map = new Map<string, CartItem>();
  for (const i of [...account, ...local]) {
    const k = cartKey(i);
    const prev = map.get(k);
    map.set(k, prev ? { ...i, quantity: Math.max(prev.quantity, i.quantity) } : i);
  }
  return Array.from(map.values());
}

export const cartKey = (i: Pick<CartItem, "productId" | "variant">) =>
  `${i.productId}|${Object.entries(i.variant).sort().map(([k, v]) => `${k}=${v}`).join("&")}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const syncedUser = useRef<string | null>(null);

  // 1. Carrito del navegador
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  // 2. Sesión del cliente
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createBrowserSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        // Al cerrar sesión el carrito queda guardado en la cuenta y se limpia de este dispositivo
        syncedUser.current = null;
        setItems([]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 3. Al iniciar sesión: traer el carrito de la cuenta y juntarlo con el del navegador
  useEffect(() => {
    if (!ready || !user || syncedUser.current === user.id) return;
    const supabase = createBrowserSupabase();
    let cancelled = false;
    supabase
      .from("customer_carts")
      .select("items")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || error) return;
        syncedUser.current = user.id;
        setItems((local) => mergeCarts((data?.items as CartItem[]) ?? [], local));
      });
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  // 4. Cada cambio del carrito se guarda en la cuenta
  useEffect(() => {
    if (!user || syncedUser.current !== user.id) return;
    const t = setTimeout(() => {
      createBrowserSupabase()
        .from("customer_carts")
        .upsert({ user_id: user.id, items, updated_at: new Date().toISOString() })
        .then(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [items, user]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.stock) } : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const update = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => (cartKey(i) === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => cartKey(i) !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      user,
      authReady,
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
      add,
      update,
      remove,
      clear,
    }),
    [items, ready, user, authReady, add, update, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
