import type { HomeHighlightListing } from "@/features/home/types";
import type {
  CATEGORY_SHORTCUTS,
  COLLECTION_CARD,
  FILTER_CHIPS,
  PILLARS,
  PROMO_BANNERS,
  QUICK_SEGMENTS,
} from "@/features/home/constants";
import { MobilePromoBanners } from "./MobilePromoBanners";
import { MobileCategoryGrid } from "./MobileCategoryGrid";
import { MobileAppCard } from "./MobileAppCard";
import { MobilePillars } from "./MobilePillars";
import { MobileQuickShortcuts } from "./MobileQuickShortcuts";
import { MobileOpenNowSection } from "./MobileOpenNowSection";
import { MobileServicesSection } from "./MobileServicesSection";
import { MobileCategoryFilter } from "./MobileCategoryFilter";
import { MobileOffersSection } from "./MobileOffersSection";
import { MobileEventsJobsSection } from "./MobileEventsJobsSection";
import { MobileCouponsSection } from "./MobileCouponsSection";

type Category = { id: number; name: string };

type Props = {
  banners: typeof PROMO_BANNERS;
  shortcuts: typeof CATEGORY_SHORTCUTS;
  pillars: typeof PILLARS;
  quickSegments: typeof QUICK_SEGMENTS;
  filterChips: typeof FILTER_CHIPS;
  collectionCard: typeof COLLECTION_CARD;
  openNearby: HomeHighlightListing[];
  serviceProviders: HomeHighlightListing[];
  visibleListings: HomeHighlightListing[];
  eventListings: HomeHighlightListing[];
  jobListings: HomeHighlightListing[];
  categories: Category[];
  selectedCityName: string;
  activeCategoryId: number | "all";
  onCategoryChange: (categoryId: number | "all") => void;
  onSearch: (query: string) => void;
  cityNameById: (cityId?: number | null) => string;
  isAuthenticated: boolean;
};

export function MobileHome({
  banners,
  shortcuts,
  pillars,
  quickSegments,
  filterChips,
  collectionCard,
  openNearby,
  serviceProviders,
  visibleListings,
  eventListings,
  jobListings,
  categories,
  selectedCityName,
  activeCategoryId,
  onCategoryChange,
  onSearch,
  cityNameById,
  isAuthenticated,
}: Props) {
  return (
    <div className="md:hidden">
      <MobilePromoBanners banners={banners} />
      <MobileCategoryGrid shortcuts={shortcuts} />

      <section className="bg-white">
        <div className="container space-y-6 pt-4 pb-8">
          <MobileAppCard isAuthenticated={isAuthenticated} onSearch={onSearch} filterChips={filterChips} />
          <MobilePillars pillars={pillars} />
          <MobileQuickShortcuts segments={quickSegments} onSearch={onSearch} />
          <MobileOpenNowSection openNearby={openNearby} cityNameById={cityNameById} />
          <MobileServicesSection serviceProviders={serviceProviders} cityNameById={cityNameById} />
          <MobileCategoryFilter
            categories={categories}
            activeCategoryId={activeCategoryId}
            onChange={onCategoryChange}
            selectedCityName={selectedCityName}
          />
          <MobileOffersSection listings={visibleListings} cityNameById={cityNameById} />
          <MobileEventsJobsSection
            eventListings={eventListings}
            jobListings={jobListings}
            cityNameById={cityNameById}
          />
          <MobileCouponsSection banners={banners} collectionCard={collectionCard} />
        </div>
      </section>
    </div>
  );
}
