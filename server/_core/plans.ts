import type { User } from "../../drizzle/schema";

export type PlanSlug = "free" | "profissional" | "premium";

export type PlanRules = {
  label: string;
  durationDays: number;
  maxActiveListings: number | null;
  maxImagesPerListing: number;
  includedBoostersPerYear: number;
  searchPriority: number;
  verifiedBadge: boolean;
  advancedFeatures: {
    analytics: boolean;
    highlightedHome: boolean;
    prioritySupport: "basic" | "priority" | "vip";
  };
};

export const PLAN_RULES: Record<PlanSlug, PlanRules> = {
  free: {
    label: "Grátis",
    durationDays: 365,
    maxActiveListings: 5,
    maxImagesPerListing: 3,
    includedBoostersPerYear: 0,
    searchPriority: 0,
    verifiedBadge: false,
    advancedFeatures: {
      analytics: false,
      highlightedHome: false,
      prioritySupport: "basic",
    },
  },
  profissional: {
    label: "Profissional",
    durationDays: 365,
    maxActiveListings: 15,
    maxImagesPerListing: 8,
    includedBoostersPerYear: 12,
    searchPriority: 1,
    verifiedBadge: false,
    advancedFeatures: {
      analytics: true,
      highlightedHome: false,
      prioritySupport: "priority",
    },
  },
  premium: {
    label: "Premium",
    durationDays: 365,
    maxActiveListings: null, // ilimitado
    maxImagesPerListing: 20,
    includedBoostersPerYear: 24,
    searchPriority: 2,
    verifiedBadge: true,
    advancedFeatures: {
      analytics: true,
      highlightedHome: true,
      prioritySupport: "vip",
    },
  },
};

export function addDays(base: Date, days: number) {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addYears(base: Date, years = 1) {
  const copy = new Date(base);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

export function resolveUserPlan(user: Pick<User, "plan" | "planActive" | "planExpiresAt">): PlanSlug {
  const candidate = (user.plan ?? "free") as PlanSlug;
  const now = new Date();
  if (!user.planActive || !user.planExpiresAt || user.planExpiresAt <= now) {
    return "free";
  }
  return PLAN_RULES[candidate] ? candidate : "free";
}

export function isUserFree(user: Pick<User, "plan" | "planActive" | "planExpiresAt">) {
  return resolveUserPlan(user) === "free";
}

export function isUserProfessional(user: Pick<User, "plan" | "planActive" | "planExpiresAt">) {
  return resolveUserPlan(user) === "profissional";
}

export function isUserPremium(user: Pick<User, "plan" | "planActive" | "planExpiresAt">) {
  return resolveUserPlan(user) === "premium";
}

export function getPlanRulesForUser(user: Pick<User, "plan" | "planActive" | "planExpiresAt">) {
  const plan = resolveUserPlan(user);
  return { plan, rules: PLAN_RULES[plan] };
}

export function shouldResetBoosterQuota(
  user: Pick<User, "planBoosterQuotaResetsAt" | "planBoosterQuotaUsed">,
  now = new Date()
) {
  return !user.planBoosterQuotaResetsAt || user.planBoosterQuotaResetsAt <= now;
}

export function computeBoosterAllowance(
  user: Pick<
    User,
    "plan" | "planActive" | "planExpiresAt" | "planBoosterQuotaUsed" | "planBoosterQuotaResetsAt"
  >,
  now = new Date()
) {
  const { plan, rules } = getPlanRulesForUser(user);
  const shouldReset = shouldResetBoosterQuota(user, now);
  const used = shouldReset ? 0 : user.planBoosterQuotaUsed ?? 0;
  const remaining = Math.max(rules.includedBoostersPerYear - used, 0);
  const nextReset = shouldReset
    ? addYears(now, 1)
    : user.planBoosterQuotaResetsAt ?? addYears(now, 1);

  return { plan, rules, used, remaining, nextReset };
}
