import { CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-react";
import type { PlanDefinition, BillingCycle } from "../types";

export function PlanHeader({ plan, selectedCycle }: { plan: PlanDefinition; selectedCycle: BillingCycle }) {
  return (
    <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-1 text-xs font-bold uppercase text-white">
        <Sparkles className="h-3.5 w-3.5" />
        Plano {plan.name}
      </div>
      <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
      <p className="text-sm text-slate-600">
        {selectedCycle === "yearly"
          ? "Assinatura anual com benefícios exclusivos e boosters incluídos."
          : "Assinatura mensal para entrar com baixo custo e flexibilidade."}
      </p>
    </CardHeader>
  );
}

export function PlanBadgeRibbon() {
  return (
    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
      <Zap className="h-4 w-4" />
      Checkout de planos
    </div>
  );
}
