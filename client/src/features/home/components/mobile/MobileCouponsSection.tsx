import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { COLLECTION_CARD, PROMO_BANNERS } from "@/features/home/constants";

type Banner = (typeof PROMO_BANNERS)[number];

type Props = {
  banners: Banner[];
  collectionCard: typeof COLLECTION_CARD;
};

export function MobileCouponsSection({ banners, collectionCard }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Cupons e destaques</p>
        <Link href={collectionCard.href} className="text-xs font-semibold text-orange-600">
          ver tudo
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="block min-w-[240px] rounded-2xl bg-slate-50 px-4 py-4 shadow-sm transition hover:shadow-md"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {banner.title}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">{banner.subtitle}</p>
            <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              {banner.cta}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}

        <Link
          href={collectionCard.href}
          className="block min-w-[240px] rounded-2xl bg-slate-900 p-4 text-white shadow-sm transition hover:shadow-md"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-200">
            {collectionCard.title}
          </p>
          <p className="mt-2 text-lg font-extrabold leading-tight text-white">
            {collectionCard.cardTitle}
          </p>
          <p className="mt-2 text-sm text-slate-100">{collectionCard.cardSubtitle}</p>
        </Link>
      </div>
    </div>
  );
}
