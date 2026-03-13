import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { trpc } from "@/lib/trpc";
import { Building2, ChevronRight, MapPin } from "lucide-react";
import { Link, useParams } from "wouter";

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: cities } = trpc.public.cities.useQuery();
  const city = cities?.find(item => item.slug === slug);

  const { data: featured } = trpc.public.featuredListings.useQuery(
    { limit: 8, cityId: city?.id },
    { enabled: Boolean(city?.id) }
  );
  const { data: recent } = trpc.public.recentListings.useQuery(
    { limit: 20, cityId: city?.id },
    { enabled: Boolean(city?.id) }
  );
  const { data: categories } = trpc.public.categories.useQuery();

  const listings = recent ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header selectedCity={city?.id ?? null} />
      <main className="container py-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-gray-900">{city?.name || slug}</span>
        </div>

        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Cidade</p>
              <h1 className="mt-2 font-display text-4xl font-black text-gray-900">
                {city?.name || slug}
              </h1>
              <p className="mt-3 max-w-2xl text-gray-500">
                Explore anúncios, serviços e oportunidades disponíveis nesta cidade do Norte Vivo.
              </p>
            </div>
          </div>
        </section>

        {featured && featured.length > 0 && (
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900">Destaques da cidade</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map(listing => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={city?.name}
                  categoryName={categories?.find(c => c.id === listing.categoryId)?.name}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-gray-900">Anúncios recentes</h2>
            <span className="text-sm text-gray-500">{listings.length} resultado(s)</span>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {listings.map(listing => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  cityName={city?.name}
                  categoryName={categories?.find(c => c.id === listing.categoryId)?.name}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white p-12 text-center shadow-sm">
              <MapPin className="mx-auto mb-4 h-14 w-14 text-gray-200" />
              <h3 className="font-display text-xl font-bold text-gray-800">Nenhum anúncio nesta cidade</h3>
              <p className="mt-2 text-gray-500">Assim que houver publicações para esta cidade, elas aparecerão aqui.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
