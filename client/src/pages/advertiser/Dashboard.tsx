import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_ROUTE } from "@/const";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getAdvertiserInsights } from "@/lib/advertiserInsights";
import { CASHBACK_RULES } from "@/lib/cashback";
import { getSegmentFromCategorySlug, SEGMENT_CONTENT } from "@/lib/segments";
import { toast } from "sonner";
import {
  AlertCircle,
  ChevronRight,
  Clock3,
  CookingPot,
  Cpu,
  Pencil,
  Eye,
  Heart,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  Store,
  Package,
  Pause,
  Play,
  Plus,
  Shirt,
  Star,
  Settings,
  Trash2,
  CarFront,
  Zap,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  active: { label: "Ativo", badge: "bg-emerald-50 text-emerald-700" },
  pending: { label: "Pendente", badge: "bg-amber-50 text-amber-700" },
  paused: { label: "Pausado", badge: "bg-slate-100 text-slate-700" },
  sold: { label: "Vendido", badge: "bg-blue-50 text-blue-700" },
  rejected: { label: "Rejeitado", badge: "bg-red-50 text-red-700" },
  expired: { label: "Expirado", badge: "bg-rose-50 text-rose-700" },
};

const SEGMENT_ICON = {
  generic: Store,
  food: CookingPot,
  vehicles: CarFront,
  fashion: Shirt,
  electronics: Cpu,
} as const;

export default function AdvertiserDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: stats } = trpc.advertiser.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: categories } = trpc.public.categories.useQuery();

  const updateMutation = trpc.advertiser.updateListing.useMutation({
    onSuccess: async () => {
      await utils.advertiser.stats.invalidate();
      toast.success("Anúncio atualizado.");
    },
  });

  const deleteMutation = trpc.advertiser.deleteListing.useMutation({
    onSuccess: async () => {
      await utils.advertiser.stats.invalidate();
      setDeletingId(null);
      toast.success("Anúncio removido.");
    },
  });

  const boostMutation = trpc.advertiser.activateBooster.useMutation({
    onSuccess: async () => {
      await utils.advertiser.stats.invalidate();
      toast.success("Booster ativado.");
    },
  });

  useEffect(() => {
    if (deletingId === null) return;
    const timeout = setTimeout(() => setDeletingId(null), 3000);
    return () => clearTimeout(timeout);
  }, [deletingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
        <Header />
        <div className="container py-20 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">
            <LogIn className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-800">
            Acesse seu painel
          </h2>
          <p className="mt-3 text-slate-500">
            Entre para visualizar seus anúncios, desempenho e favoritos.
          </p>
          <Link href={LOGIN_ROUTE}>
            <Button className="mt-6 rounded-xl bg-brand-gradient px-8 py-3 text-white">
              Entrar / Cadastrar
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const listings = stats?.listings ?? [];
  const topListing = stats?.topListing ?? null;
  const cashbackHighlights = CASHBACK_RULES.slice(0, 2);

  const primaryCategory = categories?.find((category) =>
    listings.some((listing) => listing.categoryId === category.id)
  );

  const segment = getSegmentFromCategorySlug(primaryCategory?.slug);
  const segmentContent = SEGMENT_CONTENT[segment];
  const SegmentIcon = SEGMENT_ICON[segment];
  const isFoodSegment = segment === "food";

  const displayName =
    user?.personType === "pj" ? user?.companyName || user?.name : user?.name;

  const boostableListings = listings.filter(
    (listing) => listing.status === "active" && !listing.isBoosted
  );

  const boostSuggestionListing = boostableListings[0] ?? null;
  const insights = getAdvertiserInsights(listings);

  const trialDaysLeft = user?.trialStartedAt
    ? Math.max(
        0,
        30 -
          Math.floor(
            (Date.now() - new Date(user.trialStartedAt).getTime()) / 86400000
          )
      )
    : 30;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container overflow-x-hidden py-4 sm:py-6">
        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#f97316_130%)] p-5 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                <LayoutDashboard className="h-4 w-4" />
                {segmentContent.quickLabel}
              </div>

              <h1 className="font-display text-3xl font-black text-white sm:text-4xl">
                {segmentContent.dashboardTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-blue-50/90">
                {displayName ? `Olá, ${displayName.split(" ")[0]}. ` : ""}
                {segmentContent.dashboardSubtitle}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-[22px] bg-white/10 px-4 py-3">
                  <p className="text-2xl font-black text-white">
                    {stats?.totalListings ?? 0}
                  </p>
                  <p className="text-sm text-blue-100">Anúncios cadastrados</p>
                </div>
                <div className="rounded-[22px] bg-white/10 px-4 py-3">
                  <p className="text-2xl font-black text-white">
                    {stats?.totalViews ?? 0}
                  </p>
                  <p className="text-sm text-blue-100">Visualizações</p>
                </div>
                <div className="rounded-[22px] bg-white/10 px-4 py-3">
                  <p className="text-2xl font-black text-white">
                    {stats?.totalContacts ?? 0}
                  </p>
                  <p className="text-sm text-blue-100">Contatos</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/anunciar" className="block w-full sm:w-auto">
                <Button className="w-full rounded-2xl bg-white px-6 py-6 font-bold text-slate-900 hover:bg-slate-100 sm:w-auto">
                  <Plus className="mr-2 h-5 w-5" />
                  {isFoodSegment ? "Novo item do cardápio" : "Novo anúncio"}
                </Button>
              </Link>

              <Link
                href="/anunciante/meus-dados"
                className="block w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-white/30 bg-white/10 px-6 py-6 font-semibold text-white hover:bg-white/15 sm:w-auto"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Meus dados
                </Button>
              </Link>

              <Link href="/planos" className="block w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-white/30 bg-white/10 px-6 py-6 font-semibold text-white hover:bg-white/15 sm:w-auto"
                >
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {trialDaysLeft <= 7 && trialDaysLeft > 0 && (
          <section className="mt-6 flex min-w-0 flex-col gap-3 rounded-[24px] border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-start">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800">
                Seu período grátis expira em {trialDaysLeft} dia(s)
              </p>
              <p className="text-sm text-amber-700">
                Considere fazer upgrade para manter seus anúncios ativos.
              </p>
            </div>
            <Link href="/planos" className="block w-full sm:w-auto">
              <Button
                size="sm"
                className="w-full rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 sm:w-auto"
              >
                Fazer upgrade
              </Button>
            </Link>
          </section>
        )}

        {boostSuggestionListing && (
          <section className="mt-4 flex min-w-0 flex-col gap-3 rounded-[24px] border border-blue-100 bg-blue-50/80 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-blue-900">
                  {boostableListings.length === 1
                    ? "Você tem 1 anúncio pronto para impulsionar."
                    : `Você tem ${boostableListings.length} anúncios prontos para impulsionar.`}
                </p>
                <p className="mt-1 text-sm text-blue-700">
                  {boostSuggestionListing.title} pode ganhar mais alcance com um
                  booster de 24h ou 7 dias.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 md:w-auto"
              onClick={() =>
                boostMutation.mutate({
                  listingId: boostSuggestionListing.id,
                  type: "featured",
                  durationDays: 1,
                })
              }
              disabled={boostMutation.isPending}
            >
              <Zap className="mr-2 h-4 w-4" />
              Impulsionar agora
            </Button>
          </section>
        )}

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: segmentContent.metrics[0]?.label ?? "Anúncios",
              value: stats?.totalListings ?? 0,
              note:
                segmentContent.metrics[0]?.helper ??
                `${stats?.statusBreakdown.active ?? 0} ativos`,
              icon: Package,
              tone: "bg-blue-50 text-blue-700",
            },
            {
              label: segmentContent.metrics[1]?.label ?? "Visualizações",
              value: stats?.totalViews ?? 0,
              note: segmentContent.metrics[1]?.helper ?? "alcance total",
              icon: Eye,
              tone: "bg-violet-50 text-violet-700",
            },
            {
              label: segmentContent.metrics[2]?.label ?? "Contatos",
              value: stats?.totalContacts ?? 0,
              note:
                segmentContent.metrics[2]?.helper ??
                `${stats?.totalFavorites ?? 0} favoritos`,
              icon: MessageSquare,
              tone: "bg-emerald-50 text-emerald-700",
            },
            {
              label: segmentContent.metrics[3]?.label ?? "Booster",
              value: stats?.activeBoosters ?? 0,
              note:
                segmentContent.metrics[3]?.helper ??
                `${stats?.boostedListings ?? 0} turbinado(s)`,
              icon: Zap,
              tone: "bg-amber-50 text-amber-700",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {item.value.toLocaleString()}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  {item.label}
                </div>
                <div className="mt-1 text-xs text-slate-500">{item.note}</div>
              </article>
            );
          })}
        </section>

        <section className="mt-6">
          <article className="min-w-0 overflow-hidden rounded-[24px] border border-slate-800 bg-slate-900 p-4 text-white shadow-lg sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <SegmentIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/80">
                    {segmentContent.badge}
                  </div>
                  <h2 className="mt-2 font-display text-lg font-black sm:text-xl">
                    {segmentContent.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-200">
                    {segmentContent.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:w-[520px] lg:max-w-full">
                {segmentContent.modules.map((module) => (
                  <div
                    key={module.title}
                    className="min-w-0 rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <div className="text-sm font-semibold text-white">
                      {module.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-200">
                      {module.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {primaryCategory && (
              <p className="mt-3 text-xs text-slate-300">
                Segmento principal detectado: {primaryCategory.name}
              </p>
            )}
          </article>
        </section>

        <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  {isFoodSegment ? "Itens do cardápio" : "Seus produtos"}
                </h2>
                <p className="text-sm text-slate-500">
                  {isFoodSegment
                    ? "Cadastre cada lanche, bebida, combo ou promoção como um item separado."
                    : "Lista completa do que você publicou."}
                </p>
              </div>

              <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:self-auto">
                {listings.length} item(ns)
              </span>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-[24px] bg-slate-50 p-12 text-center">
                <Package className="mx-auto mb-4 h-14 w-14 text-slate-200" />
                <h3 className="font-display text-xl font-bold text-slate-800">
                  {isFoodSegment
                    ? "Nenhum item do cardápio ainda"
                    : "Nenhum anúncio ainda"}
                </h3>
                <p className="mt-2 text-slate-500">
                  {isFoodSegment
                    ? "Comece cadastrando os lanches, porções, bebidas e combos da sua loja."
                    : "Crie seu primeiro produto e acompanhe tudo por aqui."}
                </p>
                <Link href="/anunciar">
                  <Button className="mt-6 rounded-2xl bg-brand-gradient px-6 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    {isFoodSegment ? "Cadastrar item" : "Criar anúncio"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => {
                  const statusCfg =
                    STATUS_CONFIG[listing.status || "pending"] ??
                    STATUS_CONFIG.pending;

                  return (
                    <article
                      key={listing.id}
                      className="min-w-0 overflow-hidden rounded-[22px] border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-400">
                          {listing.title.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/anuncio/${listing.id}`}
                            className="block min-w-0 w-full max-w-full"
                          >
                            <h3 className="block w-full max-w-full cursor-pointer break-words text-base font-semibold leading-tight text-slate-900 hover:text-blue-600">
                              {listing.title}
                            </h3>
                          </Link>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusCfg.badge}`}
                            >
                              {statusCfg.label}
                            </span>

                            {listing.isBoosted && (
                              <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                Boost ativo
                              </span>
                            )}

                            {!listing.isBoosted &&
                              listing.status === "active" && (
                                <span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                                  Pode impulsionar
                                </span>
                              )}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5 shrink-0" />
                              {listing.viewCount ?? 0} visualizações
                            </span>

                            <span className="flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5 shrink-0" />
                              {listing.favoriteCount ?? 0} favoritos
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5 shrink-0" />
                              {new Date(listing.createdAt).toLocaleDateString("pt-BR")}
                            </span>

                            {listing.price && (
                              <span className="break-words font-semibold text-blue-600">
                                R${" "}
                                {Number(listing.price).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                        <Link
                          href={`/anunciante/editar/${listing.id}`}
                          className="block w-full sm:w-auto"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full rounded-xl sm:w-auto"
                          >
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Editar
                          </Button>
                        </Link>

                        {!listing.isBoosted && (
                          <Button
                            size="sm"
                            className="w-full rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 sm:w-auto"
                            onClick={() =>
                              boostMutation.mutate({
                                listingId: listing.id,
                                type: "featured",
                                durationDays: 7,
                              })
                            }
                            disabled={boostMutation.isPending}
                          >
                            <Zap className="mr-1 h-3.5 w-3.5" />
                            Booster
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full rounded-xl sm:w-auto"
                          onClick={() =>
                            updateMutation.mutate({
                              id: listing.id,
                              status:
                                listing.status === "active"
                                  ? "paused"
                                  : "active",
                            })
                          }
                        >
                          {listing.status === "active" ? (
                            <>
                              <Pause className="mr-1 h-3.5 w-3.5" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="mr-1 h-3.5 w-3.5" />
                              Ativar
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                          onClick={() => {
                            if (deletingId === listing.id) {
                              deleteMutation.mutate({ id: listing.id });
                              return;
                            }
                            setDeletingId(listing.id);
                            toast.warning(
                              "Clique novamente para confirmar a exclusão."
                            );
                          }}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          {deletingId === listing.id ? "Confirmar" : "Excluir"}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-6">
            <section className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    Assistente do anunciante
                  </h2>
                  <p className="break-words text-sm text-slate-500">
                    Dicas automáticas para revisar, melhorar ou impulsionar o que está no ar.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {insights.map((insight) => {
                  const toneClasses =
                    insight.tone === "amber"
                      ? "border-amber-200 bg-amber-50"
                      : insight.tone === "emerald"
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-blue-200 bg-blue-50";

                  const buttonClasses =
                    insight.tone === "amber"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : insight.tone === "emerald"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-blue-600 text-white hover:bg-blue-700";

                  return (
                    <div
                      key={insight.id}
                      className={`min-w-0 overflow-hidden rounded-[22px] border p-4 ${toneClasses}`}
                    >
                      <p className="break-words font-semibold text-slate-900">
                        {insight.title}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-700">
                        {insight.description}
                      </p>

                      <div className="mt-3">
                        {insight.durationDays && insight.listingId ? (
                          <Button
                            size="sm"
                            className={`rounded-xl ${buttonClasses}`}
                            onClick={() =>
                              boostMutation.mutate({
                                listingId: insight.listingId!,
                                type: "featured",
                                durationDays: insight.durationDays,
                              })
                            }
                            disabled={boostMutation.isPending}
                          >
                            <Zap className="mr-2 h-4 w-4" />
                            {insight.actionLabel}
                          </Button>
                        ) : insight.listingId ? (
                          <Link
                            href={`/anunciante/editar/${insight.listingId}`}
                            className="block w-full sm:w-auto"
                          >
                            <Button
                              size="sm"
                              className={`w-full rounded-xl sm:w-auto ${buttonClasses}`}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              {insight.actionLabel}
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            href="/anunciante"
                            className="block w-full sm:w-auto"
                          >
                            <Button
                              size="sm"
                              className={`w-full rounded-xl sm:w-auto ${buttonClasses}`}
                            >
                              {insight.actionLabel}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Eye className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold text-slate-900">
                    Visão rápida
                  </h2>
                  <p className="break-words text-sm text-slate-500">
                    Um resumo menor do que mais importa para a conta.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Melhor anúncio
                  </p>
                  <p className="mt-2 break-words font-semibold text-slate-900">
                    {topListing?.title || "Sem destaque ainda"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {topListing
                      ? `${topListing.viewCount ?? 0} visualizações e ${topListing.contactCount ?? 0} contatos`
                      : "Assim que houver movimento, o melhor desempenho aparece aqui."}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Recompra
                  </p>
                  <div className="mt-2 space-y-2">
                    {cashbackHighlights.map((rule) => (
                      <div
                        key={rule.slug}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 break-words font-medium text-slate-700">
                          {rule.label}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 font-bold text-emerald-700">
                          {rule.rate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-[28px] bg-gradient-to-r from-blue-700 to-violet-700 p-4 text-white shadow-xl sm:p-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <TrendingUp className="h-6 w-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold">
                    Quer mais visibilidade?
                  </h2>
                  <p className="text-sm text-blue-100">
                    Use Booster para subir seus produtos nas buscas.
                  </p>
                </div>
              </div>

              <Link href="/planos" className="block w-full sm:w-auto">
                <Button className="mt-5 w-full rounded-2xl bg-white text-blue-900 hover:bg-blue-50 sm:w-auto">
                  Ver planos <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
