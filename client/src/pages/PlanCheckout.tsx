import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, CreditCard, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";

type PlanSlug = "profissional" | "premium";
type BillingCycle = "monthly" | "yearly";

const PLAN_MAP: Record<
  PlanSlug,
  {
    name: string;
    benefits: string[];
    accent: string;
    badge?: string;
    pricing: Record<
      BillingCycle,
      { amount: number; periodLabel: string; note?: string; savings?: string; badge?: string }
    >;
  }
> = {
  profissional: {
    name: "Plano Profissional",
    accent: "from-blue-600 to-cyan-500",
    benefits: [
      "15 an\u00fAncios ativos",
      "8 fotos por an\u00fAncio",
      "12 boosters de 24h por ano",
      "Prioridade na busca",
      "Suporte priorit\u00e1rio",
    ],
    badge: "Mais acess\u00edvel",
    pricing: {
      monthly: { amount: 9.9, periodLabel: "/m\u00eas" },
      yearly: {
        amount: 99.9,
        periodLabel: "/ano",
        note: "equivale a R$ 8,33/m\u00eas",
        savings: "economize R$ 18,90",
      },
    },
  },
  premium: {
    name: "Plano Premium",
    accent: "from-amber-500 to-orange-500",
    benefits: [
      "An\u00fAncios ilimitados",
      "20 fotos por an\u00fAncio",
      "24 boosters de 24h por ano",
      "Destaque garantido na home",
      "Suporte VIP",
    ],
    badge: "Mais vantagem",
    pricing: {
      monthly: { amount: 14.9, periodLabel: "/m\u00eas" },
      yearly: {
        amount: 129.9,
        periodLabel: "/ano",
        note: "equivale a R$ 10,83/m\u00eas",
        savings: "economize R$ 48,90",
      },
    },
  },
};

type CheckoutStatus = "idle" | "loading" | "success" | "error";

export default function PlanCheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const urlPlan = params.get("plan");
  const selectedPlan: PlanSlug =
    urlPlan === "premium" || urlPlan === "profissional" ? urlPlan : "profissional";

  const cycleParamRaw = (params.get("cycle") ?? "yearly").toLowerCase();
  const normalizedCycle = cycleParamRaw === "annual" ? "yearly" : cycleParamRaw;
  const selectedCycle: BillingCycle = normalizedCycle === "monthly" ? "monthly" : "yearly";
  const cycleQuery = selectedCycle === "yearly" ? "annual" : "monthly";

  const plan = PLAN_MAP[selectedPlan];
  const pricing = plan.pricing[selectedCycle];

  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrder = trpc.advertiser.createPlanOrder.useMutation({
    onSuccess: result => {
      setOrderId(result.id ?? null);
      setStatus("success");
    },
    onError: error => {
      setErrorMessage(error.message);
      setStatus("error");
    },
  });

  const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const handleSubmit = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/checkout/plan?plan=${selectedPlan}&cycle=${cycleQuery}`;
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    createOrder.mutate({ plan: selectedPlan });
  };

  const renderStatus = () => {
    if (status === "success") {
      return (
        <Card className="rounded-3xl border-green-200 bg-green-50/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Pagamento em processamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-green-800">
            <p>Seu pedido foi criado com status pending.</p>
            {orderId ? <p>ID do pedido: #{orderId}</p> : null}
            <p>Assim que o pagamento for confirmado, seu plano ser\u00e1 ativado.</p>
            <div className="pt-2">
              <Link href="/anunciante?tab=meus-dados">
                <Button className="rounded-xl bg-green-600 text-white hover:bg-green-700">
                  Ir para o painel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (status === "error") {
      return (
        <Card className="rounded-3xl border-red-200 bg-red-50/60">
          <CardHeader>
            <CardTitle className="text-red-800">N\u00e3o foi poss\u00edvel criar o pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-red-700">
            <p>{errorMessage ?? "Tente novamente em instantes."}</p>
            <Button variant="outline" className="rounded-xl" onClick={() => setStatus("idle")}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_40%,#eef2ff_100%)]">
      <Header />

      <main className="container py-8 sm:py-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
          <Zap className="h-4 w-4" />
          Checkout de planos
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-bold uppercase text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Plano {plan.name}
              </div>
              <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
              <p className="text-sm text-slate-600">
                {selectedCycle === "yearly"
                  ? "Assinatura anual com benef\u00edcios exclusivos e boosters inclu\u00eddos."
                  : "Assinatura mensal para entrar com baixo custo e flexibilidade."}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">
                  {formatBRL(pricing.amount)}
                </span>
                <span className="text-sm text-slate-500">{pricing.periodLabel}</span>
                {plan.badge && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {plan.badge}
                  </span>
                )}
                {pricing.savings && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {pricing.savings}
                  </span>
                )}
              </div>

              {pricing.note && <p className="text-sm text-slate-600">{pricing.note}</p>}

              <div>
                <p className="text-sm font-semibold text-slate-700">Benef\u00edcios inclusos</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {plan.benefits.map(item => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <Star className="mt-0.5 h-4 w-4 text-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Dados do assinante</p>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <p>{user?.name ?? "Usu\u00e1rio autenticado"}</p>
                  <p className="text-slate-500">{user?.email ?? "sem email"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Forma de pagamento</p>
                <div className="flex flex-wrap gap-3">
                  {["Pix", "Cart\u00e3o (em breve)", "Boleto (em breve)"].map(method => (
                    <div
                      key={method}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {renderStatus()}

              {status !== "success" && (
                <Button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-200/60 hover:opacity-90"
                >
                  {status === "loading" ? "Criando pedido..." : "Assinar agora"}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Seguran\u00e7a e suporte
              </CardTitle>
              <p className="text-sm text-slate-600">
                Assinatura gerenciada dentro do Norte Vivo. Pagamento confirmado manualmente
                enquanto o gateway n\u00e3o \u00e9 integrado.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-sm text-slate-700">
              <p className="rounded-2xl bg-slate-50 px-4 py-3">
                Assim que o pagamento for validado, seu plano ser\u00e1 ativado e voc\u00ea receber\u00e1 a
                confirma\u00e7\u00e3o no painel.
              </p>
              <p className="rounded-2xl bg-slate-50 px-4 py-3">
                D\u00favidas? Fale com o suporte e informe o ID do pedido para agilizar.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
