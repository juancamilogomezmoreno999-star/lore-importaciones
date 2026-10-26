"use client";
import { useRef, useState } from "react";

/** Video de presentación: arranca solo y en silencio; el botón activa el sonido desde el inicio. */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (muted) {
      v.currentTime = 0;
      v.muted = false;
      v.play().catch(() => {});
    } else {
      v.muted = true;
    }
    setMuted(!muted);
  };

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-3xl bg-ink ring-1 ring-gold/30 md:max-w-[330px]">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Lorena presentando Lore Importaciones"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink/80 px-4 py-2 text-sm font-semibold text-gold-light backdrop-blur transition hover:bg-ink"
      >
        {muted ? "🔊 Activar sonido" : "🔇 Silenciar"}
      </button>
    </div>
  );
}
