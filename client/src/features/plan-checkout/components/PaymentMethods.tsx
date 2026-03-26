import { CreditCard } from "lucide-react";

const METHODS = ["Pix", "Cartão (em breve)", "Boleto (em breve)"];

export function PaymentMethods() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700">Forma de pagamento</p>
      <div className="flex flex-wrap gap-3">
        {METHODS.map(method => (
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
  );
}
