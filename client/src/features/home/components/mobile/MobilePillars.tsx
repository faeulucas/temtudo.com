import { Link } from "wouter";
import type { PILLARS } from "@/features/home/constants";

type Pillar = (typeof PILLARS)[number];

type Props = {
  pillars: Pillar[];
};

export function MobilePillars({ pillars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {pillars.map((item) => (
        <Link
          key={`mobile-${item.label}`}
          href={item.href}
          className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white px-3 py-2 text-xl shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
              {item.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {item.badge}
              </p>
              <h3 className="mt-1 font-display text-lg font-black text-slate-900">
                {item.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
