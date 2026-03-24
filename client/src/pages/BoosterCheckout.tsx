import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  ImageIcon,
  MapPin,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";

import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

type PlanSlug = "relampago" | "basico" | "plus" | "premium";

type BoosterPlan = {
  slug: PlanSlug;
  name: string;
  price: number;
  duration: string;
  description: string;
  benefits: string[];
  accent: string;
  badge?: string;
};

type PaymentMethod = "pix" | "card" | "future";
type CheckoutStatus = "idle" | "loading" | "success" | "error";

type SelectedListing = {
  title: string;
  category?: string;
  city?: string;
  image?: string | null;
};

const BOOSTER_PLANS: BoosterPlan[] = [
  {
    slug: "relampago",
    name: "Booster Relâmpago",
    price: 9.9,
    duration: "24 horas",
    description: "Impulsiona seu anúncio rapidamente para aparecer no topo por um dia.",
    benefits: ["Topo da categoria por 24h", "Selo de destaque no anúncio", "Ativação imediata após o pagamento", "Reforço nas buscas"],
    accent: "from-orange-500 to-amber-400",
    badge: "Rápido",
  },
  {
    slug: "basico",
    name: "Destaque Básico",
    price: 12.9,
    duration: "7 dias",
    description: "Mantém seu anúncio visível durante toda a semana.",
    benefits: ["Topo da categoria por 7 dias", "Badge de confiança", "Alcance orgânico reforçado", "Relatório simples de views"],
    accent: "from-amber-500 to-orange-500",
  },
  {
    slug: "plus",
    name: "Destaque Plus",
    price: 24.9,
    duration: "15 dias",
    description: "Home + categoria por mais tempo com prioridade nas buscas.",
    benefits: ["Destaque na home + categoria", "Prioridade nas buscas", "Relatório quinzenal", "Suporte preferencial"],
    accent: "from-orange-600 to-red-500",
    badge: "Mais vendido",
  },
  {
    slug: "premium",
    name: "Destaque Premium",
    price: 49.9,
    duration: "30 dias",
    description: "Banner na home e topo absoluto por um mês inteiro.",
    benefits: ["Banner na home + topo absoluto", "Selo premium em todas as listagens", "Relatórios semanais", "Suporte VIP"],
    accent: "from-amber-400 to-orange-600",
    badge: "Máximo alcance",
  },
];

const PLAN_MAP = BOOSTER_PLANS.reduce<Record<PlanSlug, BoosterPlan>>((acc, plan) => {
  acc[plan.slug] = plan;
  return acc;
}, {} as Record<PlanSlug, BoosterPlan>);

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function StatusScreen({
  variant,
  plan,
  listing,
  orderId,
  onBack,
}: {
  variant: "success" | "error" | "loading";
  plan: BoosterPlan;
  listing: SelectedListing;
  orderId?: number | null;
  onBack: () => void;
}) {
  const variants = {
    success: {
      title: "Pagamento confirmado",
      desc: "Seu booster será ativado automaticamente em poucos segundos.",
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
      actions: (
        <>
          <Link href="/anunciante">
            <Button className="w-full rounded-xl bg-brand-gradient text-white hover:opacity-90">Ver meus anúncios</Button>
          </Link>
          <Link href="/booster">
            <Button variant="outline" className="w-full rounded-xl">
              Voltar para boosters
            </Button>
          </Link>
        </>
      ),
    },
    error: {
      title: "Não foi possível concluir",
      desc: "Revise os dados ou tente outro método de pagamento. Nenhuma cobrança foi feita.",
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      actions: (
        <>
          <Button className="w-full rounded-xl bg-orange-gradient text-white hover:opacity-90" onClick={onBack}>
            Tentar novamente
          </Button>
          <Link href="/booster">
            <Button variant="outline" className="w-full rounded-xl">
              Falar com suporte
            </Button>
          </Link>
        </>
      ),
    },
    loading: {
      title: "Processando pagamento",
      desc: "Estamos confirmando sua transação com o emissor. Isso costuma levar menos de 30 segundos.",
      icon: <Spinner className="h-12 w-12 text-orange-500" />,
      actions: (
        <Button variant="outline" className="w-full rounded-xl" onClick={onBack}>
          Cancelar e voltar
        </Button>
      ),
    },
  } as const;

  const current = variants[variant];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_40%,#eef2ff_100%)]">
      <Header />

      <main className="container py-12">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50">{current.icon}</div>

          <h1 className="mt-6 font-display text-3xl font-black text-slate-900">{current.title}</h1>
          <p className="mt-3 text-slate-500">{current.desc}</p>
          {orderId && (
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Pedido #{orderId} registrado como {plan.name}.
            </p>
          )}

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-600">Resumo do pedido</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-slate-900">{plan.name}</p>
                  <p className="text-sm text-slate-500">{plan.duration}</p>
                </div>
                <p className="text-lg font-black text-slate-900">{formatBRL(plan.price)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left">
              <p className="text-sm font-semibold text-slate-600">Anúncio</p>
              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {listing.image ? (
                    <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {listing.category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <Tag className="h-3.5 w-3.5" />
                        {listing.category}
                      </span>
                    )}
                    {listing.city && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3">{current.actions}</div>

          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o checkout
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BoosterCheckoutPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const searchParams = useMemo(() => new URLSearchParams(location.split("?")[1] ?? ""), [location]);

  const planFromQuery = useMemo<PlanSlug>(() => {
    const value = searchParams.get("plan") as PlanSlug | null;
    return value && PLAN_MAP[value] ? value : "relampago";
  }, [searchParams]);

  const listingIdParam = searchParams.get("listingId");
  const listingId = listingIdParam ? Number(listingIdParam) : null;

  const listingFromQuery = useMemo<SelectedListing>(() => {
    return {
      title: searchParams.get("listingTitle") ?? "Seu anúncio selecionado",
      category: searchParams.get("listingCategory") ?? undefined,
      city: searchParams.get("listingCity") ?? undefined,
      image: searchParams.get("listingImage") ?? null,
    };
  }, [searchParams]);

  const statusFromQuery = useMemo<CheckoutStatus>(() => {
    const query = location.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    const value = params.get("status");
    if (value === "success" || value === "error") return value;
    if (value === "processing" || value === "pending" || value === "loading") return "loading";
    return "idle";
  }, [location]);

  useEffect(() => {
    if (statusFromQuery !== "idle") {
      setStatus(statusFromQuery);
    }
  }, [statusFromQuery]);

  const { data: listingData, isLoading: listingLoading } = trpc.public.listingById.useQuery(
    { id: Number(listingId) },
    { enabled: Boolean(listingId) }
  );

  const { data: categories } = trpc.public.categories.useQuery();
  const { data: cities } = trpc.public.cities.useQuery();

  const [selectedPlan, setSelectedPlan] = useState<PlanSlug>(planFromQuery);
  const [selectedListing, setSelectedListing] = useState<SelectedListing>(listingFromQuery);

  useEffect(() => {
    setSelectedPlan(planFromQuery);
  }, [planFromQuery]);

  useEffect(() => {
    setSelectedListing(listingFromQuery);
  }, [listingFromQuery]);

  const listingFromApi = useMemo<SelectedListing | null>(() => {
    if (!listingData) return null;
    const categoryName = categories?.find((c) => c.id === listingData.categoryId)?.name;
    const cityName = cities?.find((c) => c.id === listingData.cityId)?.name;
    const firstImage = listingData.images?.[0]?.url ?? null;
    return {
      title: listingData.title,
      category: categoryName ?? undefined,
      city: cityName ?? undefined,
      image: firstImage,
    };
  }, [categories, cities, listingData]);

  const finalListing: SelectedListing | null = listingFromApi ?? (listingId ? null : selectedListing);

  const [customer, setCustomer] = useState(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: (user as { whatsapp?: string; phone?: string } | null)?.whatsapp ?? (user as { phone?: string } | null)?.phone ?? "",
    document: "",
  }));

  useEffect(() => {
    setCustomer((prev) => ({
      ...prev,
      name: user?.name ?? prev.name,
      email: user?.email ?? prev.email,
      phone:
        (user as { whatsapp?: string; phone?: string } | null)?.whatsapp ??
        (user as { phone?: string } | null)?.phone ??
        prev.phone,
    }));
  }, [user]);

  const plan = PLAN_MAP[selectedPlan];
  const total = plan.price;

  const createOrder = trpc.advertiser.createBoosterOrder.useMutation({
    onSuccess: (data) => {
      setOrderId(data.id || null);
      setStatus("success");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Não foi possível criar o pedido.");
      setStatus("error");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage("Faça login para finalizar o booster.");
      setStatus("error");
      return;
    }

    if (!listingId) {
      setErrorMessage("Escolha um anúncio para aplicar o booster.");
      setStatus("error");
      return;
    }

    if (!customer.name || !customer.email || !customer.phone) {
      setErrorMessage("Preencha nome, e-mail e telefone para continuar.");
      setStatus("error");
      return;
    }

    setErrorMessage("");
    setStatus("loading");

    createOrder.mutate({ listingId, plan: selectedPlan });
  };

  if (status === "loading") {
    return (
      <StatusScreen
        variant="loading"
        plan={plan}
        listing={finalListing ?? listingFromQuery}
        orderId={orderId}
        onBack={() => setStatus("idle")}
      />
    );
  }

  if (status === "success") {
    return (
      <StatusScreen
        variant="success"
        plan={plan}
        listing={finalListing ?? listingFromQuery}
        orderId={orderId}
        onBack={() => setStatus("idle")}
      />
    );
  }

  if (status === "error") {
    return (
      <StatusScreen
        variant="error"
        plan={plan}
        listing={finalListing ?? listingFromQuery}
        orderId={orderId}
        onBack={() => setStatus("idle")}
      />
    );
  }

  if (listingId && listingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_35%,#fff7ed_100%)]">
        <Spinner className="h-10 w-10 text-orange-500" />
      </div>
    );
  }

  if (listingId && !listingLoading && !listingFromApi) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_35%,#fff7ed_100%)]">
        <Header />
        <main className="container py-12">
          <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-black text-slate-900">Anúncio não encontrado</h1>
            <p className="mt-2 text-slate-600">
              Não conseguimos carregar o anúncio selecionado. Volte e escolha um anúncio ativo para aplicar o booster.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href="/anunciante">
                <Button className="w-full rounded-xl bg-brand-gradient text-white hover:opacity-90">Ir para meus anúncios</Button>
              </Link>
              <Link href="/booster">
                <Button variant="outline" className="w-full rounded-xl">
                  Voltar para boosters
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_35%,#fff7ed_100%)]">
      <Header />

      <main className="container py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/booster"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm hover:border-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
            <Zap className="h-4 w-4" />
            Checkout do Booster
          </div>
        </div>

        <div className="mb-8 max-w-3xl space-y-2">
          <h1 className="font-display text-3xl font-black text-slate-900">Ative seu booster</h1>
          <p className="text-slate-600">Escolha a forma de pagamento e impulsione seu anúncio.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Plano selecionado</p>
                  <p className="font-display text-2xl font-black text-slate-900">{plan.name}</p>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500">Investimento</p>
                  <p className="text-2xl font-black text-slate-900">{formatBRL(plan.price)}</p>
                  <p className="text-xs text-slate-500">Vigência: {plan.duration}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {BOOSTER_PLANS.map((option) => (
                  <button
                    key={option.slug}
                    type="button"
                    onClick={() => setSelectedPlan(option.slug)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition",
                      selectedPlan === option.slug
                        ? "border-orange-200 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <Zap className={cn("h-4 w-4", selectedPlan === option.slug ? "text-orange-600" : "text-slate-400")} />
                    {option.name}
                    {option.badge && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-bold text-orange-700">
                        {option.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Anúncio selecionado</p>
                  <p className="font-display text-xl font-black text-slate-900">{(finalListing ?? listingFromQuery)?.title}</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="rounded-lg border-slate-200">
                  Trocar anúncio
                </Button>
              </div>
              {!listingId && (
                <p className="mt-2 text-sm font-semibold text-amber-700">
                  Escolha um anúncio na lista para finalizar o booster.
                </p>
              )}

              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {(finalListing ?? listingFromQuery)?.image ? (
                    <img
                      src={(finalListing ?? listingFromQuery)!.image as string}
                      alt={(finalListing ?? listingFromQuery)!.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex flex-wrap gap-2">
                    {(finalListing ?? listingFromQuery)?.category && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        <Tag className="h-3.5 w-3.5" />
                        {(finalListing ?? listingFromQuery)!.category}
                      </span>
                    )}
                    {(finalListing ?? listingFromQuery)?.city && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        <MapPin className="h-3.5 w-3.5" />
                        {(finalListing ?? listingFromQuery)!.city}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">Usaremos este anúncio para aplicar o booster assim que o pagamento for confirmado.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Dados do comprador</p>
                  <p className="font-display text-xl font-black text-slate-900">Só o essencial</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {user ? "Usando dados da conta" : "Login opcional"}
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="contato@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone / WhatsApp</Label>
                  <Input
                    id="phone"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="(xx) xxxxx-xxxx"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">CPF/CNPJ (opcional)</Label>
                  <Input
                    id="document"
                    value={customer.document}
                    onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Pagamento</p>
                  <p className="font-display text-xl font-black text-slate-900">Escolha e pague rápido</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                  Ambiente seguro
                </div>
              </div>

              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)} className="mt-4">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger value="pix" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600">
                    <QrCode className="mr-2 h-4 w-4" />
                    Pix
                  </TabsTrigger>
                  <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="future" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Saldo / carteira
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="mt-5">
                  <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-semibold text-emerald-700">QR Code dinâmico</p>
                      <p className="mt-1 text-sm text-emerald-900/80">
                        Gera automaticamente após confirmar. Validade de 15 minutos e confirmação instantânea.
                      </p>
                      <div className="mt-4 flex h-36 items-center justify-center rounded-xl bg-white text-slate-400">
                        <QrCode className="h-12 w-12" />
                      </div>
                    </div>
                    <div className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4">
                      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                        <Smartphone className="h-4 w-4" />
                        Copie o código Pix ou escaneie pelo app do banco.
                      </div>
                      <p className="text-sm text-slate-600">
                        Assim que o pagamento for identificado, o booster é ativado e você recebe a confirmação por e-mail e WhatsApp.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="mt-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Número do cartão</Label>
                      <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Nome impresso</Label>
                      <Input id="card-name" placeholder="Como está no cartão" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-exp">Validade</Label>
                      <Input id="card-exp" placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input id="card-cvv" placeholder="***" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Layout pronto para integrar gateway real. Não salvamos os dados nesta etapa.</p>
                </TabsContent>

                <TabsContent value="future" className="mt-5">
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    Espaço reservado para saldo/carteira ou boleto. Mantemos o visual pronto para conectar assim que o método for liberado.
                  </div>
                </TabsContent>
              </Tabs>

              {errorMessage && (
                <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4 text-orange-500" />
                  Confirmação média: <strong className="text-slate-700">Pix em segundos</strong>; cartão em até 5 min.
                </div>
                <Button
                  type="submit"
                  className="rounded-xl bg-brand-gradient px-6 py-5 text-base font-bold text-white hover:opacity-90"
                >
                  Pagar e ativar booster
                </Button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Resumo da compra</p>
                  <p className="font-display text-xl font-black text-slate-900">{plan.name}</p>
                  <p className="text-sm text-slate-500">{plan.duration}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <ul className="space-y-2 text-sm text-slate-600">
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-orange-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Total</span>
                <span className="text-lg font-black text-slate-900">{formatBRL(total)}</span>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full rounded-xl bg-brand-gradient py-3 text-base font-bold text-white hover:opacity-90"
              >
                Pagar e ativar booster
              </Button>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Benefícios imediatos</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-700">1</span>
                  Mais visibilidade e selo de destaque
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-700">2</span>
                  Prioridade na categoria e home
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-700">3</span>
                  Ativação imediata após pagamento
                </div>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
