import ListingCard from "@/components/ListingCard";
import { SectionHeader } from "./SectionHeader";
import { Link } from "wouter";
import { LayoutGrid } from "lucide-react";
import type { HomeHighlightListing } from "@/features/home/types";
import { formatListingPrice, getPriceTypeLabel } from "@/features/home/utils";

type Category = { id: number; name: string };

type Props = {
  listings: HomeHighlightListing[];
  categories: Category[];
  cityNameById: (cityId?: number | null) => string;
};

export function MarketplaceSection({ listings, categories, cityNameById }: Props) {
  return (
    <section className="container py-8 sm:py-10">
      <SectionHeader
        eyebrow="Marketplace regional"
        title="Novidades e oportunidades recentes"
        description="Depois que o usuário entende o produto, ele entra no fluxo natural de descoberta: anúncios, produtos e oportunidades da região."
        actionHref="/busca"
        actionLabel="Ver mais"
      />

      {listings.length > 0 ? (
        <>
          <div className="space-y-3 md:hidden">
            {listings.slice(0, 6).map((listing) => {
              const image = listing.images?.find((photo) => photo.isPrimary)?.url || listing.images?.[0]?.url;

              return (
                <Link
                  key={listing.id}
                  href={`/anuncio/${listing.id}`}
                  className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {image ? <img src={image} alt={listing.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-slate-100"><LayoutGrid className="h-5 w-5 text-slate-400" /></div>}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold text-slate-900">{listing.title}</p>

                    <p className="mt-1 text-base font-black text-orange-600">{formatListingPrice(listing.price, listing.priceType)}</p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
                        {getPriceTypeLabel(listing.priceType)}
                      </span>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                        {listing.type === "food"
                          ? "Comida"
                          : listing.type === "service"
                          ? "Serviço"
                          : listing.type === "property"
                          ? "Imóvel"
                          : listing.type === "vehicle"
                          ? "Veículo"
                          : "Produto"}
                      </span>
                    </div>

                    <p className="mt-2 truncate text-xs text-slate-500">
                      {[listing.neighborhood, cityNameById(listing.cityId)].filter(Boolean).join(", ") || "Norte Pioneiro"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="hidden grid-cols-2 gap-4 md:grid xl:grid-cols-5">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                {...listing}
                createdAt={listing.createdAt ?? new Date()}
                cityName={cityNameById(listing.cityId)}
                categoryName={categories.find((category) => category.id === listing.categoryId)?.name}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center">
          <LayoutGrid className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">Assim que novos anúncios entrarem no portal, a Home vai refletir isso aqui.</p>
        </div>
      )}
    </section>
  );
}
