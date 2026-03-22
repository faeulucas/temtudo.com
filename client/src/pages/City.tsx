import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Ambulance,
  ArrowRight,
  Briefcase,
  ChevronRight,
  HeartHandshake,
  MapPin,
  Shield,
  Sparkles,
  Stethoscope,
  Store,
  Wrench,
  LayoutGrid,
  Phone,
} from "lucide-react";
import { CategorySvgIcon } from "@/components/CategorySvgIcon";
import { Link, useParams } from "wouter";

const CITY_GUIDE_SHORTCUTS = [
  {
    title: "Saúde",
    query: "saude",
    icon: Stethoscope,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Educação",
    query: "educacao",
    icon: Briefcase,
    tone: "bg-orange-50 text-orange-700",
  },
  {
    title: "Segurança",
    query: "seguranca",
    icon: Shield,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Emergências",
    query: "emergencia",
    icon: Ambulance,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    title: "Oficinas",
    query: "oficina",
    icon: Wrench,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Serviços",
    query: "servicos",
    icon: HeartHandshake,
    tone: "bg-violet-50 text-violet-700",
  },
];

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: cities } = trpc.public.cities.useQuery();
  const city = cities?.find((item) => item.slug === slug);

  const { data: featured } = trpc.public.featuredListings.useQuery(
    { limit: 8, cityId: city?.id },
    { enabled: Boolean(city?.id) }
  );

  const { data: recent } = trpc.public.recentListings.useQuery(
    { limit: 20, cityId: city?.id },
    { enabled: Boolean(city?.id) }
  );

  const { data: categories } = trpc.public.categories.useQuery();
  const { data: topCategories } = trpc.public.topCategories.useQuery({
    limit: 6,
  });

  const featuredListings = featured ?? [];
  const recentListings = recent ?? [];
  const cityName = city?.name || slug;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <Header selectedCity={city?.id ?? null} />

      <main className="container py-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Início
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/guia" className="hover:text-blue-600">
            Guia
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-900">{cityName}</span>
        </div>

        <section className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#f97316_130%)] p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold">
                <MapPin className="h-4 w-4" />
                Hub local do Norte Vivo
              </div>

              <h1 className="mt-4 font-display text-4xl font-black sm:text-5xl">
                {cityName}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50/90">
                Explore anúncios, negócios e serviços disponíveis nesta cidade,
                com atalhos rápidos para o que mais importa no dia a dia.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/busca?city=${city?.id || ""}`}>
                  <Button className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                    Explorar anúncios
                  </Button>
                </Link>

                <Link href="/guia">
                  <Button className="rounded-2xl bg-white/10 text-white hover:bg-white/15">
                    Abrir guia local
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black text-white">
                  {featuredListings.length}
                </p>
                <p className="text-sm text-blue-100">Destaques</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black text-white">
                  {recentListings.length}
                </p>
                <p className="text-sm text-blue-100">Anúncios recentes</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-black text-white">
                  {topCategories?.length ?? 0}
                </p>
                <p className="text-sm text-blue-100">Categorias populares</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-orange-50 p-3 text-orange-600">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Cidade conectada
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Um ponto central para tudo o que é local
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Essa página reúne descoberta, serviços, negócios e anúncios da
              cidade em uma navegação mais clara.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Phone className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Utilidade diária
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Acessos rápidos para o que mais importa
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Saúde, oficinas, emergências e serviços aparecem de forma mais
              rápida para quem precisa resolver algo agora.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Descoberta local
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-slate-900">
              Mais contexto para anúncios e negócios
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              O usuário consegue entender melhor o que existe na cidade antes de
              entrar no marketplace ou no guia.
            </p>
          </article>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              Acessos rápidos
            </p>
            <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
              Serviços e contatos importantes em {cityName}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Entradas diretas para o que a cidade mais precisa no dia a dia.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CITY_GUIDE_SHORTCUTS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={`/busca?q=${encodeURIComponent(item.query)}&city=${city?.id || ""}`}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <div className={`inline-flex rounded-2xl p-3 ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Filtrar resultados locais dessa área.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Acessar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {featuredListings.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                    Destaques da cidade
                  </p>
                  <h2 className="font-display text-3xl font-black text-slate-900">
                    Produtos e serviços com mais visibilidade
                  </h2>
                  <p className="text-sm text-slate-500">
                    Itens em destaque em {cityName}.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={city?.name}
                  categoryName={
                    categories?.find((category) => category.id === listing.categoryId)?.name
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Categorias populares
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                Interesses fortes em {cityName}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Atalhos por interesse para facilitar a navegação.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(topCategories ?? categories ?? []).slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/busca?q=${encodeURIComponent(category.name)}&city=${city?.id || ""}`}
              >
                <span className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                  <CategorySvgIcon
                    name={category.icon ?? "ShoppingBag"}
                    alt={category.name}
                    className="h-4 w-4 text-blue-600"
                    fallback={<span className="h-2 w-2 rounded-full bg-blue-600" />}
                  />
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
                Novidades locais
              </p>
              <h2 className="mt-2 font-display text-3xl font-black text-slate-900">
                Anúncios recentes em {cityName}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                O que entrou recentemente nesta cidade.
              </p>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
              {recentListings.length} resultado(s)
            </span>
          </div>

          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {recentListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={city?.name}
                  categoryName={
                    categories?.find((category) => category.id === listing.categoryId)?.name
                  }
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <MapPin className="mx-auto mb-4 h-14 w-14 text-slate-300" />
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Nenhum anúncio nesta cidade
              </h3>
              <p className="mt-2 text-slate-500">
                Assim que houver publicações locais, elas aparecerão aqui.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#f97316_140%)] p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
                Quer aparecer nesta cidade?
              </p>
              <h2 className="mt-3 font-display text-3xl font-black">
                Publique anúncios e fortaleça a presença local.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                Quanto mais negócios e anúncios locais entram, mais forte fica o
                portal para quem compra e para quem vende.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/anunciante/novo">
                <Button className="h-12 w-full rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                  <Store className="mr-2 h-4 w-4" />
                  Publicar anúncio
                </Button>
              </Link>

              <Link href="/busca">
                <Button className="h-12 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600">
                  Ver marketplace
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
