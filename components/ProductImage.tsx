import Image, { type ImageProps } from "next/image";

/** next/image con soporte para las imágenes SVG de ejemplo. */
export function ProductImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized={props.unoptimized ?? src.endsWith(".svg")} />;
}
