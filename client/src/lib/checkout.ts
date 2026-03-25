export type CheckoutType = "plan" | "booster";

type CheckoutParams = {
  type: CheckoutType;
  plan: string;
  cycle?: string;
  listingId?: number | string | null;
  isAuthenticated: boolean;
};

export function getCheckoutUrl({
  type,
  plan,
  cycle,
  listingId,
  isAuthenticated,
}: CheckoutParams): string {
  const planParam = encodeURIComponent(plan);
  const cycleParam = cycle ? `&cycle=${encodeURIComponent(cycle)}` : "";
  const listingParam =
    listingId !== undefined && listingId !== null ? `&listingId=${listingId}` : "";
  const base =
    type === "booster"
      ? `/checkout/booster?plan=${planParam}${listingParam}`
      : `/checkout/plan?plan=${planParam}${cycleParam}`;

  return isAuthenticated ? base : `/login?redirect=${encodeURIComponent(base)}`;
}
