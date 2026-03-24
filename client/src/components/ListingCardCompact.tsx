import { Link } from "wouter";
import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface ListingCardCompactProps {
  id: number;
  title: string;
  price?: string | null;
  priceType?: string | null;
  neighborhood?: string | null;
  cityName?: string;
  isBoosted?: boolean | null;
  images?: { url: string; isPrimary?: boolean | null }[];
  seller?: {
    name?: string | null;
    isVerified?: boolean | null | undefined;
    plan?: string | null;
    planActive?: boolean | null;
  } | null;
  type?: string | null;
  onFavorite?: (id: number) => void;
  isFavorited?: boolean | null;
}

const TYPE_LABELS: Record<string, string> = {
  product: "Produto",
  service: "Serviço",
  vehicle: "Veículo",
  property: "Imóvel",
  food: "Comida",
  job: "Emprego",
};

export default function ListingCardCompact({
  id,
  title,
  price,
  priceType,
  neighborhood,
  cityName,
  isBoosted,
  images,
  seller,
  type,
  onFavorite,
  isFavorited,
}: ListingCardCompactProps) {
  const primaryImage = images?.find((image) => image.isPrimary) || images?.[0];
  const sellerLabel = seller?.name || "Anunciante";
  const isPremium = seller?.planActive && seller?.plan === "premium";
  const isProfessional =
    seller?.planActive && seller?.plan === "profissional" && !isPremium;

  const formatPrice = () => {
    if (!price || priceType === "free") return "Grátis";
    if (priceType === "on_request") return "Sob consulta";

    if (priceType === "negotiable") {
      return `R$ ${Number(price).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`;
    }

    return `R$ ${Number(price).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onFavorite?.(id);
        }}
        aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm"
      >
        <Heart
          className={`h-4 w-4 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-slate-400"
          }`}
        />
      </button>

      <Link href={`/anuncio/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-orange-100">
              <span className="font-display text-3xl font-black text-slate-400">
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {isBoosted && (
              <StatusBadge kind="impulsionado" />
            )}

            {type && (
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                {TYPE_LABELS[type] || type}
              </span>
            )}
          </div>
        </div>

        <div className="p-3">
          <p className="text-lg font-black leading-none text-blue-700">
            {formatPrice()}
          </p>

          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {neighborhood || cityName || "Norte Pioneiro"}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="truncate">{sellerLabel}</span>
            {seller?.isVerified && (
              <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            )}
            {isPremium && <StatusBadge kind="premium" />}
            {isProfessional && <StatusBadge kind="profissional" />}
          </div>
        </div>
      </Link>
    </div>
  );
}
