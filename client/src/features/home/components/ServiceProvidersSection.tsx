import { HeartHandshake, Phone, MapPin, ArrowRight } from "lucide-react";
import type { HomeHighlightListing } from "@/features/home/types";
import { SectionHeader } from "./SectionHeader";
import { Link } from "wouter";

type Props = {
  listings: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function ServiceProvidersSection({ listings, cityNameById }: Props) {
  return (
    <section className="container py-8 sm:py-10">
      <SectionHeader
        eyebrow="Serviços locais"
        title="Profissionais e prestadores com contato rápido"
        description="Essa seção ajuda a transformar o site em utilidade diária para a cidade, não só em vitrine de anúncios."
        actionHref="/busca?q=servicos"
        actionLabel="Ver serviços"
      />

      {listings.length > 0 ? (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-4 xl:overflow-visible xl:pb-0">
          {listings.map((item) => {
            const displayName = item.seller?.companyName?.trim() || item.seller?.name?.trim() || item.title;
            const cityName = cityNameById(item.seller?.cityId) || cityNameById(item.cityId);
            const whatsappNumber = item.seller?.whatsapp || item.whatsapp;
            const whatsappHref = whatsappNumber ? `https://wa.me/55${whatsappNumber.replace(/\D/g, "")}` : null;

            return (
              <article
                key={item.id}
                className="min-w-[82%] snap-center rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:min-w-[300px] sm:rounded-[28px] xl:min-w-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-slate-100 text-lg font-black text-blue-700">
                    {item.seller?.avatar ? <img src={item.seller.avatar} alt={displayName} className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-display text-xl font-bold text-slate-900">{displayName}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">{cityName}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{cityName}</span>
                </div>

                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    <Phone className="h-4 w-4" />
                    Falar no WhatsApp
                  </a>
                ) : (
                  <Link
                    href={`/anuncio/${item.id}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Ver perfil
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-8 text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-violet-300" />
          <p className="mt-4 text-slate-500">Os primeiros prestadores com contato rápido aparecerão aqui.</p>
        </div>
      )}
    </section>
  );
}
