import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { PlanBadgeRibbon, PlanHeader } from "./components/PlanHeader";
import { PlanSummary } from "./components/PlanSummary";
import { PlanBenefits } from "./components/PlanBenefits";
import { PaymentMethods } from "./components/PaymentMethods";
import { CheckoutButton } from "./components/CheckoutButton";
import { CheckoutStatusCard } from "./components/CheckoutStatus";
import { PlanBenefitsAside } from "./components/PlanBenefitsAside";
import { PLAN_MAP, parseBillingCycle, parsePlanSlug } from "./utils";
import type { BillingCycle, CheckoutStatus, PlanSlug } from "./types";

export default function PlanCheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, [location]);

  const selectedPlan: PlanSlug = parsePlanSlug(params.get("plan"));
  const selectedCycle: BillingCycle = parseBillingCycle(params.get("cycle"));
  const cycleQuery = selectedCycle === "yearly" ? "annual" : "monthly";

  const plan = PLAN_MAP[selectedPlan];
  const pricing = plan.pricing[selectedCycle];

  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrder = trpc.advertiser.createPlanOrder.useMutation({
    onSuccess: result => {
      setOrderId(result.id ?? null);
      setStatus("success");
    },
    onError: error => {
      setErrorMessage(error.message);
      setStatus("error");
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/checkout/plan?plan=${selectedPlan}&cycle=${cycleQuery}`;
      return;
    }
    setStatus("loading");
    setErrorMessage(null);
    createOrder.mutate({ plan: selectedPlan });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_40%,#eef2ff_100%)]">
      <Header />

      <main className="container py-8 sm:py-12">
        <PlanBadgeRibbon />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <PlanHeader plan={plan} selectedCycle={selectedCycle} />

            <CardContent className="space-y-6 pt-4">
              <PlanSummary plan={plan} pricing={pricing} />

              <PlanBenefits benefits={plan.benefits} />

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Dados do assinante</p>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <p>{user?.name ?? "Usuário autenticado"}</p>
                  <p className="text-slate-500">{user?.email ?? "sem email"}</p>
                </div>
              </div>

              <PaymentMethods />

              <CheckoutStatusCard
                status={status}
                errorMessage={errorMessage}
                orderId={orderId}
                onReset={() => setStatus("idle")}
              />

              <CheckoutButton status={status} onSubmit={handleSubmit} />
            </CardContent>
          </Card>

          <PlanBenefitsAside />
        </div>
      </main>

      <Footer />
    </div>
  );
}
