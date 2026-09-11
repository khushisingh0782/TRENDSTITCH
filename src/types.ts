// Common Normalized Fashion Product & Intelligence Types

export type RetailerId = 
  | 'myntra'
  | 'ajio'
  | 'tatacliq'
  | 'nykaa'
  | 'meesho'
  | 'flipkart'
  | 'amazon_in'
  | 'shein_in';

export interface Retailer {
  id: RetailerId;
  name: string;
  logoUrl?: string;
  affiliateSupported: boolean;
  apiConnected: boolean;
  authStatus: 'connected' | 'demo' | 'needs_key' | 'not_connected';
  lastSyncTime?: string;
  productCount: number;
  color: string;
}

export type FashionCategory =
  | 'dresses'
  | 'tops'
  | 'shirts'
  | 't_shirts'
  | 'jeans'
  | 'trousers'
  | 'pants'
  | 'skirts'
  | 'co_ords'
  | 'jackets'
  | 'blazers'
  | 'sweaters'
  | 'hoodies'
  | 'streetwear'
  | 'casualwear'
  | 'college'
  | 'partywear'
  | 'workwear'
  | 'western'
  | 'indian'
  | 'indo_western'
  | 'footwear'
  | 'bags'
  | 'accessories'
  | 'jewellery'
  | 'seasonal'
  | 'casual'
  | 'party'
  | 'tops_shirts'
  | 'jeans_trousers'
  | 'jackets_outerwear';

export interface PriceObservation {
  timestamp: string; // ISO date string or formatted date
  price: number;
  originalPrice: number;
  discountPercent: number;
  retailerId: RetailerId;
  isLowest?: boolean;
  verifiedSource: 'api' | 'affiliate_feed' | 'demo_snapshot';
}

export interface PriceHistorySummary {
  currentPrice: number;
  originalPrice: number;
  lowestObservedPrice: number;
  highestObservedPrice: number;
  change7d: number; // positive = increased, negative = dropped
  change30d: number;
  change60d: number;
  priceDropPercentage: number;
  observations: PriceObservation[];
  hasSufficientData?: boolean;
  summaryNote?: string;
}

export type ProductSourceType = 
  | 'partner_api'
  | 'affiliate_feed'
  | 'merchant_catalog'
  | 'seeded_demo';

export type VerificationStatus = 
  | 'verified_real'
  | 'demo_seeded'
  | 'unavailable';

export interface CanonicalProvenanceAuditRecord {
  canonical_product_id: string;
  source_type: ProductSourceType;
  retailer: RetailerId;
  retailer_product_id: string;
  product_url: string;
  image_url: string;
  last_verified_at: string;
  is_demo: boolean;
  is_live: boolean;
  offer_count: number;
  verification_status: VerificationStatus;
}

export interface CatalogHealthReport {
  totalCanonical: number;
  verifiedReal: number;
  demoProducts: number;
  brokenUrls: number;
  missingImages: number;
  missingPrices: number;
  missingRetailer: number;
  multipleRetailerOffers: number;
  duplicateCandidates: number;
  lastAuditedAt: string;
  duplicateAuditResults: {
    totalPairsChecked: number;
    duplicateCandidatesFound: number;
    clustersMerged: number;
    sampleMergedProducts: Array<{
      canonical_product_id: string;
      title: string;
      retailerCount: number;
      retailers: string[];
      savings: number;
    }>;
  };
}

export interface ProductOffer {
  id: string;
  canonicalProductId?: string;
  retailerId: RetailerId;
  retailerName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  productUrl: string;
  couponCode?: string;
  deliveryEstimateDays?: number;
  lastVerifiedTimestamp: string;
  isBestPrice?: boolean;
  colorVariant?: string;
  sizeVariants?: string[];
}

export interface CanonicalProduct extends Product {
  canonicalProductId: string;
  canonicalTitle: string;
  canonicalBrand: string;
  aesthetic: string;
  silhouette: string;
  offers: ProductOffer[];
}

export interface TrendStitchScoreBreakdown {
  aestheticScore: number; // 0 - 100: photography, contemporary styling, curation
  reviewScore: number;    // 0 - 100: Bayesian-smoothed rating & volume
  trendScore: number;     // 0 - 100: search, view & save velocity
  dealScore: number;      // 0 - 100: discount depth & value ratio
  priceDropScore: number; // 0 - 100: 7d/30d drop magnitude
  overallScore: number;   // 0 - 100: composite weighted score
  explanation: string;    // transparent rationale
}

export interface Product {
  id: string;
  product_id?: string;
  name: string;
  product_name?: string;
  brand: string;
  retailer?: RetailerId;
  primaryRetailerId: RetailerId;
  category: FashionCategory;
  subcategory: string;
  gender?: 'women' | 'men' | 'unisex';
  price?: number;
  currentPrice: number;
  original_price?: number;
  originalPrice: number;
  discount_percentage?: number;
  discountPercent: number;
  currency?: 'INR';
  rating: number;
  review_count?: number;
  reviewCount: number;
  image_url?: string;
  imageUrl: string;
  additionalImages?: string[];
  product_url?: string;
  productUrl: string;
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock';
  sizes: string[];
  colors: string[];
  last_checked?: string;
  canonical_product_id?: string;
  canonicalProductId?: string;
  canonicalTitle?: string;
  aesthetic?: string;
  silhouette?: string;
  fabric?: string;
  lastUpdatedTimestamp: string;
  normalizedGroupId?: string; // Links identical/near-identical items across retailers
  scores: TrendStitchScoreBreakdown;
  aesthetic_score?: number;
  review_score?: number;
  trend_score?: number;
  deal_score?: number;
  price_drop_score?: number;
  overall_score?: number;
  priceHistory: PriceHistorySummary;
  offers: ProductOffer[];
  whyTrending: string[];
  whyGoodDeal: string[];
  tags: string[];
  description: string;
  isDemoData?: boolean;
  styleTags?: string[];
  // Provenance & Audit Fields (CRITICAL)
  source_type?: ProductSourceType;
  retailer_product_id?: string;
  last_verified_at?: string;
  is_demo?: boolean;
  is_live?: boolean;
  offer_count?: number;
  verification_status?: VerificationStatus;
}

export interface CatalogQueryResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  activeFilterCount: number;
  categoryBreakdown: Record<string, number>;
  retailerBreakdown: Record<string, number>;
}

// Database schema table interfaces
export interface ProductTableRecord extends Product {}

export interface ProductOfferTableRecord extends ProductOffer {
  productId: string;
}

export interface RetailerTableRecord extends Retailer {
  apiKeyConfigured: boolean;
  affiliateTagConfigured: boolean;
}

export interface PriceHistoryTableRecord {
  id: string;
  productId: string;
  observations: PriceObservation[];
  lastUpdated: string;
}

export interface ProductReviewsSummaryTableRecord {
  productId: string;
  averageRating: number;
  totalReviews: number;
  sentimentSummary: string;
  verifiedPurchaseRate: number;
}

export interface TrendSignalsTableRecord {
  id: string;
  category: FashionCategory;
  tag: string;
  searchVelocity: number;
  saveVelocity: number;
  viewVelocity: number;
  updatedAt: string;
}

export interface UserTableRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SavedProduct {
  id: string;
  productId: string;
  savedAt: string;
  initialPrice: number;
  currentPrice: number;
  targetPrice?: number;
  previousPrice?: number;
  notes?: string;
  alertConfig: {
    notifyOnDrop: boolean;
    notifyOnTarget: boolean;
    notifyOnBackInStock: boolean;
    targetPrice?: number;
  };
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'target_reached' | 'back_in_stock' | 'trend_alert';
  title: string;
  message: string;
  productId: string;
  productName: string;
  productImage: string;
  oldPrice?: number;
  newPrice: number;
  retailerName: string;
  timestamp: string;
  isRead: boolean;
}

export interface TrendCollection {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  productIds: string[];
}

export interface SearchFilters {
  query: string;
  category?: FashionCategory | 'all';
  retailers: RetailerId[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
  minTrendScore?: number;
  sortBy: 'score' | 'price_drop' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

export interface DataSourceConfig {
  mode: 'demo' | 'live';
  myntraApiKey?: string;
  ajioAffiliateId?: string;
  amazonAssociateTag?: string;
  tataCliqApiKey?: string;
  nykaaApiKey?: string;
  pinterestClientId?: string;
  pinterestClientSecret?: string;
  lastScanTimestamp?: string;
  pollingIntervalHours: number;
}

export type TabType = 'discover' | 'trend-radar' | 'saved' | 'taste';

export interface TasteProfile {
  name: string;
  avatar: string;
  handle: string;
  location?: string;
  city?: string;
  isVerified?: boolean;
  tier?: string;
  bio?: string;
  savedFitsCount?: number;
  boardsCount: number;
  dropRadarsCount?: number;
  aesthetics: {
    indoWestern: number;
    western: number;
    traditional: number;
  };
  priceTiers: {
    budget?: boolean;
    contemporary?: boolean;
    luxury?: boolean;
    under999?: boolean;
    tier1kTo2k?: boolean;
    tier2kTo5k?: boolean;
    luxury5kPlus?: boolean;
  };
  prioritizedTags: string[];
  dropAlerts: boolean;
  restockPing: boolean;
  weeklyDigest: boolean;
}

export interface Moodboard {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  itemCount: number;
  tags: string[];
  totalValue?: number;
  images?: string[];
  isPrivate?: boolean;
}

export interface LookbookStore {
  storeName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  inStock: boolean;
  isLowest?: boolean;
  stockNote?: string;
  couponCode?: string;
  deliveryEstimate?: string;
  affiliateUrl?: string;
  isBestPrice?: boolean;
}

export interface LookbookAccessory {
  id?: string;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  store: string;
  image: string;
  trendMatch?: string;
  matchPercent?: number;
}

export interface LookbookItem {
  id: string;
  title: string;
  code?: string;
  lookNumber?: string;
  image?: string;
  heroImage?: string;
  demandPercentile?: number;
  archivalIndex?: string;
  description?: string;
  provenance?: string;
  lowestPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  storesCount?: number;
  looksCatalogued?: number;
  category?: string;
  regionFocus?: string;
  readTime?: string;
  heroHeadline?: string;
  editorialLead?: string;
  radarScore?: number;
  radarVelocity?: string;
  stores?: LookbookStore[];
  accessories?: LookbookAccessory[];
  keyPieces?: {
    name: string;
    role: string;
    price: string;
    craftOrigin: string;
  }[];
  arbitrage?: {
    primaryStore: string;
    originalPrice: string;
    currentPrice: string;
    savePercentage: string;
    affiliateLink: string;
  };
  palette?: string[];
  editorialAnalysis?: string;
  stylingNotes?: string[];
  priceTrajectory?: any;
}

export interface TrendingHashtag {
  id?: string;
  tag: string;
  views?: string;
  count?: string;
  growth: number | string;
  category: string;
}

export interface BreakoutLabel {
  id?: string;
  initials?: string;
  name: string;
  city?: string;
  origin?: string;
  description?: string;
  specialty?: string;
  priceRange?: string;
  heroPiece?: string;
  viralityScore?: number;
  growthPercent?: number;
  growthVelocity?: string;
  topCategory?: string;
  image?: string;
}

export interface SavedFitItem {
  id: string;
  title: string;
  price: number | string;
  originalPrice?: number;
  discountPercent?: number;
  storesCompared?: number;
  bestStore?: string;
  savesCount?: string;
  category?: string;
  brand?: string;
  image: string;
  isSaved?: boolean;
  tag?: string;
  boardId?: string;
}

export interface TrackedPiece {
  id: string;
  title?: string;
  name?: string;
  brand?: string;
  store?: string;
  initialPrice?: number;
  currentPrice: number;
  lowestPrice?: number;
  originalPrice?: number;
  dropPercent?: number;
  dropPercentage?: number;
  storesCount?: number;
  bestStore?: string;
  otherStores?: string;
  inStock?: boolean;
  productUrl?: string;
  image: string;
  addedDaysAgo?: number;
  status?: string;
  isLowestIn30d?: boolean;
}
