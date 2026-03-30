import { Button } from "@/components/ui/button";
import { advertiserHref } from "@/lib/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { PILLARS } from "@/features/home/constants";

type Pillar = (typeof PILLARS)[number];

type Props = {
  selectedCityName: string;
  onSearch: (query: string) => void;
  isAuthenticated: boolean;
  pillars: Pillar[];
  stats: {
    listings: number;
    companies: number;
    services: number;
    food: number;
  };
};

export function HeroDesktop({ selectedCityName, onSearch, isAuthenticated, pillars, stats }: Props) {
  return (
    <section className="container pt-3 sm:pt-6">
      <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#f97316_130%)] px-5 py-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Guia local + marketplace + lojas online
              </div>

              <h1 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-5xl">
                Tudo da sua cidade em um só lugar.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/90 sm:text-lg">
                Encontre empresas, serviços e produtos da sua região ou crie sua loja online e comece a aparecer para novos clientes em
                <span className="font-bold text-white"> {selectedCityName}</span>.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="h-12 rounded-2xl bg-white px-6 text-slate-900 hover:bg-slate-100" onClick={() => onSearch("")}>
                  <ArrowRight className="mr-2 h-5 w-5" aria-hidden="true" />
                  Explorar agora
                </Button>

                <Link href={advertiserHref("/anunciante/novo", isAuthenticated)}>
                  <Button className="h-12 rounded-2xl bg-orange-500 px-6 text-white hover:bg-orange-600">
                    <ArrowRight className="mr-2 h-5 w-5" aria-hidden="true" />
                    Criar minha loja
                  </Button>
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-4">
                <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stats.listings}</p>
                  <p className="text-sm text-blue-100">Anúncios ativos</p>
                </div>
                <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stats.companies}</p>
                  <p className="text-sm text-blue-100">Lojas visíveis</p>
                </div>
                <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stats.services}</p>
                  <p className="text-sm text-blue-100">Serviços</p>
                </div>
                <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white">{stats.food}</p>
                  <p className="text-sm text-blue-100">Lojas abertas</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
                Como usar o Norte Vivo
              </p>

              <div className="mt-4 space-y-3">
                {pillars.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-[24px] border p-4 transition ${item.tone}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-black/10 p-3 text-lg">{item.emoji}</div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                          {item.badge}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold">{item.label}</h3>
                        <p className="mt-1 text-sm leading-6 opacity-90">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] bg-white/10 p-4">
                <p className="text-base font-semibold text-white">Tem uma loja e ainda não tem site?</p>
                <p className="mt-1 text-sm leading-6 text-blue-50/90">
                  Crie sua vitrine, publique seus produtos e receba contatos pelo WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

