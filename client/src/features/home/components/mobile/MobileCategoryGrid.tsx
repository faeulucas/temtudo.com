import { Link } from "wouter";
import { CategoryIcon } from "../CategoryIcon";
import type { CATEGORY_SHORTCUTS } from "@/features/home/constants";

type Shortcut = (typeof CATEGORY_SHORTCUTS)[number];

type Props = {
  shortcuts: Shortcut[];
};

export function MobileCategoryGrid({ shortcuts }: Props) {
  return (
    <div className="container mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
      {shortcuts.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex min-h-[88px] flex-col items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-sm transition hover:border-orange-200 hover:shadow-md"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white ${item.tone} shadow-[0_6px_16px_rgba(15,23,42,0.06)]`}
          >
            <CategoryIcon emoji={item.emoji} image={item.image} fallbackImage={item.fallbackImage} alt={item.label} />
          </span>
          <span className="text-[12px] font-semibold leading-tight text-slate-800">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
