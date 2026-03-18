import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { BadgeCheck, Flame, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { LOGIN_ROUTE } from "@/const";

export default function BoosterPage() {
  const { isAuthenticated } = useAuth();
  const { data: featured } = trpc.public.featuredListings.useQuery({ limit: 16 });
  const { data: categories } = trpc.public.categories.useQuery();
  const { data: cities } = trpc.public.cities.useQuery();

  const boostedListings = featured ?? [];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_40%,#f8fafc_100%)]">
      <Header />

      <main className="container py-6">

        {/* HERO MUITO MAIS FORTE */}
        <section className="rounded-[32px] bg-[linear-gradient(135deg,#7c2d12_0%,#f97316_45%,#facc15_130%)] p-6 text-white shadow-[0_25px_80px_rgba(124,45,18,0.25)] sm:p-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <Flame className="h-4 w-4" />
              Destaque máximo no portal
            </div>

            <h1 className="mt-5 font-display text-4xl font-black leading-tight sm:text-5xl">
              Quer vender mais rápido?
              <br /> Coloque seu anúncio na frente de todo mundo.
            </h1>

            <p className="mt-4 text-base leading-7 text-orange-50/95">
              O Booster coloca seu anúncio no topo, aumenta visualizações e
              multiplica suas chances de receber contatos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={isAuthenticated ? "/anunciante" : LOGIN_ROUTE}>
                <Button className="rounded-2xl bg-white text-orange-700 hover:bg-orange-50">
                  <Zap className="mr-2 h-4 w-4" />
                  Ativar Booster agora
                </Button>
              </Link>

              <Link href="/planos">
                <Button className="rounded-2xl bg-white/10 text-white hover:bg-white/15">
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* BENEFÍCIOS (ANTES NÃO TINHA ISSO!) */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[28px] bg-white p-5 shadow-sm border border-orange-100">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <p className="mt-3 font-bold text-slate-900">Mais visualizações</p>
            <p className="text-sm text-slate-500">
              Seu anúncio aparece antes dos outros.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm border border-orange-100">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <p className="mt-3 font-bold text-slate-900">Mais destaque</p>
            <p className="text-sm text-slate-500">
              Destaque visual com selo e posição premium.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm border border-orange-100">
            <Zap className="h-6 w-6 text-yellow-500" />
            <p className="mt-3 font-bold text-slate-900">Mais contatos</p>
            <p className="text-sm text-slate-500">
              Mais cliques = mais chances de fechar negócio.
            </p>
          </div>
        </section>

        {/* LISTA DE BOOSTERS */}
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-black text-slate-900">
                Anúncios impulsionados
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {boostedListings.length} destaque(s) ativo(s)
              </p>
            </div>
          </div>

          {boostedListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {boostedListings.map(listing => (
                <div
                  key={listing.id}
                  className="overflow-hidden rounded-[28px] border border-orange-200 bg-white shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3">
                    <div className="inline-flex items-center gap-1 text-xs font-black text-white">
                      <Zap className="h-3.5 w-3.5" />
                      BOOSTER ATIVO
                    </div>
                    <BadgeCheck className="h-4 w-4 text-white" />
                  </div>

                  <ListingCard
                    {...listing}
                    cityName={cities?.find(city => city.id === listing.cityId)?.name}
                    categoryName={
                      categories?.find(category => category.id === listing.categoryId)?.name
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white p-12 text-center">
              <Zap className="mx-auto h-12 w-12 text-orange-300" />
              <p className="mt-4 text-slate-500">
                Nenhum anúncio impulsionado no momento.
              </p>
            </div>
          )}
        </section>

        {/* CTA FINAL (IMPORTANTÍSSIMO PRA CONVERSÃO) */}
        <section className="mt-10 rounded-[32px] bg-gradient-to-r from-orange-500 to-amber-400 p-8 text-white text-center shadow-lg">
          <h2 className="font-display text-3xl font-black">
            Quer aparecer aqui também?
          </h2>
          <p className="mt-2 text-orange-50">
            Ative o Booster e coloque seu anúncio no topo agora.
          </p>

          <div className="mt-6">
            <Link href={isAuthenticated ? "/anunciante" : LOGIN_ROUTE}>
              <Button className="rounded-2xl bg-white text-orange-600 px-8 py-6 font-bold hover:bg-orange-50">
                <Zap className="mr-2 h-4 w-4" />
                Ativar Booster
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}