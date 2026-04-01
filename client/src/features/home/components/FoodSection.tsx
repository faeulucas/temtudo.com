import ListingCard from "@/components/ListingCard";
import { SectionHeader } from "./SectionHeader";
import type { HomeHighlightListing } from "@/features/home/types";
import { ShoppingBag, Star, BadgeCheck, MapPin } from "lucide-react";
import { Link } from "wouter";
import { formatListingPrice } from "@/features/home/utils";

type Props = {
  listings: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function FoodSection({ listings, cityNameById }: Props) {
  return (
    <section className="bg-orange-50 py-8 sm:py-10">
      <div className="container">
        <SectionHeader
          eyebrow="O que comer hoje"
          title="Bateu a fome? Peça agora nas melhores lojas abertas"
          description="Essa seção ajuda o usuário no dia a dia e aumenta recorrência de visita ao site."
          actionHref="/busca?q=lanche"
          actionLabel="Ver lanches"
        />

        {listings.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
            {listings.map((listing, index) => {
              const image = listing.images?.find((photo) => photo.isPrimary)?.url || listing.images?.[0]?.url;
              const cityName = cityNameById(listing.cityId);
              const popularityLabel = index === 0 || (listing.viewCount ?? 0) >= 30 ? "Mais pedido" : "Em destaque";

              return (
                <div key={listing.id} className="min-w-[84%] snap-center sm:min-w-0">
                  <div className="sm:hidden">
                    <Link href={`/anuncio/${listing.id}`} className="block overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {image ? (
                          <img src={image} alt={listing.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
                            <ShoppingBag className="h-8 w-8 text-orange-300" />
                          </div>
                        )}

                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                          Lanche
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-700">
                          {listing.subcategory || "Lanche do dia"}
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-7 text-slate-900">{listing.title}</h3>

                        <p className="mt-2 text-2xl font-black text-blue-700">{formatListingPrice(listing.price, listing.priceType)}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {popularityLabel}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Aberto agora
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          Fale direto com quem vende e veja se atende a sua cidade.
                        </p>

                        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {cityName}
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="hidden sm:block">
                    <ListingCard
                      {...listing}
                      createdAt={listing.createdAt ?? new Date()}
                      cityName={cityName}
                      categoryName="Delivery"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-orange-200" />
            <p className="mt-4 text-slate-500">Assim que houver lanches de lojas abertas agora, eles aparecerão aqui.</p>
          </div>
        )}
      </div>
    </section>
  );
}
