import { Button } from "@/components/ui/button";
import { advertiserHref } from "@/lib/navigation";
import { Store, Zap } from "lucide-react";
import { Link } from "wouter";

type Props = {
  isAuthenticated: boolean;
};

export function SellerCtaSection({ isAuthenticated }: Props) {
  return (
    <section className="container pb-14">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">Para quem vende</p>

            <h2 className="mt-3 font-display text-3xl font-black">Sua loja pode aparecer para toda a região, mesmo sem ter site.</h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Cadastre produtos, serviços, contatos, horário de funcionamento e impulsione o que você quer vender com mais destaque dentro da plataforma.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={advertiserHref("/anunciante/novo", isAuthenticated)}>
              <Button className="h-12 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                <Store className="mr-2 h-4 w-4" />
                Criar anúncio
              </Button>
            </Link>

            <Link href="/planos">
              <Button className="h-12 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                <Zap className="mr-2 h-4 w-4" />
                Ver planos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
