import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import type { CheckoutStatus } from "../types";

export function CheckoutStatusCard({ status, errorMessage, orderId, onReset }: {
  status: CheckoutStatus;
  errorMessage: string | null;
  orderId: number | null;
  onReset: () => void;
}) {
  if (status === "success") {
    return (
      <Card className="rounded-3xl border-green-200 bg-green-50/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            Pagamento em processamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-green-800">
          <p>Seu pedido foi criado com status pending.</p>
          {orderId ? <p>ID do pedido: #{orderId}</p> : null}
          <p>Assim que o pagamento for confirmado, seu plano será ativado.</p>
          <div className="pt-2">
            <Link href="/anunciante?tab=meus-dados">
              <Button className="rounded-xl bg-green-600 text-white hover:bg-green-700">Ir para o painel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="rounded-3xl border-red-200 bg-red-50/60">
        <CardHeader>
          <CardTitle className="text-red-800">Não foi possível criar o pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-red-700">
          <p>{errorMessage ?? "Tente novamente em instantes."}</p>
          <Button variant="outline" className="rounded-xl" onClick={onReset}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
