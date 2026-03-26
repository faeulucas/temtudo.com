import ListingCardCompact from "@/components/ListingCardCompact";
import type { HomeHighlightListing } from "@/features/home/types";
import { Link } from "wouter";

type Props = {
  serviceProviders: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function MobileServicesSection({ serviceProviders, cityNameById }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Serviços & empresas</p>
        <Link href="/guia" className="text-xs font-semibold text-orange-600">
          ver guia
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {serviceProviders.length === 0 ? (
          <p className="text-sm text-slate-500">
            Em breve vamos mostrar prestadores e empresas da sua cidade aqui.
          </p>
        ) : (
          serviceProviders.slice(0, 6).map((item) => {
            const image =
              item.images?.find((img) => img.isPrimary)?.url ||
              item.images?.[0]?.url;

            return (
              <ListingCardCompact
                key={`service-${item.id}`}
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
          })
        )}
      </div>
    </div>
  );
}
