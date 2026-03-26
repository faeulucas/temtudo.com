import { BriefcaseBusiness, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { HomeHighlightListing } from "@/features/home/types";
import { parseHomeExtraData } from "@/features/home/utils";

type Props = {
  eventListings: HomeHighlightListing[];
  jobListings: HomeHighlightListing[];
  cityNameById: (cityId?: number | null) => string;
};

export function MobileEventsJobsSection({ eventListings, jobListings, cityNameById }: Props) {
  const hasContent = eventListings.length > 0 || jobListings.length > 0;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Eventos e oportunidades</p>

      <div className="mt-3 space-y-3">
        {!hasContent ? (
          <p className="text-sm text-slate-500">
            Divulgue próximos eventos e vagas para eles aparecerem aqui.
          </p>
        ) : (
          <>
            {eventListings.slice(0, 3).map((item) => {
              const image =
                item.images?.find((image) => image.isPrimary)?.url ||
                item.images?.[0]?.url;
              const extra = parseHomeExtraData(item.extraDataJson);

              return (
                <Link
                  key={`event-${item.id}`}
                  href={`/anuncio/${item.id}`}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50/60"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {image ? (
                      <img src={image} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <CalendarDays className="h-5 w-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                      Evento
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
                      {[item.neighborhood, cityNameById(item.cityId)].filter(Boolean).join(", ") || "Norte Pioneiro"}
                    </div>
                    <p className="mt-1 line-clamp-2 font-display text-base font-bold text-slate-900">
                      {item.title}
                    </p>
                    {(extra.eventDate || extra.eventVenue) && (
                      <p className="mt-1 text-xs font-semibold text-blue-700">
                        {[extra.eventDate, extra.eventVenue].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}

            {jobListings.slice(0, 3).map((item) => {
              const image =
                item.images?.find((image) => image.isPrimary)?.url ||
                item.images?.[0]?.url;
              const extra = parseHomeExtraData(item.extraDataJson);

              return (
                <Link
                  key={`job-${item.id}`}
                  href={`/anuncio/${item.id}`}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-emerald-50 p-3 transition hover:border-emerald-200"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {image ? (
                      <img src={image} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <BriefcaseBusiness className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Vaga
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {[item.neighborhood, cityNameById(item.cityId)].filter(Boolean).join(", ") || "Norte Pioneiro"}
                    </div>
                    <p className="mt-1 line-clamp-2 font-display text-base font-bold text-slate-900">
                      {item.title}
                    </p>
                    {(extra.jobSalary || extra.jobMode) && (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        {[extra.jobSalary, extra.jobMode].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
