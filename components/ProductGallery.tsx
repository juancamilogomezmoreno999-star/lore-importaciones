"use client";
import { useRef, useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  if (images.length === 0) return <div className="aspect-square rounded-3xl bg-sand" />;

  const go = (i: number) => {
    setActive(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="-mx-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:mx-0 sm:rounded-3xl"
      >
        {images.map((src, i) => (
          <div key={src} className="relative aspect-square w-full shrink-0 snap-center bg-sand">
            <ProductImage src={src} alt={`${name} – foto ${i + 1}`} fill priority={i === 0} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
            {images.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Ver foto ${i + 1}`} className={`h-1.5 rounded-full transition-all ${active === i ? "w-6 bg-ink" : "w-1.5 bg-ink/25"}`} />
            ))}
          </div>
          <div className="mt-3 hidden gap-3 sm:flex">
            {images.map((src, i) => (
              <button key={src} onClick={() => go(i)} className={`relative h-20 w-20 overflow-hidden rounded-xl ring-2 transition ${active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"}`} aria-label={`Ver foto ${i + 1}`}>
                <ProductImage src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
