import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function PlanBenefitsAside() {
  return (
    <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          Segurança e suporte
        </CardTitle>
        <p className="text-sm text-slate-600">
          Assinatura gerenciada dentro do Norte Vivo. Pagamento confirmado manualmente enquanto o gateway não é integrado.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 text-sm text-slate-700">
        <p className="rounded-2xl bg-slate-50 px-4 py-3">
          Assim que o pagamento for validado, seu plano será ativado e você receberá a confirmação no painel.
        </p>
        <p className="rounded-2xl bg-slate-50 px-4 py-3">
          Dúvidas? Fale com o suporte e informe o ID do pedido para agilizar.
        </p>
      </CardContent>
    </Card>
  );
}

