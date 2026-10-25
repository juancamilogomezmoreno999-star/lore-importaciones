"use client";
import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { ProductImage } from "@/components/ProductImage";

const MAX_SIDE = 1600;

/** Reduce la foto (las del celular pesan mucho) y la convierte a WebP antes de subirla. */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la imagen"))), "image/webp", 0.82),
  );
}

export function ImageUploader({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const supabase = createBrowserSupabase();
    const list = Array.from(files).slice(0, 12 - value.length);
    setUploading(list.length);
    const urls: string[] = [];
    for (const file of list) {
      try {
        const blob = await compress(file);
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage.from("productos").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw error;
        urls.push(supabase.storage.from("productos").getPublicUrl(path).data.publicUrl);
      } catch (e) {
        setError(`No se pudo subir "${file.name}". ${e instanceof Error ? e.message : ""}`);
      }
      setUploading((n) => n - 1);
    }
    onChange([...value, ...urls]);
    if (input.current) input.current.value = "";
  };

  const move = (from: number, to: number) => {
    const next = [...value];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-xl bg-sand ring-1 ring-ink/10">
            <ProductImage src={src} alt="" fill sizes="150px" className="object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-gold-light">Principal</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-1">
              <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded-full bg-white/90 px-2 text-sm disabled:opacity-30" aria-label="Mover a la izquierda">←</button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-full bg-white/90 px-2 text-sm text-danger" aria-label="Quitar foto">✕</button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, i + 1)} className="rounded-full bg-white/90 px-2 text-sm disabled:opacity-30" aria-label="Mover a la derecha">→</button>
            </div>
          </div>
        ))}
        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`u${i}`} className="flex aspect-square animate-pulse items-center justify-center rounded-xl bg-sand text-xs text-muted">Subiendo…</div>
        ))}
        {value.length + uploading < 12 && (
          <button type="button" onClick={() => input.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/20 bg-white text-sm text-muted hover:border-gold">
            <span className="text-3xl leading-none">📷</span>
            Agregar fotos
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <p className="mt-2 text-xs text-muted">Puedes tomar la foto o elegirla de la galería. La primera es la foto principal. Usa las flechas para cambiar el orden.</p>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
