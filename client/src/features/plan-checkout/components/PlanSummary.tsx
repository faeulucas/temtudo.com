import { Separator } from "@/components/ui/separator";
import type { PlanDefinition, PlanPricing } from "../types";
import { formatBRL } from "../utils";

export function PlanSummary({ plan, pricing }: { plan: PlanDefinition; pricing: PlanPricing }) {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900">{formatBRL(pricing.amount)}</span>
        <span className="text-sm text-slate-500">{pricing.periodLabel}</span>
        {plan.badge && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{plan.badge}</span>
        )}
        {pricing.savings && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{pricing.savings}</span>
        )}
      </div>

      {pricing.note && <p className="text-sm text-slate-600">{pricing.note}</p>}

      <Separator />
    </div>
  );
}
