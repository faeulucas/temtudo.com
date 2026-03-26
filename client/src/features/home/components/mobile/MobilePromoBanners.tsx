import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PROMO_BANNERS } from "@/features/home/constants";

type Banner = (typeof PROMO_BANNERS)[number];

type Props = {
  banners: Banner[];
};

export function MobilePromoBanners({ banners }: Props) {
  return (
    <div className="container mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
      {banners.map((banner) => (
        <Link
          key={`mobile-banner-${banner.id}`}
          href={banner.href}
          className="min-w-[250px] snap-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4 py-4 text-white shadow-lg"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-200">
            {banner.title}
          </p>
          <p className="mt-1 text-lg font-extrabold leading-tight">{banner.subtitle}</p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-200">
            {banner.cta}
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      ))}
    </div>
  );
}
