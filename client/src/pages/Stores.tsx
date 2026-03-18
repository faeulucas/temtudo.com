import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { getStorefrontHref } from "@/lib/storefront";
import { trpc } from "@/lib/trpc";
import {
  Building2,
  MapPin,
  MessageCircle,
  Search,
  Store,
  Sparkles,
  ShieldCheck,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

type StorePreview = {
  id: number;
  userId: number;
  title: string;
  cityId?: number | null;
  categoryId?: number | null;
  subcategory?: string | null;
  whatsapp?: string | null;
  images?: { url: string; isPrimary?: boolean | null }[];
  seller?: {
    id?: number;
    name?: string | null;
    companyName?: string | null;
    avatar?: string | null;
    bannerUrl?: string | null;
  } | null;
};

export default function StoresPage() {
  const [search, setSearch] = useState("");

  const { data: featured } = trpc.public.featuredListings.useQuery({ limit: 12 });
  const { data: recent } = trpc.public.recentListings.useQuery({ limit: 20 });
  const { data: categories } = trpc.public.categories.useQuery();
  const { data: cities } = trpc.public.cities.useQuery();

  const stores = useMemo(() => {
    const source = ((featured?.length ? featured : recent) ?? []) as StorePreview[];

    const deduped = source.reduce<StorePreview[]>((acc, item) => {
      const key = (
        item.seller?.companyName ||
        item.seller?.name ||
        item.title
      )
        .trim()
        .toLowerCase();

      if (
        !acc.some((existing) => {
          const existingKey = (
            existing.seller?.companyName ||
            existing.seller?.name ||
            existing.title
          )
            .trim()
            .toLowerCase();

          return existingKey === key;
        })
      ) {
        acc.push(item);
      }

      return acc;
    }, []);

    const term = search.trim().toLowerCase();
    if (!term) return deduped;

    return deduped.filter((item) =>
      [
        item.seller?.companyName,
        item.seller?.name,
        item.title,
        item.subcategory,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [featured, recent, search]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header />

      <main className="container py-6">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#f97316_140%)] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                Lojas e empresas do Norte Vivo
              </div>

              <h1 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-5xl">
                Negócios locais com vitrine real dentro do portal.
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-lg">
                Explore empresas, parceiros e negócios ativos da região para
                encontrar produtos, serviços e contatos com mais rapidez.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{stores.length}</p>
                <p className="text-sm text-slate-200">Lojas visíveis</p>
              </div>

              <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">
                  {cities?.length ?? 0}
                </p>
                <p className="text-sm text-slate-200">Cidades atendidas</p>
              </div>

              <div className="rounded-[22px] bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">
                  {categories?.length ?? 0}
                </p>
                <p className="text-sm text-slate-200">Categorias ativas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-orange-50 p-3 text-orange-600">
              <Store className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Catálogo local
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Descubra negócios da região
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Aqui o usuário navega por lojas e empresas locais com mais clareza
              e mais confiança.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Confiança
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Lojas com presença mais profissional
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              O objetivo é transformar um perfil simples em uma vitrine mais forte
              e mais valiosa para quem vende.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Descoberta
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Produto, loja e contato no mesmo fluxo
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              O usuário pode encontrar a loja, abrir a vitrine e entrar em
              contato sem sair do ecossistema.
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Buscar lojas
              </p>
              <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
                Encontre empresas pelo nome ou tipo de negócio
              </h2>
            </div>

            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar lojas e empresas..."
                aria-label="Buscar lojas e empresas"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:bg-white"
              />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Lojas em destaque
              </p>
              <h2 className="font-display text-3xl font-black text-slate-900">
                Empresas e negócios ativos no portal
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {stores.length} negócio(s) encontrado(s)
              </p>
            </div>

            <Link href="/busca?q=lojas">
              <Button variant="outline" className="rounded-2xl">
                Ver no marketplace
              </Button>
            </Link>
          </div>

          {stores.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {stores.map((item) => {
                const cover =
                  item.seller?.bannerUrl ||
                  item.images?.find((image) => image.isPrimary)?.url ||
                  item.images?.[0]?.url;

                const displayName =
                  item.seller?.companyName?.trim() ||
                  item.seller?.name?.trim() ||
                  item.title;

                const subtitle =
                  categories?.find((category) => category.id === item.categoryId)?.name ||
                  item.subcategory ||
                  "Negócio local";

                const storefrontHref = getStorefrontHref(item.seller?.id, item.id);

                const whatsappHref = item.whatsapp
                  ? `https://wa.me/55${item.whatsapp.replace(/\D/g, "")}`
                  : null;

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <Link href={storefrontHref} className="block">
                      <div className="relative h-44 bg-slate-100">
                        {cover ? (
                          <img
                            src={cover}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100">
                            <span className="font-display text-4xl font-black text-slate-700">
                              {displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-lg font-black text-blue-700">
                          {item.seller?.avatar ? (
                            <img
                              src={item.seller.avatar}
                              alt={displayName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-display text-xl font-bold text-slate-900">
                            {displayName}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          {cities?.find((city) => city.id === item.cityId)?.name ||
                            "Norte Pioneiro"}
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        Veja a vitrine da loja, os produtos publicados e formas
                        rápidas de contato.
                      </p>

                      <div className="mt-5 flex gap-2">
                        <Link href={storefrontHref} className="flex-1">
                          <Button className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                            <Store className="mr-2 h-4 w-4" />
                            Ver loja
                          </Button>
                        </Link>

                        {whatsappHref && (
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Falar com ${displayName} no WhatsApp`}
                            title={`Falar com ${displayName} no WhatsApp`}
                          >
                            <Button className="rounded-2xl bg-green-500 text-white hover:bg-green-600">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">
                Nenhuma loja encontrada para esse termo.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.22)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
                Quer divulgar sua empresa?
              </p>
              <h2 className="mt-3 font-display text-3xl font-black">
                Crie sua vitrine e apareça para novos clientes da região.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">
                O Norte Vivo ajuda lojas e empresas locais a terem presença digital,
                mesmo sem site próprio.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[340px]">
              <Link href="/anunciar">
                <Button className="h-12 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                  <Store className="mr-2 h-4 w-4" />
                  Criar minha vitrine
                </Button>
              </Link>

              <Link href="/planos">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/15"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}