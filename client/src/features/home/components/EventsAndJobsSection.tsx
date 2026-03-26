import { ArrowRight, BriefcaseBusiness, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import type { HomeHighlightListing } from "@/features/home/types";
import { parseHomeExtraData } from "@/features/home/utils";

type Props = {
  eventListings: HomeHighlightListing[];
  jobListings: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function EventsAndJobsSection({ eventListings, jobListings, cityNameById }: Props) {
  return (
    <section className="container pb-8 sm:pb-10">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Eventos da região</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Feiras, shows, encontros e atrações locais em um só lugar.</p>
            </div>
          </div>

          {eventListings.length > 0 ? (
            <div className="mt-5 space-y-3">
              {eventListings.map((item) => {
                const image = item.images?.find((image) => image.isPrimary)?.url || item.images?.[0]?.url;
                const extra = parseHomeExtraData(item.extraDataJson);

                return (
                  <Link
                    key={item.id}
                    href={`/anuncio/${item.id}`}
                    className="block overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                        {image ? <img src={image} alt={item.title} className="h-full w-full object-cover" /> : <CalendarDays className="h-6 w-6 text-slate-400" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">Evento local</span>

                        <p className="mt-2 line-clamp-2 font-display text-lg font-bold leading-6 text-slate-900">{item.title}</p>

                        <p className="mt-2 text-sm text-slate-500">{[item.neighborhood, cityNameById(item.cityId)].filter(Boolean).join(", ") || "Norte Pioneiro"}</p>

                        {(extra.eventDate || extra.eventVenue) && (
                          <p className="mt-1 truncate text-xs font-medium text-blue-700">{[extra.eventDate, extra.eventVenue].filter(Boolean).join(" · ")}</p>
                        )}

                        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                          Ver detalhes
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-6 text-slate-500">Ainda não há eventos publicados. Use o Norte Vivo para divulgar a próxima atração da sua região.</p>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Vagas de emprego</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Vagas locais, trabalhos rápidos e oportunidades reais da região.</p>
            </div>
          </div>

          {jobListings.length > 0 ? (
            <div className="mt-5 space-y-3">
              {jobListings.map((item) => {
                const image = item.images?.find((image) => image.isPrimary)?.url || item.images?.[0]?.url;
                const extra = parseHomeExtraData(item.extraDataJson);

                return (
                  <Link
                    key={item.id}
                    href={`/anuncio/${item.id}`}
                    className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      {image ? <img src={image} alt={item.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-6 w-6 text-slate-400" />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-bold text-slate-900">{item.title}</p>
                      <p className="mt-1 truncate text-sm text-slate-500">{[item.neighborhood, cityNameById(item.cityId)].filter(Boolean).join(", ") || "Norte Pioneiro"}</p>

                      {(extra.jobSalary || extra.jobMode) && (
                        <p className="mt-1 truncate text-xs font-medium text-emerald-700">{[extra.jobSalary, extra.jobMode].filter(Boolean).join(" · ")}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-6 text-slate-500">Ainda não há vagas publicadas. Em breve essa área pode reunir empregos e freelas da região.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
