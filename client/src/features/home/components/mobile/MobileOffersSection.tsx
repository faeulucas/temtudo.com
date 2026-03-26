import ListingCardCompact from "@/components/ListingCardCompact";
import type { HomeHighlightListing } from "@/features/home/types";
import { Link } from "wouter";

type Props = {
  listings: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function MobileOffersSection({ listings, cityNameById }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Ofertas e produtos</p>
        <Link href="/busca" className="text-xs font-semibold text-orange-600">
          ver todos
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {listings.slice(0, 6).map((item) => {
          const image =
            item.images?.find((img) => img.isPrimary)?.url ||
            item.images?.[0]?.url;

          return (
            <ListingCardCompact
              key={`list-${item.id}`}
              id={item.id}
              title={item.title}
              price={item.price}
              priceType={item.priceType}
              neighborhood={item.neighborhood ?? undefined}
              cityName={cityNameById(item.cityId)}
              images={image ? [{ url: image, isPrimary: true }] : []}
              seller={item.seller}
              type={item.type}
            />
          );
        })}
      </div>
    </div>
  );
}
