import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = { title: "Ingresar o crear cuenta", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="container-x py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Mi cuenta</h1>
        <p className="mt-2 text-muted">Guarda tu carrito y tus datos de envío, y sigue tus pedidos desde cualquier dispositivo.</p>
      </div>
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}
