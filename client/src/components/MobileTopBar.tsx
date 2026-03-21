import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { MapPin } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const MOBILE_TABS = [
  { label: "Tudo", href: "/", emoji: "✨" },
  { label: "Restaurantes", href: "/busca?type=food", emoji: "🍽️" },
  { label: "Mercados", href: "/busca?q=mercado", emoji: "🛒" },
  { label: "Lojas", href: "/lojas", emoji: "🏪" },
  { label: "Serviços", href: "/busca?q=servicos", emoji: "🛠️" },
  { label: "Guia local", href: "/guia", emoji: "🧭" },
];

const QUICK_CHIPS = ["Favoritos", "Cupons", "Serviços", "Mercados"];

type MobileTopBarProps = {
  selectedCityName?: string;
};

export default function MobileTopBar({ selectedCityName }: MobileTopBarProps) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const cityLabel = useMemo(
    () => selectedCityName || "Todas as cidades",
    [selectedCityName]
  );

  return (
    <div className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container space-y-3 pt-3 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span className="truncate">{cityLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={isAuthenticated ? "/favoritos" : "/login"}>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm">
                <span className="text-base">❤️</span>
              </button>
            </Link>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm">
              <span className="text-base">🔔</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {MOBILE_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className="flex min-w-[96px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
            >
              <span className="text-base">{tab.emoji}</span>
              <span className="truncate">{tab.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() =>
                navigate(`/busca?q=${encodeURIComponent(chip.toLowerCase())}`)
              }
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
