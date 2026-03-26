import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppInstallBanner from "@/components/AppInstallBanner";
import { useCurrentCity } from "@/contexts/CurrentCityContext";
import {
  CATEGORY_SHORTCUTS,
  COLLECTION_CARD,
  FILTER_CHIPS,
  GUIDE_SHORTCUTS,
  PILLARS,
  PROMO_BANNERS,
  QUICK_SEGMENTS,
} from "@/features/home/constants";
import { isServiceProviderListing, isFoodListing, isJobListing, isEventListing } from "@/features/home/utils";
import type { HomeHighlightListing } from "@/features/home/types";
import { HeroDesktop } from "./components/HeroDesktop";
import { ThreeWaysSection } from "./components/ThreeWaysSection";
import { FeaturedListingsSection } from "./components/FeaturedListingsSection";
import { GuideShortcutsSection } from "./components/GuideShortcutsSection";
import { CompanyHighlightsSection } from "./components/CompanyHighlightsSection";
import { MarketplaceSection } from "./components/MarketplaceSection";
import { FoodSection } from "./components/FoodSection";
import { ServiceProvidersSection } from "./components/ServiceProvidersSection";
import { EventsAndJobsSection } from "./components/EventsAndJobsSection";
import { SellerCtaSection } from "./components/SellerCtaSection";
import { MobileHome } from "./components/mobile/MobileHome";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { cityId: currentCityId, city: currentCity, setCityId, status: cityStatus } = useCurrentCity();
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");

  const { data: categories = [] } = trpc.public.categories.useQuery();
  const { data: cities = [] } = trpc.public.cities.useQuery();
  const { data: featured = [] } = trpc.public.featuredListings.useQuery({ limit: 8, cityId: currentCityId ?? undefined }, { enabled: cityStatus === "ready" });
  const { data: recent = [] } = trpc.public.recentListings.useQuery({ limit: 16, cityId: currentCityId ?? undefined }, { enabled: cityStatus === "ready" });
  const { data: deliveryListings = [] } = trpc.public.listingsByCategory.useQuery({ categorySlug: "delivery", limit: 6, cityId: currentCityId ?? undefined }, { enabled: cityStatus === "ready" });

  const featuredListings = featured as HomeHighlightListing[];
  const recentListings = recent as HomeHighlightListing[];
  const selectedCityName = currentCity?.name ?? "sua cidade";
  const primaryListings = featuredListings.length > 0 ? featuredListings : recentListings;
  const visibleListings = activeCategoryId === "all" ? primaryListings : primaryListings.filter((item) => item.categoryId === activeCategoryId);

  const cityNameById = (cityId?: number | null) => cities.find((city) => city.id === cityId)?.name || "Norte Pioneiro";

  const openNearby = visibleListings.filter((item) => item.seller?.isOpenNow).slice(0, 12);

  const companyHighlights = useMemo(
    () =>
      (featuredListings.length ? featuredListings : recentListings)
        .reduce<HomeHighlightListing[]>((acc, item) => {
          const key = (item.seller?.companyName || item.seller?.name || item.title).trim().toLowerCase();

          if (!acc.some((existing) => ((existing.seller?.companyName || existing.seller?.name || existing.title).trim().toLowerCase()) === key)) {
            acc.push(item);
          }

          return acc;
        }, [])
        .slice(0, 8),
    [featuredListings, recentListings]
  );

  const serviceProviders = useMemo(() => {
    return (featuredListings.length ? featuredListings : recentListings)
      .filter((item) => isServiceProviderListing(item, categories.find((category) => category.id === item.categoryId)?.name))
      .reduce<HomeHighlightListing[]>((acc, item) => {
        const key = (item.seller?.companyName || item.seller?.name || item.title).trim().toLowerCase();

        if (!acc.some((existing) => ((existing.seller?.companyName || existing.seller?.name || existing.title).trim().toLowerCase()) === key)) {
          acc.push(item);
        }

        return acc;
      }, [])
      .slice(0, 8);
  }, [categories, featuredListings, recentListings]);

  const foodListings = useMemo(() => {
    const source = deliveryListings as HomeHighlightListing[];
    return source.filter((item) => isFoodListing(item) && item.seller?.isOpenNow).slice(0, 6);
  }, [deliveryListings]);

  const jobListings = useMemo(
    () =>
      recentListings
        .filter((item) => isJobListing(item, categories.find((category) => category.id === item.categoryId)?.name))
        .slice(0, 4),
    [categories, recentListings]
  );

  const eventListings = useMemo(
    () =>
      recentListings
        .filter((item) => isEventListing(item, categories.find((category) => category.id === item.categoryId)?.name))
        .slice(0, 4),
    [categories, recentListings]
  );

  const handleSearch = (query: string) => {
    navigate(`/busca?q=${encodeURIComponent(query)}&city=${currentCityId || ""}`);
  };

  const stats = {
    listings: featuredListings.length || recentListings.length,
    companies: companyHighlights.length,
    services: serviceProviders.length,
    food: foodListings.length,
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_18%,#f8fafc_100%)]">
      <AppInstallBanner title="Use o aplicativo" subtitle="Acesso rápido e fácil no app" ctaLabel="Abrir" ctaHref="/app" />

      <div className="hidden md:block">
        <Header selectedCity={currentCityId ?? null} onCityChange={setCityId} onSearch={handleSearch} />
      </div>

      <main className="pb-24 md:pb-0">
        <MobileHome
          banners={PROMO_BANNERS}
          shortcuts={CATEGORY_SHORTCUTS}
          pillars={PILLARS}
          quickSegments={QUICK_SEGMENTS}
          filterChips={FILTER_CHIPS}
          collectionCard={COLLECTION_CARD}
          openNearby={openNearby}
          serviceProviders={serviceProviders}
          visibleListings={visibleListings}
          eventListings={eventListings}
          jobListings={jobListings}
          categories={categories}
          selectedCityName={selectedCityName}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
          onSearch={handleSearch}
          cityNameById={cityNameById}
          isAuthenticated={isAuthenticated}
        />

        <div className="hidden md:block">
          <HeroDesktop
            selectedCityName={selectedCityName}
            onSearch={handleSearch}
            isAuthenticated={isAuthenticated}
            pillars={PILLARS}
            stats={stats}
          />
        </div>

        <ThreeWaysSection pillars={PILLARS} />
        <FeaturedListingsSection listings={featuredListings} categories={categories} cityNameById={cityNameById} />
        <GuideShortcutsSection shortcuts={GUIDE_SHORTCUTS} selectedCityName={selectedCityName} />
        <CompanyHighlightsSection listings={companyHighlights} categories={categories} cityNameById={cityNameById} />
        <MarketplaceSection listings={recentListings} categories={categories} cityNameById={cityNameById} />
        <FoodSection listings={foodListings} cityNameById={cityNameById} />
        <ServiceProvidersSection listings={serviceProviders} cityNameById={cityNameById} />
        <EventsAndJobsSection eventListings={eventListings} jobListings={jobListings} cityNameById={cityNameById} />
        <SellerCtaSection isAuthenticated={isAuthenticated} />
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
