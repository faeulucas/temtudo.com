import { Button } from "@/components/ui/button";
import type { CheckoutStatus } from "../types";

export function CheckoutButton({ status, onSubmit }: { status: CheckoutStatus; onSubmit: () => void }) {
  if (status === "success") return null;

  return (
    <Button
      onClick={onSubmit}
      disabled={status === "loading"}
      className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-200/60 hover:opacity-90"
    >
      {status === "loading" ? "Criando pedido..." : "Assinar agora"}
    </Button>
  );
}
