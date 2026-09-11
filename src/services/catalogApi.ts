import { CatalogQueryParams, catalogDb } from './catalogDatabase';
import { CatalogQueryResponse, Product, Retailer } from '../types';

export class CatalogApiService {
  /**
   * Fetches paginated, filtered, sorted products from the Catalog Engine.
   * Performs standard query string mapping matching /products?page=1&limit=40&category=...
   */
  static async getProducts(params: CatalogQueryParams = {}): Promise<CatalogQueryResponse> {
    const urlParams = new URLSearchParams();
    if (params.page) urlParams.set('page', params.page.toString());
    if (params.limit) urlParams.set('limit', params.limit.toString());
    if (params.query) urlParams.set('q', params.query);
    if (params.category) urlParams.set('category', params.category);
    if (params.retailer) urlParams.set('retailer', params.retailer);
    if (params.brand) urlParams.set('brand', params.brand);
    if (params.minPrice) urlParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) urlParams.set('maxPrice', params.maxPrice.toString());
    if (params.minDiscount) urlParams.set('minDiscount', params.minDiscount.toString());
    if (params.minRating) urlParams.set('minRating', params.minRating.toString());
    if (params.color) urlParams.set('color', params.color);
    if (params.size) urlParams.set('size', params.size);
    if (params.section) urlParams.set('section', params.section);
    if (params.inventoryScope) urlParams.set('inventoryScope', params.inventoryScope);
    if (params.sortBy) urlParams.set('sort', params.sortBy);

    // Attempt network fetch to /api/products if server is active, with seamless local fallback
    try {
      const res = await fetch(`/api/products?${urlParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback seamlessly to local indexed database engine
    }

    // Direct in-engine query execution (instant, <5ms)
    return catalogDb.queryProducts(params);
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return catalogDb.getProductById(id) || null;
  }

  static async getRetailers(): Promise<Retailer[]> {
    try {
      const res = await fetch('/api/retailers');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return catalogDb.getRetailers();
  }

  static async getCatalogStats() {
    return {
      totalProducts: catalogDb.getProductCount(),
      retailersCount: 8,
      categoriesCount: 25,
      priceDropsToday: 260,
      mode: 'Demo data (8 retailers indexed, real APIs connectable in settings)',
    };
  }
}
