import { BadgeCheck, MapPin, Phone, Store, ArrowRight, Building2 } from "lucide-react";
import { Link } from "wouter";
import { SectionHeader } from "./SectionHeader";
import type { HomeHighlightListing } from "@/features/home/types";
import { getStorefrontHref } from "@/lib/storefront";

type Category = { id: number; name: string };

type Props = {
  listings: HomeHighlightListing[];
  categories: Category[];
  cityNameById: (cityId?: number | null) => string;
};

export function CompanyHighlightsSection({ listings, categories, cityNameById }: Props) {
  return (
    <section id="lojas-empresas" className="container py-2 sm:py-4">
      <SectionHeader
        eyebrow="Lojas em destaque"
        title="Negócios locais que já podem vender online pelo Norte Vivo"
        description="Aqui está seu diferencial mais forte: dar presença digital para quem vende na região, mesmo sem ter site próprio."
        actionHref="/lojas"
        actionLabel="Ver lojas"
      />

      {listings.length > 0 ? (
        <>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden">
            {listings.map((item) => {
              const displayName = item.seller?.companyName?.trim() || item.seller?.name?.trim() || item.title;
              const cityName = cityNameById(item.seller?.cityId);
              const neighborhood = item.seller?.neighborhood?.trim();
              const subtitle = categories.find((category) => category.id === item.categoryId)?.name || item.subcategory || "Negócio local";

              return (
                <Link
                  key={item.id}
                  href={getStorefrontHref(item.seller?.id, item.id)}
                  className="min-w-[86%] snap-center rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] bg-slate-100 text-lg font-black text-blue-700">
                    {item.seller?.avatar ? (
                      <img src={item.seller.avatar} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="truncate font-display text-2xl font-bold leading-tight text-slate-900">{displayName}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        <Store className="h-3.5 w-3.5" />
                        {subtitle}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {item.seller?.isVerified ? "Verificada" : "Perfil ativo"}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      Conheça a loja, veja os produtos publicados e fale direto com quem vende.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {[neighborhood, cityName].filter(Boolean).join(", ")}
                      </span>

                      {(item.seller?.whatsapp || item.whatsapp) && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <Phone className="h-4 w-4" />
                          WhatsApp
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="hidden gap-4 overflow-x-auto pb-2 md:flex">
            {listings.map((item) => {
              const cover = item.seller?.bannerUrl || item.images?.find((image) => image.isPrimary)?.url || item.images?.[0]?.url;
              const displayName = item.seller?.companyName?.trim() || item.seller?.name?.trim() || item.title;
              const cityName = cityNameById(item.seller?.cityId);
              const neighborhood = item.seller?.neighborhood?.trim();
              const subtitle = categories.find((category) => category.id === item.categoryId)?.name || item.subcategory || "Negócio local";

              return (
                <article
                  key={item.id}
                  className="min-w-[280px] max-w-[320px] flex-1 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                >
                  <Link href={getStorefrontHref(item.seller?.id, item.id)} className="block">
                    <div className="relative h-40 bg-slate-100">
                      {cover ? (
                        <img src={cover} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
                          <span className="font-display text-4xl font-black text-slate-700">{displayName.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        <Store className="h-3.5 w-3.5" />
                        {subtitle}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {item.seller?.isVerified ? "Verificada" : "Perfil ativo"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-lg font-black text-blue-700">
                        {item.seller?.avatar ? (
                          <img src={item.seller.avatar} alt={displayName} className="h-full w-full object-cover" />
                        ) : (
                          displayName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-display text-xl font-bold text-slate-900">{displayName}</p>
                        <p className="truncate text-sm text-slate-500">{subtitle}</p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      Veja a vitrine da loja, os itens publicados e os canais de contato disponíveis.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {[neighborhood, cityName].filter(Boolean).join(", ")}
                      </span>

                      {(item.seller?.whatsapp || item.whatsapp) && (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <Phone className="h-4 w-4" />
                          WhatsApp disponível
                        </span>
                      )}
                    </div>

                    <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                      Ver perfil
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-500">As primeiras lojas e empresas aparecerão aqui.</p>
        </div>
      )}
    </section>
  );
}
