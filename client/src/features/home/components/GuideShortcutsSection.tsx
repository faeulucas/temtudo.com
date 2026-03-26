import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { CategoryIcon } from "./CategoryIcon";
import { SectionHeader } from "./SectionHeader";
import type { GUIDE_SHORTCUTS } from "@/features/home/constants";

type Shortcut = (typeof GUIDE_SHORTCUTS)[number];

type Props = {
  shortcuts: Shortcut[];
  selectedCityName: string;
};

export function GuideShortcutsSection({ shortcuts, selectedCityName }: Props) {
  return (
    <section id="guia-local" className="container py-8 sm:py-10">
      <SectionHeader
        eyebrow="Guia local"
        title={`Serviços e contatos essenciais em ${selectedCityName}`}
        description="O guia precisa ser útil de verdade. Ele deve resolver rápido a busca por telefones, empresas e contatos da cidade."
        actionHref="/guia"
        actionLabel="Abrir guia local"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 sm:rounded-[28px]"
          >
            <div className={`inline-flex rounded-2xl p-3 ${item.tone}`}>
              <CategoryIcon image={item.image} fallbackImage={item.fallbackImage} emoji={item.emoji ?? "?"} alt={item.title} />
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">{item.title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>

            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
              Explorar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
