import { useState, type ReactNode } from "react";

type Props = {
  /** Lucide-style icon name, e.g. ShoppingBag, HomeIcon, BriefcaseBusiness */
  name: string;
  className?: string;
  alt?: string;
  /** Fallback React node rendered if the SVG is missing or fails to load */
  fallback?: ReactNode;
};

function toKebab(name: string) {
  // Drop optional "Icon" suffix (HomeIcon -> Home)
  const normalized = name.replace(/Icon$/, "");
  // PascalCase -> kebab-case (ShoppingBag -> shopping-bag)
  return normalized
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

export function CategorySvgIcon({ name, className, alt, fallback }: Props) {
  const [errored, setErrored] = useState(false);
  const src = `/icons/categories/${toKebab(name)}.svg`;

  if (errored) return fallback ?? null;

  return (
    <img
      src={src}
      alt={alt ?? name}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

export function categoryIconSrc(name: string) {
  return `/icons/categories/${toKebab(name)}.svg`;
}
