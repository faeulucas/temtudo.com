import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function SectionHeader({ eyebrow, title, description, actionHref, actionLabel }: Props) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref}>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700">
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      ) : null}
    </div>
  );
}
