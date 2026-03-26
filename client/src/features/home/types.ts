export type HomeHighlightListing = {
  id: number;
  userId: number;
  title: string;
  type?: string | null;
  createdAt?: Date | string;
  cityId?: number | null;
  categoryId?: number | null;
  subcategory?: string | null;
  whatsapp?: string | null;
  neighborhood?: string | null;
  price?: string | null;
  priceType?: string | null;
  extraDataJson?: string | null;
  viewCount?: number | null;
  images?: { url: string; isPrimary?: boolean | null }[];
  seller?: {
    id?: number;
    name?: string | null;
    companyName?: string | null;
    avatar?: string | null;
    bannerUrl?: string | null;
    whatsapp?: string | null;
    cityId?: number | null;
    neighborhood?: string | null;
    isVerified?: boolean | null;
    isOpenNow?: boolean | null;
  } | null;
};
