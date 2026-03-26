export type PlanSlug = "profissional" | "premium";
export type BillingCycle = "monthly" | "yearly";
export type CheckoutStatus = "idle" | "loading" | "success" | "error";

export type PlanPricing = {
  amount: number;
  periodLabel: string;
  note?: string;
  savings?: string;
  badge?: string;
};

export type PlanDefinition = {
  name: string;
  benefits: string[];
  accent: string;
  badge?: string;
  pricing: Record<BillingCycle, PlanPricing>;
};
