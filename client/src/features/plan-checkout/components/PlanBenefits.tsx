import { Star } from "lucide-react";
import type { PlanDefinition } from "../types";

export function PlanBenefits({ benefits }: { benefits: PlanDefinition["benefits"] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">Benefícios inclusos</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {benefits.map(item => (
          <li key={item} className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Star className="mt-0.5 h-4 w-4 text-orange-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

