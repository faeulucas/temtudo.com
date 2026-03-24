import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentCity } from "@/contexts/CurrentCityContext";
import { trpc } from "@/lib/trpc";
import { MapPin, RefreshCcw } from "lucide-react";
import { useMemo } from "react";

type CategoryTemplateProps = {
  title: string;
  copy: string;
  categorySlug?: string;
  searchTerm?: string;
  type?: "product" | "service" | "vehicle" | "property" | "food" | "job";
  eyebrow?: string;
};

export default function CityCategoryTemplate({
  title,
  copy,
  categorySlug,
  searchTerm,
  type,
  eyebrow = "Conteúdo local",
}: CategoryTemplateProps) {
  const { cityId, city, setCityId, refreshDetection, status } = useCurrentCity();
  const { data: cities } = trpc.public.cities.useQuery();
  const { data: categories } = trpc.public.categories.useQuery();

  const categoryId = useMemo(
    () =>
      categorySlug
        ? categories?.find((item) => item.slug === categorySlug)?.id ?? null
        : null,
    [categories, categorySlug]
  );

  const { data: results, isLoading } = trpc.public.searchListings.useQuery({
    q: searchTerm || undefined,
    categoryId: categoryId ?? undefined,
    cityId: cityId ?? undefined,
    type: type || undefined,
    limit: 40,
  }, { enabled: status === "ready" });

  const listings = (results as any)?.items ?? results ?? [];
  const cityLabel = city?.name ?? "sua cidade";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container py-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-100 bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                {eyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl font-black text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {copy}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                <MapPin className="h-4 w-4" />
                {cityLabel}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select
                value={cityId ? String(cityId) : "all"}
                onValueChange={(value) => setCityId(value === "all" ? null : Number(value))}
              >
                <SelectTrigger className="w-[220px] rounded-2xl border-slate-200 bg-white font-semibold text-slate-800">
                  <SelectValue placeholder="Selecionar cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {(cities ?? []).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => refreshDetection()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Detectar cidade
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="rounded-2xl bg-white p-3 shadow-sm">
                  <div className="aspect-[4/3] rounded-xl bg-slate-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {listings.map((listing: any) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={cities?.find((c) => c.id === listing.cityId)?.name}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Sem resultados em {cityLabel}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-slate-900">
                Nada nesta categoria na sua cidade ainda.
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Tente outra cidade ou volte mais tarde. Se você tem um negócio, clique em anunciar
                para aparecer aqui.
              </p>
              <div className="mt-4 flex justify-center">
                <Button asChild className="rounded-2xl">
                  <a href="/anunciar">Anunciar meu negócio</a>
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
