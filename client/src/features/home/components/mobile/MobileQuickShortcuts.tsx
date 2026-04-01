import { Link } from "wouter";
import type { QUICK_SEGMENTS } from "@/features/home/constants";

type QuickSegment = (typeof QUICK_SEGMENTS)[number];

type Props = {
  segments: QuickSegment[];
  onSearch: (query: string) => void;
};

export function MobileQuickShortcuts({ segments, onSearch }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Atalhos rápidos</p>
        <Link href="/busca" className="text-xs font-semibold text-orange-600">
          ver todos
        </Link>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {segments.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSearch(item.label)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.label}
                className="h-5 w-5 object-contain"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-lg leading-none">{item.emoji}</span>
            )}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
