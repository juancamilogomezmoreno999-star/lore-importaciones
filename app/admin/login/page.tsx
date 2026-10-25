import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const initialError =
    sp.demo ? "Modo demostración: el panel se activa cuando conectes Supabase (README, paso 2)."
    : sp.error === "no-autorizado" ? "Este usuario no tiene permiso para entrar al panel."
    : undefined;
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="card w-full max-w-sm p-7">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <h1 className="mb-5 text-center font-sans text-lg font-semibold">Panel de administración</h1>
        <LoginForm initialError={initialError} />
      </div>
    </div>
  );
}
