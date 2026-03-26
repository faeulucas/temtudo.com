type Category = { id: number; name: string };

type Props = {
  categories: Category[];
  activeCategoryId: number | "all";
  onChange: (categoryId: number | "all") => void;
  selectedCityName: string;
};

export function MobileCategoryFilter({ categories, activeCategoryId, onChange, selectedCityName }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Filtrar vitrine</p>
        <span className="text-xs font-semibold text-slate-500">{selectedCityName}</span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${
            activeCategoryId === "all"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-slate-50 text-slate-800"
          }`}
        >
          Tudo
        </button>

        {categories.slice(0, 10).map((category) => (
          <button
            key={`mobile-cat-${category.id}`}
            type="button"
            onClick={() => onChange(category.id)}
            className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${
              activeCategoryId === category.id
                ? "border-orange-300 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
