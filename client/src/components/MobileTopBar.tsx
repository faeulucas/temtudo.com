import { useMemo, useState } from "react";
import { useCurrentCity } from "@/contexts/CurrentCityContext";
import { Link, useLocation } from "wouter";
import { MapPin } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

const TAB_ICONS = {
  all: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/promo%C3%A7oes_mcwevy.png?v=2",
  delivery: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229863/delivery_dh1ldp.png?v=2",
  market: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/mercado_mklm3p.png?v=2",
  store: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229864/lojas_kkgcle.png?v=2",
  services: "https://res.cloudinary.com/dkrye3tmp/image/upload/v1774229865/servi%C3%A7os_yvvovd.png?v=2",
};

const MOBILE_TABS = [
  { label: "Tudo", href: "/", emoji: "?", image: TAB_ICONS.all },
  { label: "Restaurantes", href: "/delivery", emoji: "???", image: TAB_ICONS.delivery },
  { label: "Mercados", href: "/busca?q=mercado", emoji: "??", image: TAB_ICONS.market },
  { label: "Lojas", href: "/lojas", emoji: "??", image: TAB_ICONS.store },
  { label: "Serviços", href: "/servicos", emoji: "??", image: TAB_ICONS.services },
  { label: "Guia local", href: "/guia", emoji: "??" },
];

const QUICK_CHIPS = ["Favoritos", "Cupons", "Serviços", "Mercados"];

type MobileTopBarProps = {
  selectedCityName?: string;
};

function TabIcon({ image, emoji, alt }: { image?: string; emoji: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={alt}
        className="h-5 w-5 object-contain"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return <span className="text-base leading-none">{emoji}</span>;
}

export default function MobileTopBar({ selectedCityName }: MobileTopBarProps) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { city } = useCurrentCity();

  const cityLabel = useMemo(
    () => selectedCityName || city?.name || "Todas as cidades",
    [selectedCityName, city?.name]
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
                <span className="text-base">??</span>
              </button>
            </Link>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm">
              <span className="text-base">??</span>
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
              <TabIcon image={tab.image} emoji={tab.emoji} alt={tab.label} />
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










