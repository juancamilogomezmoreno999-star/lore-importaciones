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
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-md bg-ink outline outline-1 outline-offset-8 outline-line md:max-w-[340px]">
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
        aria-pressed={!muted}
        className="absolute bottom-3 left-3 flex items-center gap-2 whitespace-nowrap rounded-[3px] bg-white px-3.5 py-2 text-sm font-semibold text-ink transition-colors [font-stretch:108%] hover:bg-gold-light"
      >
        {muted ? "🔊 Activar sonido" : "🔇 Silenciar"}
      </button>
    </div>
  );
}
