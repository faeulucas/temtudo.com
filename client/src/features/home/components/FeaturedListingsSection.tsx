import ListingCard from "@/components/ListingCard";
import { SectionHeader } from "./SectionHeader";
import { Link } from "wouter";
import { Zap, MapPin } from "lucide-react";
import type { HomeHighlightListing } from "@/features/home/types";
import { formatListingPrice } from "@/features/home/utils";

type Category = { id: number; name: string };

type Props = {
  listings: HomeHighlightListing[];
  categories: Category[];
  cityNameById: (cityId?: number | null) => string;
};

export function FeaturedListingsSection({ listings, categories, cityNameById }: Props) {
  return (
    <section id="marketplace" className="container py-2 sm:py-4">
      <SectionHeader
        eyebrow="Destaques da semana"
        title="Produtos patrocinados com mais visibilidade"
        description="Essa é a área comercial mais forte da plataforma. Aqui ficam os anúncios impulsionados para gerar clique e venda."
        actionHref="/booster"
        actionLabel="Ver destaques"
      />

      {listings.length > 0 ? (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-4 xl:overflow-visible xl:pb-0">
          {listings.map((listing) => {
            const primaryImage = listing.images?.find((image) => image.isPrimary)?.url || listing.images?.[0]?.url;
            const categoryName = categories.find((category) => category.id === listing.categoryId)?.name;

            return (
              <div
                key={listing.id}
                className="min-w-[78%] snap-center overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm sm:min-w-[360px] xl:min-w-0"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-black text-white">
                    <Zap className="h-3.5 w-3.5" />
                    PATROCINADO
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">Maior destaque</span>
                </div>

                <div className="sm:hidden">
                  <Link href={`/anuncio/${listing.id}`} className="block">
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      {primaryImage ? (
                        <img src={primaryImage} alt={listing.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-orange-100">
                          <span className="font-display text-4xl font-black text-slate-700">{listing.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                        {[categoryName, listing.subcategory].filter(Boolean).join(" · ")}
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-6 text-slate-900">{listing.title}</h3>

                      <p className="mt-2 text-2xl font-black text-blue-700">
                        {formatListingPrice(listing.price, listing.priceType)}
                      </p>

                      <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {listing.neighborhood || cityNameById(listing.cityId)}
                        </span>
                        <span>
                          {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString("pt-BR") : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="hidden sm:block">
                  <ListingCard
                    {...listing}
                    createdAt={listing.createdAt ?? new Date()}
                    cityName={cityNameById(listing.cityId)}
                    categoryName={categoryName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-amber-200 bg-white p-10 text-center">
          <Zap className="mx-auto h-12 w-12 text-amber-300" />
          <p className="mt-4 text-slate-500">Assim que houver anúncios impulsionados, eles aparecerão aqui.</p>
        </div>
      )}
    </section>
  );
}
