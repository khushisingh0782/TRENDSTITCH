import { Product, Retailer, TrendCollection } from '../types';
import { calculateTrendStitchScores } from '../services/rankingEngine';
import { analyzePriceHistory } from '../services/priceHistoryEngine';

export const SUPPORTED_RETAILERS: Retailer[] = [
  {
    id: 'myntra',
    name: 'Myntra',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 4280,
    color: '#FF3F6C',
    lastSyncTime: '2 hours ago',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 3120,
    color: '#2C4152',
    lastSyncTime: '3 hours ago',
  },
  {
    id: 'amazon_in',
    name: 'Amazon India',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 6540,
    color: '#FF9900',
    lastSyncTime: '1 hour ago',
  },
  {
    id: 'tatacliq',
    name: 'Tata CLiQ',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 1890,
    color: '#000000',
    lastSyncTime: '4 hours ago',
  },
  {
    id: 'nykaa',
    name: 'Nykaa Fashion',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 2450,
    color: '#FC2779',
    lastSyncTime: '2 hours ago',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 5120,
    color: '#2874F0',
    lastSyncTime: '1 hour ago',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    affiliateSupported: true,
    apiConnected: false,
    authStatus: 'demo',
    productCount: 3840,
    color: '#F43397',
    lastSyncTime: '5 hours ago',
  },
  {
    id: 'shein_in',
    name: 'SHEIN India',
    affiliateSupported: false,
    apiConnected: false,
    authStatus: 'needs_key',
    productCount: 1420,
    color: '#000000',
    lastSyncTime: 'Pending API Setup',
  },
];

// Helper to assemble standardized products with computed scores and historical price points
function createNormalizedProduct(raw: {
  id: string;
  name: string;
  brand: string;
  category: any;
  subcategory: string;
  currentPrice: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  additionalImages?: string[];
  productUrl: string;
  primaryRetailerId: any;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  sizes: string[];
  colors: string[];
  tags: string[];
  description: string;
  normalizedGroupId?: string;
  priceDropRecent: number;
  priceDropDays: number;
  trendVelocity: number;
  observations: { date: string; price: number; retailer: any }[];
  offers: {
    retailerId: any;
    price: number;
    originalPrice: number;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    couponCode?: string;
    url: string;
  }[];
  whyTrending: string[];
  whyGoodDeal: string[];
}): Product {
  const discountPercent = Math.round(((raw.originalPrice - raw.currentPrice) / raw.originalPrice) * 100);

  const scores = calculateTrendStitchScores({
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    currentPrice: raw.currentPrice,
    originalPrice: raw.originalPrice,
    discountPercent,
    priceDropRecent: raw.priceDropRecent,
    priceDropDays: raw.priceDropDays,
    trendVelocity: raw.trendVelocity,
    availability: raw.availability,
    categoryName: raw.subcategory,
  });

  const priceHistory = analyzePriceHistory(
    raw.observations.map((obs) => ({
      timestamp: obs.date,
      price: obs.price,
      originalPrice: raw.originalPrice,
      discountPercent: Math.round(((raw.originalPrice - obs.price) / raw.originalPrice) * 100),
      retailerId: obs.retailer,
      verifiedSource: 'demo_snapshot',
    })),
    raw.currentPrice,
    raw.originalPrice
  );

  const minOfferPrice = Math.min(...raw.offers.map((o) => o.price), raw.currentPrice);

  const retailerNameMap: Record<string, string> = {
    myntra: 'Myntra',
    ajio: 'AJIO',
    amazon_in: 'Amazon India',
    tatacliq: 'Tata CLiQ',
    nykaa: 'Nykaa Fashion',
    flipkart: 'Flipkart',
    meesho: 'Meesho',
    shein_in: 'SHEIN India',
  };

  const formattedOffers = raw.offers.map((o, idx) => ({
    id: `${raw.id}-offer-${idx}`,
    retailerId: o.retailerId,
    retailerName: retailerNameMap[o.retailerId] || o.retailerId,
    price: o.price,
    originalPrice: o.originalPrice,
    discountPercent: Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100),
    rating: o.rating,
    reviewCount: o.reviewCount,
    inStock: o.inStock,
    productUrl: o.url,
    couponCode: o.couponCode,
    lastVerifiedTimestamp: 'Verified Today, 11:30 AM',
    isBestPrice: o.price === minOfferPrice,
  }));

  return {
    id: raw.id,
    name: raw.name,
    brand: raw.brand,
    category: raw.category,
    subcategory: raw.subcategory,
    currentPrice: raw.currentPrice,
    originalPrice: raw.originalPrice,
    discountPercent,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    imageUrl: raw.imageUrl,
    additionalImages: raw.additionalImages || [raw.imageUrl],
    productUrl: raw.productUrl,
    primaryRetailerId: raw.primaryRetailerId,
    availability: raw.availability,
    sizes: raw.sizes,
    colors: raw.colors,
    lastUpdatedTimestamp: 'Today, 11:30 AM',
    normalizedGroupId: raw.normalizedGroupId,
    scores,
    priceHistory,
    offers: formattedOffers,
    whyTrending: raw.whyTrending,
    whyGoodDeal: raw.whyGoodDeal,
    tags: raw.tags,
    description: raw.description,
    isDemoData: true,
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Oversized Boxy Denim Jacket (Western / Streetwear / College)
  createNormalizedProduct({
    id: 'prod-denim-jacket-01',
    name: 'Heavyweight Boxy Washed Denim Trucker Jacket',
    brand: 'Levi\'s Red Tab',
    category: 'jackets_outerwear',
    subcategory: 'Oversized Denim Jackets',
    currentPrice: 1599,
    originalPrice: 2999,
    rating: 4.6,
    reviewCount: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    ],
    productUrl: 'https://www.myntra.com',
    primaryRetailerId: 'myntra',
    availability: 'in_stock',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Stonewash', 'Faded Charcoal', 'Raw Indigo'],
    tags: ['Oversized', 'Denim', 'Streetwear', 'College', 'Under ₹1999', 'Levi\'s'],
    description: 'Heavyweight 100% rigid cotton denim cut in a dropped shoulder boxy trucker silhouette with antique brass shank buttons and welt pockets.',
    normalizedGroupId: 'grp-denim-trucker-levis',
    priceDropRecent: 700,
    priceDropDays: 14,
    trendVelocity: 94,
    observations: [
      { date: '60d ago', price: 2999, retailer: 'myntra' },
      { date: '30d ago', price: 2499, retailer: 'myntra' },
      { date: '14d ago', price: 2299, retailer: 'myntra' },
      { date: '7d ago', price: 1899, retailer: 'myntra' },
      { date: 'Today', price: 1599, retailer: 'myntra' },
    ],
    offers: [
      { retailerId: 'myntra', price: 1599, originalPrice: 2999, rating: 4.6, reviewCount: 2400, inStock: true, couponCode: 'FLAT200', url: 'https://www.myntra.com' },
      { retailerId: 'ajio', price: 1699, originalPrice: 2999, rating: 4.5, reviewCount: 840, inStock: true, couponCode: 'TRENDS', url: 'https://www.ajio.com' },
      { retailerId: 'amazon_in', price: 1749, originalPrice: 2999, rating: 4.4, reviewCount: 1120, inStock: true, url: 'https://www.amazon.in' },
      { retailerId: 'tatacliq', price: 1999, originalPrice: 2999, rating: 4.6, reviewCount: 310, inStock: false, url: 'https://www.tatacliq.com' },
    ],
    whyTrending: [
      'Featured in 14+ Delhi & Bangalore college streetwear lookbooks this month',
      'Boxy dropped-shoulder cut is outperforming standard slim jackets by 3.2x in saves',
      'Neutral stonewash easily pairs over hoodies and floral kurtis',
    ],
    whyGoodDeal: [
      'Lowest recorded price in 60 days (dropped ₹700 in past 14 days)',
      '47% off original MRP of ₹2,999 on Myntra with active coupon FLAT200',
      'Saves ₹150 compared to next best store (AJIO at ₹1,699)',
    ],
  }),

  // 2. Kalamkari Tiered Midi Dress (Indo-Western / Dresses)
  createNormalizedProduct({
    id: 'prod-kalamkari-midi-02',
    name: 'Handcrafted Kalamkari Tiered Cotton Midi Dress',
    brand: 'Anouk Artisanal',
    category: 'dresses',
    subcategory: 'Tiered Fusion Dresses',
    currentPrice: 1199,
    originalPrice: 1799,
    rating: 4.7,
    reviewCount: 1840,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.myntra.com',
    primaryRetailerId: 'myntra',
    availability: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Earthy Rust & Indigo', 'Mustard Ochre'],
    tags: ['Kalamkari', 'Indo-Western', 'Midi Dress', 'Cotton', 'Summer Workwear', 'Under ₹1999'],
    description: 'Breezy multi-tiered A-line midi dress printed with authentic vegetable dye Kalamkari floral motifs on breathable 60-count cambric cotton.',
    normalizedGroupId: 'grp-anouk-kalamkari-midi',
    priceDropRecent: 600,
    priceDropDays: 7,
    trendVelocity: 91,
    observations: [
      { date: '60d ago', price: 1799, retailer: 'myntra' },
      { date: '30d ago', price: 1599, retailer: 'myntra' },
      { date: '14d ago', price: 1499, retailer: 'myntra' },
      { date: '7d ago', price: 1399, retailer: 'myntra' },
      { date: 'Today', price: 1199, retailer: 'myntra' },
    ],
    offers: [
      { retailerId: 'myntra', price: 1199, originalPrice: 1799, rating: 4.7, reviewCount: 1840, inStock: true, couponCode: 'SUMMERFEST', url: 'https://www.myntra.com' },
      { retailerId: 'ajio', price: 1499, originalPrice: 1799, rating: 4.6, reviewCount: 620, inStock: true, url: 'https://www.ajio.com' },
      { retailerId: 'tatacliq', price: 1599, originalPrice: 1799, rating: 4.5, reviewCount: 180, inStock: true, url: 'https://www.tatacliq.com' },
    ],
    whyTrending: [
      'Heritage blockprints paired with modern Western slip and sneaker aesthetics',
      'High breathability during humid Indian monsoon and summer seasons',
      'Over 950 saves across Indo-Western moodboards this week',
    ],
    whyGoodDeal: [
      '33% verified discount — down from ₹1,799 to ₹1,199',
      'Myntra price is ₹300 cheaper than AJIO for identical SKU',
      '4.7★ satisfaction score with high remarks on non-bleeding natural dyes',
    ],
  }),

  // 3. Wide-Leg Pleated Tailored Trousers (Workwear / Western)
  createNormalizedProduct({
    id: 'prod-pleated-trousers-03',
    name: 'High-Waist Double Pleated Wide-Leg Trousers',
    brand: 'Mango Formal',
    category: 'jeans_trousers',
    subcategory: 'Wide-Leg Trousers',
    currentPrice: 1499,
    originalPrice: 2490,
    rating: 4.5,
    reviewCount: 980,
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.tatacliq.com',
    primaryRetailerId: 'tatacliq',
    availability: 'in_stock',
    sizes: ['26', '28', '30', '32', '34'],
    colors: ['Oatmeal Heather', 'Charcoal Slate', 'Olive Moss'],
    tags: ['Workwear', 'Wide-Leg', 'Pleated', 'Old Money', 'Trousers', 'Mango'],
    description: 'Fluid drape high-rise trousers with sharp pressed front pleats, slant pockets, and an elongated wide-leg silhouette that flows over loafers or heels.',
    normalizedGroupId: 'grp-mango-wideleg-trousers',
    priceDropRecent: 450,
    priceDropDays: 20,
    trendVelocity: 88,
    observations: [
      { date: '60d ago', price: 2490, retailer: 'tatacliq' },
      { date: '30d ago', price: 2190, retailer: 'tatacliq' },
      { date: '14d ago', price: 1949, retailer: 'tatacliq' },
      { date: 'Today', price: 1499, retailer: 'tatacliq' },
    ],
    offers: [
      { retailerId: 'tatacliq', price: 1499, originalPrice: 2490, rating: 4.5, reviewCount: 980, inStock: true, couponCode: 'CLIQLUXE', url: 'https://www.tatacliq.com' },
      { retailerId: 'myntra', price: 1890, originalPrice: 2490, rating: 4.6, reviewCount: 1400, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'nykaa', price: 2240, originalPrice: 2490, rating: 4.4, reviewCount: 310, inStock: true, url: 'https://www.nykaa.com' },
    ],
    whyTrending: [
      'Tailored "corporate sleek" aesthetic driving high search volume across Tier 1 cities',
      'Effortless transition from office formal to dinner with a baby tee or blazer',
      'Comfortable relaxed cut replaces tight skinny formals',
    ],
    whyGoodDeal: [
      'Save ₹991 (40% discount) on Tata CLiQ Luxury edit',
      'Lowest rate across all Indian stockists by ₹391 over Myntra',
      'Premium polyester-viscose wrinkle-resistant blend',
    ],
  }),

  // 4. Tribe Amrapali Oxidized Silver Coin Choker (Accessories)
  createNormalizedProduct({
    id: 'prod-silver-choker-04',
    name: 'Antique Oxidized Silver Ghungroo Coin Choker',
    brand: 'Tribe Amrapali',
    category: 'accessories',
    subcategory: 'Silver Jewelry',
    currentPrice: 649,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.nykaa.com',
    primaryRetailerId: 'nykaa',
    availability: 'in_stock',
    sizes: ['Free Size (Adjustable Cord)'],
    colors: ['Antique Oxidized Silver'],
    tags: ['Jewelry', 'Choker', 'Oxidized Silver', 'Under ₹999', 'College', 'Festive'],
    description: 'Hand-cast silver-plated brass choker studded with heritage peacock coins, delicate filigree panels, and chime ghungroos with an adjustable zari dori tie.',
    normalizedGroupId: 'grp-amrapali-coin-choker',
    priceDropRecent: 350,
    priceDropDays: 10,
    trendVelocity: 96,
    observations: [
      { date: '60d ago', price: 999, retailer: 'nykaa' },
      { date: '30d ago', price: 899, retailer: 'nykaa' },
      { date: '14d ago', price: 799, retailer: 'nykaa' },
      { date: 'Today', price: 649, retailer: 'nykaa' },
    ],
    offers: [
      { retailerId: 'nykaa', price: 649, originalPrice: 999, rating: 4.8, reviewCount: 3200, inStock: true, couponCode: 'NYKGLAM', url: 'https://www.nykaa.com' },
      { retailerId: 'amazon_in', price: 749, originalPrice: 999, rating: 4.6, reviewCount: 1900, inStock: true, url: 'https://www.amazon.in' },
      { retailerId: 'myntra', price: 799, originalPrice: 999, rating: 4.7, reviewCount: 2100, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'meesho', price: 599, originalPrice: 899, rating: 4.1, reviewCount: 410, inStock: true, url: 'https://www.meesho.com' },
    ],
    whyTrending: [
      'Key accessory for the viral "Kurti + Silver Jewelry + Converse" Indian college uniform',
      'Universally matches both black western tanks and handloom Chanderi suits',
      'Over 2,100 saves in TrendStitch accessories radar this month',
    ],
    whyGoodDeal: [
      'Price dropped 35% to ₹649 (best price for verified hallmark quality)',
      'Extremely durable brass alloy with anti-tarnish coating',
      'Exceptional 4.8★ rating with over 3,200 verified reviews',
    ],
  }),

  // 5. Chunky Retro Colorblock Sneakers (Footwear / Streetwear)
  createNormalizedProduct({
    id: 'prod-sneakers-05',
    name: 'Retro 90s Colorblock Chunky Platform Sneakers',
    brand: 'Puma Select',
    category: 'footwear',
    subcategory: 'Chunky Sneakers',
    currentPrice: 2199,
    originalPrice: 4999,
    rating: 4.4,
    reviewCount: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.flipkart.com',
    primaryRetailerId: 'flipkart',
    availability: 'in_stock',
    sizes: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9'],
    colors: ['Chalk White / Teal / Coral', 'Triple Monochrome White'],
    tags: ['Sneakers', 'Streetwear', 'Chunky', 'Footwear', 'Puma', 'Huge Drop'],
    description: 'Sculpted EVA midsole with retro suede overlays, breathable mesh underlays, and high-traction rubber waffle tread.',
    normalizedGroupId: 'grp-puma-chunky-sneakers',
    priceDropRecent: 1400,
    priceDropDays: 14,
    trendVelocity: 93,
    observations: [
      { date: '60d ago', price: 4999, retailer: 'flipkart' },
      { date: '30d ago', price: 3899, retailer: 'flipkart' },
      { date: '14d ago', price: 3299, retailer: 'flipkart' },
      { date: '7d ago', price: 2699, retailer: 'flipkart' },
      { date: 'Today', price: 2199, retailer: 'flipkart' },
    ],
    offers: [
      { retailerId: 'flipkart', price: 2199, originalPrice: 4999, rating: 4.4, reviewCount: 1650, inStock: true, couponCode: 'SHOEFEST', url: 'https://www.flipkart.com' },
      { retailerId: 'myntra', price: 2499, originalPrice: 4999, rating: 4.5, reviewCount: 2200, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'amazon_in', price: 2799, originalPrice: 4999, rating: 4.3, reviewCount: 880, inStock: true, url: 'https://www.amazon.in' },
      { retailerId: 'ajio', price: 2999, originalPrice: 4999, rating: 4.4, reviewCount: 450, inStock: true, url: 'https://www.ajio.com' },
    ],
    whyTrending: [
      'Chunky silhouette balances straight-leg denim and tiered skirts perfectly',
      'All-day comfort with cushioned insole for college and city walking',
      '56% price collapse creating major spike in buyer engagement',
    ],
    whyGoodDeal: [
      'Massive 56% price drop (Save ₹2,800 off ₹4,999 MRP)',
      'Flipkart deal price is ₹300 below Myntra and ₹800 below AJIO',
      'High-grade leather and suede upper resists scuffing',
    ],
  }),

  // 6. Pre-Draped Organza Cape Ensemble (Indian / Party)
  createNormalizedProduct({
    id: 'prod-organza-cape-06',
    name: 'Raw Tussar Silk Asymmetric Cape & Palazzo Suit',
    brand: 'Suta Contemporary',
    category: 'indian',
    subcategory: 'Pre-Draped Ensembles',
    currentPrice: 2149,
    originalPrice: 3999,
    rating: 4.6,
    reviewCount: 780,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.ajio.com',
    primaryRetailerId: 'ajio',
    availability: 'in_stock',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rose Gold / Ivory', 'Powder Blue', 'Sage Green'],
    tags: ['Wedding Guest', 'Cape Suit', 'Organza', 'Suta', 'Partywear', 'Indo-Western'],
    description: 'Fluid pre-draped organza cape overlay with fine gota patti hem, worn over a tailored tussar silk inner bustier and wide-leg palazzo.',
    normalizedGroupId: 'grp-suta-tussar-cape',
    priceDropRecent: 850,
    priceDropDays: 12,
    trendVelocity: 95,
    observations: [
      { date: '60d ago', price: 3999, retailer: 'ajio' },
      { date: '30d ago', price: 3499, retailer: 'ajio' },
      { date: '14d ago', price: 2999, retailer: 'ajio' },
      { date: 'Today', price: 2149, retailer: 'ajio' },
    ],
    offers: [
      { retailerId: 'ajio', price: 2149, originalPrice: 3999, rating: 4.6, reviewCount: 780, inStock: true, couponCode: 'FESTIVE40', url: 'https://www.ajio.com' },
      { retailerId: 'nykaa', price: 2699, originalPrice: 3999, rating: 4.5, reviewCount: 420, inStock: true, url: 'https://www.nykaa.com' },
      { retailerId: 'tatacliq', price: 2899, originalPrice: 3999, rating: 4.7, reviewCount: 210, inStock: false, url: 'https://www.tatacliq.com' },
    ],
    whyTrending: [
      'Top-pinned look for 2026 Indian spring wedding guest wardrobes',
      'Modern hassle-free pre-draped cape replaces tedious saree pleats',
      'Lustrous sheen catches natural wedding event lighting beautifully',
    ],
    whyGoodDeal: [
      '46% off on AJIO Luxe edit with promo code FESTIVE40',
      'Under ₹2,200 for a multi-piece designer occasion outfit',
      'Saves ₹550 vs Nykaa Fashion listing',
    ],
  }),

  // 7. Oversized Graphic Washed Tee (Streetwear / Casual)
  createNormalizedProduct({
    id: 'prod-graphic-tee-07',
    name: 'Vintage Acid-Wash Heavyweight Oversized Tee',
    brand: 'Bonkers Corner',
    category: 'tops_shirts',
    subcategory: 'Streetwear T-Shirts',
    currentPrice: 799,
    originalPrice: 1499,
    rating: 4.5,
    reviewCount: 4120,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.amazon.in',
    primaryRetailerId: 'amazon_in',
    availability: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Washed Charcoal Smoke', 'Vintage Olive', 'Sun-Bleached Sand'],
    tags: ['Streetwear', 'T-Shirt', 'Acid Wash', 'Under ₹999', 'College', 'Unisex'],
    description: '240 GSM heavy jersey cotton with custom screen-printed typography, dropped shoulders, and a ribbed crew neckline that holds its shape.',
    normalizedGroupId: 'grp-bonkers-acidwash-tee',
    priceDropRecent: 400,
    priceDropDays: 7,
    trendVelocity: 90,
    observations: [
      { date: '60d ago', price: 1499, retailer: 'amazon_in' },
      { date: '30d ago', price: 1199, retailer: 'amazon_in' },
      { date: '14d ago', price: 999, retailer: 'amazon_in' },
      { date: 'Today', price: 799, retailer: 'amazon_in' },
    ],
    offers: [
      { retailerId: 'amazon_in', price: 799, originalPrice: 1499, rating: 4.5, reviewCount: 4120, inStock: true, couponCode: 'PRIME10', url: 'https://www.amazon.in' },
      { retailerId: 'myntra', price: 899, originalPrice: 1499, rating: 4.6, reviewCount: 1800, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'ajio', price: 949, originalPrice: 1499, rating: 4.3, reviewCount: 650, inStock: true, url: 'https://www.ajio.com' },
    ],
    whyTrending: [
      '240 GSM heavyweight drape gives that structured Korean street silhouette',
      'Top choice for pairing with parachute cargo pants and silver chains',
      'Over 4,000 verified reviews praising fabric thickness and color fastness',
    ],
    whyGoodDeal: [
      'Steal at ₹799 (47% off original ₹1,499)',
      'Lowest price recorded in 30 days',
      'Next-day Prime dispatch across major metros',
    ],
  }),

  // 8. Straight-Leg Parachute Cargo Pants (Streetwear / Casual)
  createNormalizedProduct({
    id: 'prod-cargo-pants-08',
    name: 'Multi-Pocket Parachute Utility Cargo Trousers',
    brand: 'H&M Divided',
    category: 'jeans_trousers',
    subcategory: 'Cargo Pants',
    currentPrice: 1299,
    originalPrice: 2299,
    rating: 4.6,
    reviewCount: 2890,
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.myntra.com',
    primaryRetailerId: 'myntra',
    availability: 'in_stock',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Military Khaki', 'Onyx Black', 'Stone Cement'],
    tags: ['Cargo Pants', 'Streetwear', 'Parachute', 'College', 'Under ₹1999', 'H&M'],
    description: 'Crisp water-repellent ripstop nylon trousers with 6 functional accordion utility pockets, adjustable bungee toggle cuffs, and an elasticated waistband.',
    normalizedGroupId: 'grp-hm-parachute-cargo',
    priceDropRecent: 600,
    priceDropDays: 14,
    trendVelocity: 92,
    observations: [
      { date: '60d ago', price: 2299, retailer: 'myntra' },
      { date: '30d ago', price: 1999, retailer: 'myntra' },
      { date: '14d ago', price: 1699, retailer: 'myntra' },
      { date: 'Today', price: 1299, retailer: 'myntra' },
    ],
    offers: [
      { retailerId: 'myntra', price: 1299, originalPrice: 2299, rating: 4.6, reviewCount: 2890, inStock: true, couponCode: 'STREETSTYLE', url: 'https://www.myntra.com' },
      { retailerId: 'ajio', price: 1599, originalPrice: 2299, rating: 4.4, reviewCount: 920, inStock: true, url: 'https://www.ajio.com' },
      { retailerId: 'tatacliq', price: 1799, originalPrice: 2299, rating: 4.5, reviewCount: 310, inStock: false, url: 'https://www.tatacliq.com' },
    ],
    whyTrending: [
      'Essential bottom-wear silhouette for Gen Z Indian campus fashion',
      'Adjustable bungee cords allow dual wear: relaxed wide-leg or tapered jogger',
      'Ultra-lightweight fabric keeps legs cool during warm afternoons',
    ],
    whyGoodDeal: [
      '43% discount on genuine H&M stock on Myntra',
      'Dropped ₹600 from two weeks ago',
      'Saves ₹300 compared to AJIO',
    ],
  }),

  // 9. Pure Linen Relaxed Resort Shirt (Western / Casual)
  createNormalizedProduct({
    id: 'prod-linen-shirt-09',
    name: '100% French Flax Pure Linen Camp Collar Shirt',
    brand: 'Marks & Spencer',
    category: 'tops_shirts',
    subcategory: 'Linen Shirts',
    currentPrice: 1799,
    originalPrice: 2999,
    rating: 4.7,
    reviewCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.ajio.com',
    primaryRetailerId: 'ajio',
    availability: 'in_stock',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Warm Ecru Linen', 'Terracotta Rust', 'Sage Herb'],
    tags: ['Linen', 'Old Money', 'Resort', 'Summer', 'Under ₹1999', 'Marks & Spencer'],
    description: 'Airy pure European linen with a revere camp collar, mother-of-pearl buttons, and a straight boxy hem with side vents.',
    normalizedGroupId: 'grp-ms-pure-linen-shirt',
    priceDropRecent: 700,
    priceDropDays: 14,
    trendVelocity: 89,
    observations: [
      { date: '60d ago', price: 2999, retailer: 'ajio' },
      { date: '30d ago', price: 2499, retailer: 'ajio' },
      { date: '14d ago', price: 2199, retailer: 'ajio' },
      { date: 'Today', price: 1799, retailer: 'ajio' },
    ],
    offers: [
      { retailerId: 'ajio', price: 1799, originalPrice: 2999, rating: 4.7, reviewCount: 1540, inStock: true, couponCode: 'MNS40', url: 'https://www.ajio.com' },
      { retailerId: 'myntra', price: 1999, originalPrice: 2999, rating: 4.6, reviewCount: 2100, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'tatacliq', price: 2299, originalPrice: 2999, rating: 4.5, reviewCount: 420, inStock: true, url: 'https://www.tatacliq.com' },
    ],
    whyTrending: [
      'Subtle quiet-luxury aesthetic with tactile open-weave linen texture',
      'Versatile layering piece over tank tops or buttoned up with chinos',
      'Breathable, natural thermal regulation in warm climates',
    ],
    whyGoodDeal: [
      '40% price drop on 100% genuine French linen',
      'Saves ₹200 vs Myntra and ₹500 vs Tata CLiQ',
      '4.7★ average rating with positive comments on zero post-wash shrinkage',
    ],
  }),

  // 10. Handcrafted Tan Leather Mojaris (Footwear / Indian)
  createNormalizedProduct({
    id: 'prod-tan-mojaris-10',
    name: 'Artisanal Hand-Stitched Genuine Leather Mojaris',
    brand: 'Fabindia Atelier',
    category: 'footwear',
    subcategory: 'Traditional Footwear',
    currentPrice: 1499,
    originalPrice: 2499,
    rating: 4.6,
    reviewCount: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.myntra.com',
    primaryRetailerId: 'myntra',
    availability: 'in_stock',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Vintage Burnished Tan', 'Midnight Black'],
    tags: ['Mojaris', 'Handmade', 'Leather', 'Fabindia', 'Under ₹1999', 'Festive'],
    description: 'Supple vegetable-tanned leather juttis handcrafted by Jodhpur artisans, featuring cushioned memory foam footbeds and non-slip scored leather soles.',
    normalizedGroupId: 'grp-fabindia-leather-mojaris',
    priceDropRecent: 500,
    priceDropDays: 21,
    trendVelocity: 87,
    observations: [
      { date: '60d ago', price: 2499, retailer: 'myntra' },
      { date: '30d ago', price: 2199, retailer: 'myntra' },
      { date: '14d ago', price: 1899, retailer: 'myntra' },
      { date: 'Today', price: 1499, retailer: 'myntra' },
    ],
    offers: [
      { retailerId: 'myntra', price: 1499, originalPrice: 2499, rating: 4.6, reviewCount: 1100, inStock: true, couponCode: 'HERITAGE', url: 'https://www.myntra.com' },
      { retailerId: 'tatacliq', price: 1799, originalPrice: 2499, rating: 4.5, reviewCount: 380, inStock: true, url: 'https://www.tatacliq.com' },
      { retailerId: 'nykaa', price: 1999, originalPrice: 2499, rating: 4.4, reviewCount: 220, inStock: true, url: 'https://www.nykaa.com' },
    ],
    whyTrending: [
      'Clean minimalist silhouette pairs seamlessly with linen kurtas and cuffed selvedge jeans',
      'Padded footbed solves the classic break-in blister issue of traditional juttis',
      'Over 700 wishlist saves leading into wedding season',
    ],
    whyGoodDeal: [
      '40% markdown on Fabindia craft collection',
      'Genuine full-grain leather for under ₹1,500',
      '₹300 price advantage on Myntra over Tata CLiQ',
    ],
  }),

  // 11. Minimalist Structured Crossbody Bag (Bags / Accessories)
  createNormalizedProduct({
    id: 'prod-crossbody-bag-11',
    name: 'Vegan Leather Saddle Flap Crossbody Bag',
    brand: 'Miraggio Luxe',
    category: 'bags',
    subcategory: 'Crossbody Bags',
    currentPrice: 1699,
    originalPrice: 3499,
    rating: 4.7,
    reviewCount: 2150,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.nykaa.com',
    primaryRetailerId: 'nykaa',
    availability: 'in_stock',
    sizes: ['Medium (24cm x 16cm x 7cm)'],
    colors: ['Rich Cognac Brown', 'Matte Black', 'Olive Khaki'],
    tags: ['Bags', 'Crossbody', 'Vegan Leather', 'Workwear', 'College', 'Miraggio'],
    description: 'Architectural curved saddle bag in scratch-resistant micro-pebble vegan leather with custom pale gold turn-lock hardware and dual detachable straps.',
    normalizedGroupId: 'grp-miraggio-saddle-bag',
    priceDropRecent: 900,
    priceDropDays: 14,
    trendVelocity: 94,
    observations: [
      { date: '60d ago', price: 3499, retailer: 'nykaa' },
      { date: '30d ago', price: 2999, retailer: 'nykaa' },
      { date: '14d ago', price: 2399, retailer: 'nykaa' },
      { date: 'Today', price: 1699, retailer: 'nykaa' },
    ],
    offers: [
      { retailerId: 'nykaa', price: 1699, originalPrice: 3499, rating: 4.7, reviewCount: 2150, inStock: true, couponCode: 'BAGFEST', url: 'https://www.nykaa.com' },
      { retailerId: 'myntra', price: 1899, originalPrice: 3499, rating: 4.6, reviewCount: 1400, inStock: true, url: 'https://www.myntra.com' },
      { retailerId: 'amazon_in', price: 1999, originalPrice: 3499, rating: 4.5, reviewCount: 890, inStock: true, url: 'https://www.amazon.in' },
      { retailerId: 'ajio', price: 2299, originalPrice: 3499, rating: 4.4, reviewCount: 310, inStock: true, url: 'https://www.ajio.com' },
    ],
    whyTrending: [
      'Sleek curved design mirrors luxury European saddle bag profiles at 1/10th price',
      'Dual straps: wide webbing guitar strap for college and leather strap for evening',
      'High save rate across Delhi & Mumbai campus fashion boards',
    ],
    whyGoodDeal: [
      'Steep 51% drop (Save ₹1,800 off original ₹3,499)',
      'Lowest rate across all Indian marketplaces on Nykaa',
      'Solid 4.7★ review score praising premium hardware and stitch quality',
    ],
  }),

  // 12. Bagru Indigo Handblock Mulmul Kurti (Indian / College)
  createNormalizedProduct({
    id: 'prod-bagru-kurti-12',
    name: 'Authentic Bagru Indigo Dabu Print Mulmul Kurta',
    brand: 'Taavi Handcrafts',
    category: 'indian',
    subcategory: 'Handblock Kurtis',
    currentPrice: 749,
    originalPrice: 1499,
    rating: 4.6,
    reviewCount: 3450,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    productUrl: 'https://www.myntra.com',
    primaryRetailerId: 'myntra',
    availability: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Natural Indigo Blue & Ivory'],
    tags: ['Kurti', 'Handloom', 'Indigo', 'Under ₹999', 'College', 'Taavi'],
    description: 'Featherlight 100% fine cotton mulmul straight kurta printed using natural indigo vat dyes and mud-resist Dabu blocks in Bagru, Rajasthan.',
    normalizedGroupId: 'grp-taavi-bagru-kurti',
    priceDropRecent: 350,
    priceDropDays: 14,
    trendVelocity: 93,
    observations: [
      { date: '60d ago', price: 1499, retailer: 'myntra' },
      { date: '30d ago', price: 1199, retailer: 'myntra' },
      { date: '14d ago', price: 999, retailer: 'myntra' },
      { date: 'Today', price: 749, retailer: 'myntra' },
    ],
    offers: [
      { retailerId: 'myntra', price: 749, originalPrice: 1499, rating: 4.6, reviewCount: 3450, inStock: true, couponCode: 'INDIE50', url: 'https://www.myntra.com' },
      { retailerId: 'flipkart', price: 849, originalPrice: 1499, rating: 4.4, reviewCount: 1200, inStock: true, url: 'https://www.flipkart.com' },
      { retailerId: 'meesho', price: 699, originalPrice: 1299, rating: 4.2, reviewCount: 540, inStock: true, url: 'https://www.meesho.com' },
    ],
    whyTrending: [
      'The #1 college staple piece across North & West India universities',
      'Lightweight mulmul is exceptionally soft and keeps skin breathing',
      'Pairs with straight-leg blue denim and silver hoops for effortless Indo-Western looks',
    ],
    whyGoodDeal: [
      '50% price cut down to ₹749 for authentic GI-tagged artisan craft',
      'Saves ₹100 over Flipkart with faster 2-day delivery on Myntra',
      'Natural indigo dye softens with each wash without fading',
    ],
  }),
];

export const TREND_COLLECTIONS: TrendCollection[] = [
  {
    id: 'coll-trending-now',
    title: '🔥 Trending Now',
    subtitle: 'Fastest-moving items based on verified search spikes and save velocity',
    badge: 'High Velocity',
    productIds: ['prod-denim-jacket-01', 'prod-organza-cape-06', 'prod-crossbody-bag-11', 'prod-sneakers-05'],
  },
  {
    id: 'coll-biggest-drops',
    title: '📉 Biggest Price Drops',
    subtitle: 'Verified price drops exceeding 35% across Myntra, AJIO & Tata CLiQ',
    badge: 'Save up to 56%',
    productIds: ['prod-sneakers-05', 'prod-crossbody-bag-11', 'prod-denim-jacket-01', 'prod-organza-cape-06'],
  },
  {
    id: 'coll-highly-rated',
    title: '⭐ Highly Rated Deals',
    subtitle: 'Items holding 4.5★ or higher across 1,000+ customer reviews',
    badge: '4.6★+ Verified',
    productIds: ['prod-silver-choker-04', 'prod-kalamkari-midi-02', 'prod-linen-shirt-09', 'prod-bagru-kurti-12'],
  },
  {
    id: 'coll-under-999',
    title: '🏷️ Under ₹999 Steals',
    subtitle: 'Affordable campus and daily finds with high build quality',
    badge: 'Budget Picks',
    productIds: ['prod-silver-choker-04', 'prod-graphic-tee-07', 'prod-bagru-kurti-12'],
  },
  {
    id: 'coll-under-1999',
    title: '💎 Sweetspot Deals (Under ₹1,999)',
    subtitle: 'Heavyweight jackets, tailored trousers, and premium midi dresses',
    badge: 'Top Value',
    productIds: ['prod-denim-jacket-01', 'prod-kalamkari-midi-02', 'prod-pleated-trousers-03', 'prod-cargo-pants-08', 'prod-linen-shirt-09', 'prod-tan-mojaris-10', 'prod-crossbody-bag-11'],
  },
];
