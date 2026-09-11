import { RetailerId, Retailer, ProductOffer } from '../types';

export interface RetailerAdapter {
  id: RetailerId;
  name: string;
  color: string;
  baseUrl: string;
  authStatus: 'connected' | 'demo' | 'not_connected';
  affiliateSupported: boolean;
  apiConnected: boolean;
  productCount: number;
  lastSyncTime?: string;
  generateAffiliateUrl: (productUrl: string, associateTag?: string) => string;
  normalizeOffer: (raw: any) => ProductOffer;
  testConnection: () => Promise<{ success: boolean; message: string }>;
}

export class MyntraAdapter implements RetailerAdapter {
  id: RetailerId = 'myntra';
  name = 'Myntra';
  color = '#E11B55';
  baseUrl = 'https://www.myntra.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 384;
  lastSyncTime = 'Today, 18:45 IST';

  generateAffiliateUrl(productUrl: string, associateTag = 'trendstitch-21'): string {
    const url = new URL(productUrl);
    url.searchParams.set('utm_source', 'trendstitch_affiliate');
    url.searchParams.set('utm_medium', 'discovery_engine');
    url.searchParams.set('aff_id', associateTag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `myntra-${Date.now()}`,
      retailerId: 'myntra',
      retailerName: 'Myntra',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.2,
      reviewCount: raw.reviewCount || 150,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      couponCode: raw.couponCode || 'MYNTRA200',
      deliveryEstimateDays: 2,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Myntra Partner API requires authorized enterprise credentials. Operating on validated Demo Catalog.',
    };
  }
}

export class AjioAdapter implements RetailerAdapter {
  id: RetailerId = 'ajio';
  name = 'AJIO';
  color = '#2C4152';
  baseUrl = 'https://www.ajio.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 296;
  lastSyncTime = 'Today, 19:10 IST';

  generateAffiliateUrl(productUrl: string, associateTag = 'ts_ajio_feed'): string {
    const url = new URL(productUrl);
    url.searchParams.set('source', 'trendstitch_partner');
    url.searchParams.set('ref', associateTag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `ajio-${Date.now()}`,
      retailerId: 'ajio',
      retailerName: 'AJIO',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.1,
      reviewCount: raw.reviewCount || 95,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      couponCode: raw.couponCode || 'TRENDS30',
      deliveryEstimateDays: 3,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'AJIO Affiliate Ingestion requires authorized token. Operating on validated Demo Catalog.',
    };
  }
}

export class TataCliqAdapter implements RetailerAdapter {
  id: RetailerId = 'tatacliq';
  name = 'Tata CLiQ';
  color = '#B91C1C';
  baseUrl = 'https://www.tatacliq.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 142;
  lastSyncTime = 'Today, 17:30 IST';

  generateAffiliateUrl(productUrl: string, tag = 'tata_ts_partner'): string {
    const url = new URL(productUrl);
    url.searchParams.set('cliq_aff', tag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `tatacliq-${Date.now()}`,
      retailerId: 'tatacliq',
      retailerName: 'Tata CLiQ',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.3,
      reviewCount: raw.reviewCount || 88,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      couponCode: 'CLIQLUXE',
      deliveryEstimateDays: 3,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Tata CLiQ Enterprise feed not connected. Operating in transparent Demo Mode.',
    };
  }
}

export class NykaaAdapter implements RetailerAdapter {
  id: RetailerId = 'nykaa';
  name = 'Nykaa Fashion';
  color = '#FC2779';
  baseUrl = 'https://www.nykaafashion.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 118;
  lastSyncTime = 'Today, 18:00 IST';

  generateAffiliateUrl(productUrl: string, tag = 'nykaa_ts'): string {
    const url = new URL(productUrl);
    url.searchParams.set('utm_source', 'trendstitch');
    url.searchParams.set('aff', tag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `nykaa-${Date.now()}`,
      retailerId: 'nykaa',
      retailerName: 'Nykaa Fashion',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.4,
      reviewCount: raw.reviewCount || 120,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      couponCode: 'FIRST100',
      deliveryEstimateDays: 2,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Nykaa Fashion API requires merchant authorization.',
    };
  }
}

export class MeeshoAdapter implements RetailerAdapter {
  id: RetailerId = 'meesho';
  name = 'Meesho';
  color = '#9C27B0';
  baseUrl = 'https://www.meesho.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = false;
  apiConnected = false;
  productCount = 92;
  lastSyncTime = 'Today, 16:20 IST';

  generateAffiliateUrl(productUrl: string): string {
    return productUrl;
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `meesho-${Date.now()}`,
      retailerId: 'meesho',
      retailerName: 'Meesho',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 3.9,
      reviewCount: raw.reviewCount || 340,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      deliveryEstimateDays: 4,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Meesho API connector in sandbox mode.',
    };
  }
}

export class FlipkartAdapter implements RetailerAdapter {
  id: RetailerId = 'flipkart';
  name = 'Flipkart';
  color = '#2874F0';
  baseUrl = 'https://www.flipkart.com';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 164;
  lastSyncTime = 'Today, 19:40 IST';

  generateAffiliateUrl(productUrl: string, affTag = 'trendstitch'): string {
    const url = new URL(productUrl);
    url.searchParams.set('affid', affTag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `flipkart-${Date.now()}`,
      retailerId: 'flipkart',
      retailerName: 'Flipkart',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.2,
      reviewCount: raw.reviewCount || 420,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      deliveryEstimateDays: 2,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Flipkart Affiliate API requires active tracking key.',
    };
  }
}

export class AmazonAdapter implements RetailerAdapter {
  id: RetailerId = 'amazon_in';
  name = 'Amazon India';
  color = '#FF9900';
  baseUrl = 'https://www.amazon.in';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 210;
  lastSyncTime = 'Today, 20:15 IST';

  generateAffiliateUrl(productUrl: string, tag = 'trendstitch-in-21'): string {
    const url = new URL(productUrl);
    url.searchParams.set('tag', tag);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `amazon-${Date.now()}`,
      retailerId: 'amazon_in',
      retailerName: 'Amazon India',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.3,
      reviewCount: raw.reviewCount || 580,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      deliveryEstimateDays: 1,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'Amazon Product Advertising API (PA-API 5.0) credentials required.',
    };
  }
}

export class SheinAdapter implements RetailerAdapter {
  id: RetailerId = 'shein_in';
  name = 'SHEIN India';
  color = '#000000';
  baseUrl = 'https://www.shein.in';
  authStatus: 'connected' | 'demo' | 'not_connected' = 'demo';
  affiliateSupported = true;
  apiConnected = false;
  productCount = 85;
  lastSyncTime = 'Today, 15:45 IST';

  generateAffiliateUrl(productUrl: string, aff = 'shein_ts'): string {
    const url = new URL(productUrl);
    url.searchParams.set('aff_id', aff);
    return url.toString();
  }

  normalizeOffer(raw: any): ProductOffer {
    return {
      id: raw.id || `shein-${Date.now()}`,
      retailerId: 'shein_in',
      retailerName: 'SHEIN India',
      price: raw.price,
      originalPrice: raw.originalPrice || raw.price,
      discountPercent: Math.round(((raw.originalPrice - raw.price) / raw.originalPrice) * 100) || 0,
      rating: raw.rating || 4.1,
      reviewCount: raw.reviewCount || 210,
      inStock: raw.inStock !== false,
      productUrl: raw.productUrl || this.baseUrl,
      deliveryEstimateDays: 5,
      lastVerifiedTimestamp: new Date().toISOString(),
      isBestPrice: false,
    };
  }

  async testConnection() {
    return {
      success: false,
      message: 'SHEIN Global Feed requires authorized client secret.',
    };
  }
}

export const RETAILER_ADAPTERS: Record<RetailerId, RetailerAdapter> = {
  myntra: new MyntraAdapter(),
  ajio: new AjioAdapter(),
  tatacliq: new TataCliqAdapter(),
  nykaa: new NykaaAdapter(),
  meesho: new MeeshoAdapter(),
  flipkart: new FlipkartAdapter(),
  amazon_in: new AmazonAdapter(),
  shein_in: new SheinAdapter(),
};

export const getAllRetailers = (): Retailer[] => {
  return Object.values(RETAILER_ADAPTERS).map((adapter) => ({
    id: adapter.id,
    name: adapter.name,
    color: adapter.color,
    affiliateSupported: adapter.affiliateSupported,
    apiConnected: adapter.apiConnected,
    authStatus: adapter.authStatus,
    lastSyncTime: adapter.lastSyncTime,
    productCount: adapter.productCount,
  }));
};
