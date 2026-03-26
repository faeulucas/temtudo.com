import { useState } from "react";

type Props = {
  emoji: string;
  image?: string;
  fallbackImage?: string;
  alt: string;
  className?: string;
};

export function CategoryIcon({ emoji, image, fallbackImage, alt, className }: Props) {
  const [src, setSrc] = useState<string | undefined>(image || fallbackImage);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span className="text-xl">{emoji}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className ?? "h-11 w-11 object-contain"}
      loading="lazy"
      onError={() => {
        if (fallbackImage && src !== fallbackImage) {
          setSrc(fallbackImage);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
