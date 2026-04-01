import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PILLARS } from "@/features/home/constants";
import { SectionHeader } from "./SectionHeader";

type Pillar = (typeof PILLARS)[number];

type Props = {
  pillars: Pillar[];
};

export function ThreeWaysSection({ pillars }: Props) {
  return (
    <section className="container py-8 sm:py-10">
      <SectionHeader
        eyebrow="3 formas de usar"
        title="Escolha a melhor porta de entrada para o que você precisa"
        description="A Home agora guia melhor o usuário: primeiro ele entende o produto, depois escolhe como navegar dentro da plataforma."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {pillars.map((item) => {
          const isDark = item.label === "Marketplace Regional" || item.label === "Crie sua Loja";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-[28px] border p-6 shadow-sm transition hover:-translate-y-1 ${
                isDark
                  ? item.label === "Marketplace Regional"
                    ? "border-orange-200 bg-orange-500 text-white"
                    : "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-black/10 p-3 text-xl">
                  {item.icon ? <item.icon className="h-5 w-5" aria-hidden="true" /> : item.emoji}
                </div>
                <span className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
                  {item.badge}
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-black">{item.label}</h3>

              <p className={`mt-3 text-sm leading-7 ${isDark ? "text-white/85" : "text-slate-500"}`}>
                {item.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                Entrar
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

