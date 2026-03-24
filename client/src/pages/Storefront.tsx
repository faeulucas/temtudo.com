import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BadgeCheck,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  Sparkles,
  ShieldCheck,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { StatusBadge } from "@/components/StatusBadge";

export default function StorefrontPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const sellerIdAsNumber = Number(sellerId);
  const isValidSellerId =
    Number.isFinite(sellerIdAsNumber) && sellerIdAsNumber > 0;

  const { data, isLoading } = trpc.public.sellerProfile.useQuery(
    {
      sellerId: sellerIdAsNumber,
    },
    {
      enabled: isValidSellerId,
    }
  );

  const { data: cities } = trpc.public.cities.useQuery();

  const seller = data?.seller;
  const listings = data?.listings ?? [];
  const isSellerPremium = seller?.planActive && seller?.plan === "premium";
  const isSellerProfessional =
    seller?.planActive && seller?.plan === "profissional" && !isSellerPremium;

  const cityName =
    cities?.find((city) => city.id === seller?.cityId)?.name ??
    "Norte Pioneiro";

  const locationLabel = [seller?.neighborhood, cityName]
    .filter(Boolean)
    .join(", ");

  const displayName =
    seller?.personType === "pj"
      ? seller.companyName || seller.name || "Loja"
      : seller?.name || "Anunciante";

  const whatsappHref = seller?.whatsapp
    ? `https://wa.me/55${seller.whatsapp.replace(/\D/g, "")}`
    : null;

  const phoneDigits =
    seller?.phone?.replace(/\D/g, "") ||
    seller?.whatsapp?.replace(/\D/g, "") ||
    "";

  const phoneHref = phoneDigits ? `tel:${phoneDigits}` : null;

  const joinedLabel = seller?.createdAt
    ? formatDistanceToNow(new Date(seller.createdAt), {
        addSuffix: true,
        locale: ptBR,
      })
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
        <Header />
        <div className="container py-8">
          <div className="space-y-5">
            <div className="h-64 animate-pulse rounded-[32px] bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-[28px] bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isValidSellerId || !data || !seller) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
        <Header />
        <div className="container py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
            <Store className="h-10 w-10 text-slate-400" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-black text-slate-900">
            Loja não encontrada
          </h1>

          <p className="mt-3 text-slate-500">
            Essa vitrine não está disponível ou ainda não possui anúncios públicos.
          </p>

          <Link href="/lojas">
            <Button className="mt-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
              Ver outras lojas
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container py-6">
        <div className="mb-4 flex items-center gap-2 overflow-hidden text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Início
          </Link>
          <span>/</span>
          <Link href="/lojas" className="hover:text-blue-600">
            Lojas
          </Link>
          <span>/</span>
          <span className="truncate font-medium text-slate-900">
            {displayName}
          </span>
        </div>

        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#f97316_130%)] text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
          <div className="relative h-48 sm:h-64">
            {seller.bannerUrl ? (
              <img
                src={seller.bannerUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#f97316_130%)]" />
            )}
            <div className="absolute inset-0 bg-slate-900/30" />
          </div>

          <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border-4 border-white bg-white text-3xl font-black text-slate-700 shadow-lg sm:h-28 sm:w-28">
                  {seller.avatar ? (
                    <img
                      src={seller.avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="break-words font-display text-3xl font-black text-white sm:text-4xl">
                      {displayName}
                    </h1>

                    {seller.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        <BadgeCheck className="h-4 w-4" />
                        Verificada
                      </span>
                    )}

                    {isSellerPremium && <StatusBadge kind="premium" />}
                    {isSellerProfessional && <StatusBadge kind="profissional" />}

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        seller.isOpenNow
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-white/15 text-white"
                      }`}
                    >
                      {seller.isOpenNow ? "Aberta agora" : "Fora do horário"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-50/90">
                    {locationLabel && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-orange-300" />
                        {locationLabel}
                      </span>
                    )}

                    {joinedLabel && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4 text-blue-200" />
                        No portal {joinedLabel}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5">
                      <LayoutGrid className="h-4 w-4 text-blue-200" />
                      {listings.length} item(ns) publicado(s)
                    </span>
                  </div>

                  {seller.bio && (
                    <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-blue-50/90 sm:text-base">
                      {seller.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full rounded-2xl bg-green-500 text-white hover:bg-green-600">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                )}

                {phoneHref && (
                  <a href={phoneHref}>
                    <Button className="w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                      <Phone className="mr-2 h-4 w-4" />
                      Ligar
                    </Button>
                  </a>
                )}

                {locationLabel && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      locationLabel
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-2"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/15"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Abrir localização
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-orange-50 p-3 text-orange-600">
              <Store className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Vitrine local
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Loja com presença digital
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Essa página valoriza a loja, os contatos e os itens publicados
              dentro do Norte Vivo.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Confiança
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Contato direto e perfil ativo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              O cliente consegue ver a loja, localizar e entrar em contato com
              mais segurança.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Descoberta
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Produtos em uma vitrine organizada
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quanto melhor a vitrine, maior a chance do usuário clicar em mais
              itens da loja.
            </p>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Vitrine da loja
              </p>
              <h2 className="font-display text-3xl font-black text-slate-900">
                Produtos e anúncios publicados
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {listings.length} item(ns) visível(is) no portal.
              </p>
            </div>

            <div className="rounded-[22px] bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <span className="font-semibold text-slate-900">Loja:</span>{" "}
              {displayName}
            </div>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={cityName}
                  seller={{
                    name: displayName,
                    isVerified: seller.isVerified,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center">
              <Store className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">
                Esta loja ainda não publicou produtos ou anúncios visíveis.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
                Quer falar com a loja?
              </p>
              <h2 className="mt-3 font-display text-3xl font-black">
                Entre em contato e veja os produtos disponíveis.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                Use o WhatsApp, ligação ou localização para falar diretamente com
                o responsável pela loja.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="h-12 w-full rounded-2xl bg-green-500 text-white hover:bg-green-600">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar no WhatsApp
                  </Button>
                </a>
              )}

              {phoneHref && (
                <a href={phoneHref}>
                  <Button className="h-12 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                    <Phone className="mr-2 h-4 w-4" />
                    Ligar agora
                  </Button>
                </a>
              )}

              <Link href="/lojas">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Ver outras lojas
                </Button>
              </Link>

              <Link href="/busca">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Explorar anúncios
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
