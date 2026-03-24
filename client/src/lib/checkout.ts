export type CheckoutType = "plan" | "booster";

type CheckoutParams = {
  type: CheckoutType;
  plan: string;
  listingId?: number | string | null;
  isAuthenticated: boolean;
};

export function getCheckoutUrl({
  type,
  plan,
  listingId,
  isAuthenticated,
}: CheckoutParams): string {
  const planParam = encodeURIComponent(plan);
  const listingParam =
    listingId !== undefined && listingId !== null ? `&listingId=${listingId}` : "";
  const base =
    type === "booster"
      ? `/checkout/booster?plan=${planParam}${listingParam}`
      : `/checkout/plan?plan=${planParam}`;

  return isAuthenticated ? base : `/login?redirect=${encodeURIComponent(base)}`;
}
