import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Zap, Star, Crown, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_ROUTE } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type BillingCycle = "monthly" | "yearly";

type PlanVariant = {
  price: number;
  period: string;
  note?: string;
  savings?: string;
  featureOverrides?: string[];
};

type PlanDefinition = {
  id: string;
  name: string;
  icon: typeof Zap;
  color: string;
  btnClass: string;
  badges: Partial<Record<BillingCycle, string>>;
  description: string;
  variants: Record<BillingCycle, PlanVariant>;
  features: string[];
  notIncluded: string[];
};

const PLANS: PlanDefinition[] = [
  {
    id: "gratis",
    name: "Grátis",
    icon: Zap,
    color: "border-slate-200",
    btnClass: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    badges: {},
    description: "Plano de entrada para publicar e validar sua presença no portal.",
    variants: {
      monthly: { price: 0, period: "30 dias" },
      yearly: { price: 0, period: "30 dias" },
    },
    features: [
      "5 anúncios ativos",
      "3 fotos por anúncio",
      "Validade de 30 dias",
      "Busca padrão",
      "Suporte básico",
    ],
    notIncluded: ["Booster de destaque", "Destaque na home", "Selo verificado"],
  },
  {
    id: "profissional",
    name: "Profissional",
    icon: Star,
    color: "border-blue-500 ring-2 ring-blue-100",
    btnClass: "bg-brand-gradient text-white hover:opacity-90",
    badges: {
      monthly: "MAIS ACESSÍVEL",
      yearly: "PROMOÇÃO DE LANÇAMENTO",
    },
    description: "Para quem quer manter anúncios ativos o ano inteiro sem pesar.",
    variants: {
      monthly: { price: 9.9, period: "/mês" },
      yearly: {
        price: 99.9,
        period: "/ano",
        note: "equivale a R$ 8,33/mês",
        savings: "economize R$ 18,90",
        featureOverrides: [
          "15 anúncios ativos",
          "8 fotos por anúncio",
          "Validade de 30 dias por anúncio",
          "12 boosters de 24h por ano",
          "Acumula e usa quando quiser",
          "Prioridade na busca",
          "Suporte prioritário",
        ],
      },
    },
    features: [
      "15 anúncios ativos",
      "8 fotos por anúncio",
      "Validade de 30 dias por anúncio",
      "1 booster de 24h por mês",
      "Prioridade na busca",
      "Suporte prioritário",
    ],
    notIncluded: ["Destaque garantido na home", "Selo verificado"],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    color: "border-amber-400 ring-2 ring-amber-100",
    btnClass: "bg-orange-gradient text-white hover:opacity-90",
    badges: {
      monthly: "MELHOR CUSTO-BENEFÍCIO",
      yearly: "MAIS VANTAJOSO",
    },
    description: "O plano para quem quer crescer rápido e aparecer mais.",
    variants: {
      monthly: { price: 14.9, period: "/mês" },
      yearly: {
        price: 129.9,
        period: "/ano",
        note: "equivale a R$ 10,83/mês",
        savings: "economize R$ 48,90",
        featureOverrides: [
          "Anúncios ilimitados",
          "20 fotos por anúncio",
          "Validade de 30 dias por anúncio",
          "24 boosters de 24h por ano",
          "Acumula e usa quando quiser",
          "Destaque garantido na home",
          "Selo de verificado",
          "Suporte VIP",
          "Relatórios avançados",
        ],
      },
    },
    features: [
      "Anúncios ilimitados",
      "20 fotos por anúncio",
      "Validade de 30 dias por anúncio",
      "2 boosters de 24h por mês",
      "Destaque garantido na home",
      "Selo de verificado",
      "Suporte VIP",
      "Relatórios avançados",
    ],
    notIncluded: [],
  },
];

const BOOSTERS = [
  {
    name: "Booster Relâmpago",
    price: 9.9,
    days: 1,
    desc: "Impulsiona seu anúncio por 24 horas",
  },
  {
    name: "Destaque Básico",
    price: 12.9,
    days: 7,
    desc: "Aparece no topo da categoria por 7 dias",
  },
  {
    name: "Destaque Plus",
    price: 24.9,
    days: 15,
    desc: "Destaque na home + topo da categoria por 15 dias",
  },
  {
    name: "Destaque Premium",
    price: 49.9,
    days: 30,
    desc: "Banner na home + destaque máximo por 30 dias",
  },
];

function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function PlansPage() {
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <section className="bg-hero-gradient py-16 text-white">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              Planos para anunciar e crescer no Norte Vivo
            </div>

            <h1 className="mt-4 font-display text-4xl font-black sm:text-5xl">
              Escolha o plano certo para dar mais visibilidade ao seu negócio.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Comece com valores promocionais de lançamento. No anual, o custo por
              mês fica menor e você trava o preço por 12 meses.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-orange-50 p-3 text-orange-600">
              <Zap className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Crescimento
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Mais visibilidade para quem quer vender
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Os planos foram pensados para ajudar anunciantes, lojas e empresas
              locais a ganhar presença real no portal.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Clareza
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Planos fáceis de entender
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Você entra com o grátis, mantém constância com o profissional e
              escala de verdade com o premium.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Star className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Resultado
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Destaque mais forte para quem investe
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Os boosters e os planos pagos aumentam sua chance de clique, contato
              e descoberta dentro da plataforma.
            </p>
          </article>
        </div>
      </section>

      <section className="container pb-6">
        <div className="mx-auto mb-10 flex max-w-sm rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Mensal
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              billingCycle === "yearly"
                ? "bg-brand-gradient text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Anual
          </button>
        </div>

        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {billingCycle === "yearly"
              ? "Melhor conversão para o lançamento"
              : "Entrada fácil para testar"}
          </p>

          <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
            {billingCycle === "yearly"
              ? "Pague menos no ano e fortaleça sua presença local"
              : "Mensal para entrar, anual para escalar"}
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const IconComp = plan.icon;
            const variant = plan.variants[billingCycle];
            const badge = plan.badges[billingCycle];
            const isPremium = plan.id === "premium";
            const visibleFeatures = variant.featureOverrides ?? plan.features;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[28px] border-2 bg-white p-8 shadow-sm ${plan.color}`}
              >
                {badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-black ${
                        isPremium
                          ? "bg-amber-400 text-slate-900"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {badge}
                    </span>
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isPremium
                        ? "bg-orange-gradient"
                        : plan.id === "profissional"
                        ? "bg-brand-gradient"
                        : "bg-slate-100"
                    }`}
                  >
                    <IconComp
                      className={`h-5 w-5 ${
                        plan.id !== "gratis" ? "text-white" : "text-slate-600"
                      }`}
                    />
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                </div>

                <p className="mb-5 text-sm text-slate-500">{plan.description}</p>

                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">
                    {variant.price === 0 ? "Grátis" : formatPrice(variant.price)}
                  </span>
                  {variant.price > 0 && (
                    <span className="text-sm text-slate-500">{variant.period}</span>
                  )}
                </div>

                {variant.note && (
                  <p className="text-sm font-medium text-slate-500">{variant.note}</p>
                )}

                {variant.savings && (
                  <p className="mt-1 text-sm font-bold text-green-600">
                    {variant.savings}
                  </p>
                )}

                <ul className="mb-6 mt-6 space-y-3">
                  {visibleFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}

                  {plan.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-400 line-through"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={isAuthenticated ? "/anunciante" : LOGIN_ROUTE}>
                  <Button
                    className={`w-full rounded-xl py-5 text-base font-bold ${plan.btnClass}`}
                  >
                    {variant.price === 0 ? "Começar grátis" : "Assinar agora"}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-14">
        <div className="container">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-700">
              <Zap className="h-4 w-4" /> BOOSTER - turbine seu anúncio
            </div>

            <h2 className="mb-3 font-display text-3xl font-black text-slate-900">
              Destaque seu anúncio e venda mais rápido
            </h2>

            <p className="mx-auto max-w-xl text-slate-500">
              Mesmo com um plano acessível, você ainda pode impulsionar anúncios
              específicos quando quiser mais alcance.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {BOOSTERS.map((booster) => (
              <div
                key={booster.name}
                className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-gradient">
                  <Zap className="h-5 w-5 text-white" />
                </div>

                <h3 className="mb-1 font-display text-lg font-bold text-slate-900">
                  {booster.name}
                </h3>

                <p className="mb-4 text-sm text-slate-600">{booster.desc}</p>

                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">
                    {formatPrice(booster.price)}
                  </span>
                  <span className="text-sm text-slate-500">
                    /{booster.days} dias
                  </span>
                </div>

                <Link href={isAuthenticated ? "/anunciante" : LOGIN_ROUTE}>
                  <Button className="w-full rounded-xl bg-orange-gradient font-bold text-white hover:opacity-90">
                    Ativar booster
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
                Quer começar agora?
              </p>

              <h2 className="mt-3 font-display text-3xl font-black">
                Escolha seu plano e aumente sua presença dentro do Norte Vivo.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                Entre no grátis para testar, vá para o profissional para manter
                constância e use o premium quando quiser aparecer mais e vender
                com mais força.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={isAuthenticated ? "/anunciante" : LOGIN_ROUTE}>
                <Button className="h-12 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                  Começar agora
                </Button>
              </Link>

              <Link href="/booster">
                <Button className="h-12 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                  Ver boosters
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
