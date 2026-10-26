/** Mensaje de error en rojo debajo de un campo del formulario. */
export function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger">
      <span aria-hidden>⚠</span>
      {msg}
    </p>
  );
}
