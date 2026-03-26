import { Button } from "@/components/ui/button";
import { advertiserHref } from "@/lib/navigation";
import { Store, Search, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import type { FILTER_CHIPS } from "@/features/home/constants";

type Props = {
  isAuthenticated: boolean;
  onSearch: (query: string) => void;
  filterChips: typeof FILTER_CHIPS;
};

export function MobileAppCard({ isAuthenticated, onSearch, filterChips }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-orange-50 via-white to-slate-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
          <HomeIcon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Norte Vivo app
          </p>
          <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
            Tudo da sua cidade na mão
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Guia local, lojas, serviços e delivery em um app leve.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button className="h-11 rounded-2xl bg-slate-900 text-white hover:bg-slate-800" onClick={() => onSearch("")}>
          <Search className="mr-2 h-4 w-4" />
          Explorar agora
        </Button>

        <Link href={advertiserHref("/anunciante/novo", isAuthenticated)}>
          <Button variant="outline" className="h-11 w-full rounded-2xl border-slate-300 text-slate-900 hover:bg-slate-50">
            <Store className="mr-2 h-4 w-4" />
            Divulgar negócio
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {filterChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSearch(chip === "Filtros" ? "" : chip.replace(" ", "+"))}
            className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
