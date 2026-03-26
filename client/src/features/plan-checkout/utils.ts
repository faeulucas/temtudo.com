import type { BillingCycle, PlanDefinition, PlanSlug } from "./types";

export const PLAN_MAP: Record<PlanSlug, PlanDefinition> = {
  profissional: {
    name: "Plano Profissional",
    accent: "from-blue-600 to-cyan-500",
    benefits: [
      "15 anúncios ativos",
      "8 fotos por anúncio",
      "12 boosters de 24h por ano",
      "Prioridade na busca",
      "Suporte prioritário",
    ],
    badge: "Mais acessível",
    pricing: {
      monthly: { amount: 9.9, periodLabel: "/mês" },
      yearly: {
        amount: 99.9,
        periodLabel: "/ano",
        note: "equivale a R$ 8,33/mês",
        savings: "economize R$ 18,90",
      },
    },
  },
  premium: {
    name: "Plano Premium",
    accent: "from-amber-500 to-orange-500",
    benefits: [
      "Anúncios ilimitados",
      "20 fotos por anúncio",
      "24 boosters de 24h por ano",
      "Destaque garantido na home",
      "Suporte VIP",
    ],
    badge: "Mais vantagem",
    pricing: {
      monthly: { amount: 14.9, periodLabel: "/mês" },
      yearly: {
        amount: 129.9,
        periodLabel: "/ano",
        note: "equivale a R$ 10,83/mês",
        savings: "economize R$ 48,90",
      },
    },
  },
};

export function parsePlanSlug(planParam: string | null | undefined): PlanSlug {
  return planParam === "premium" || planParam === "profissional" ? planParam : "profissional";
}

export function parseBillingCycle(cycleParam: string | null | undefined): BillingCycle {
  const normalized = (cycleParam ?? "yearly").toLowerCase();
  if (normalized === "annual") return "yearly";
  return normalized === "monthly" ? "monthly" : "yearly";
}

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
