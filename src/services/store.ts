import {
  Product,
  SavedProduct,
  NotificationItem,
  SearchFilters,
  DataSourceConfig,
  Retailer,
  FashionCategory,
} from '../types';
import { catalogDb } from './catalogDatabase';
import { getAllRetailers } from './retailerAdapters';

const STORAGE_KEY_SAVED = 'trendstitch_saved_products_v4';
const STORAGE_KEY_NOTIFS = 'trendstitch_notifications_v4';
const STORAGE_KEY_CONFIG = 'trendstitch_datasource_config_v4';
const STORAGE_KEY_PRODUCTS = 'trendstitch_canonical_products_v4';

export class TrendStitchStore {
  private products: Product[] = [];
  private saved: Map<string, SavedProduct> = new Map();
  private notifications: NotificationItem[] = [];
  private config: DataSourceConfig = {
    mode: 'demo',
    pollingIntervalHours: 4,
  };
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // Always obtain verified deduplicated canonical catalog (1,000+ unique canonical products)
    this.products = catalogDb.getAllProducts();

    // Load saved
    try {
      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) {
        const parsed: SavedProduct[] = JSON.parse(storedSaved);
        parsed.forEach((item) => this.saved.set(item.productId, item));
      } else {
        // Pre-populate initial saved items with valid canonical product IDs
        const p1 = this.products[0];
        const p2 = this.products[1];
        const initialSaved: SavedProduct[] = [
          {
            id: 'saved-1',
            productId: p1 ? p1.id : 'CP001',
            savedAt: '14 days ago',
            initialPrice: p1 ? p1.originalPrice : 2999,
            previousPrice: p1 ? Math.round(p1.currentPrice * 1.1) : 1999,
            currentPrice: p1 ? p1.currentPrice : 1799,
            targetPrice: p1 ? p1.currentPrice : 1800,
            alertConfig: {
              notifyOnDrop: true,
              notifyOnTarget: true,
              notifyOnBackInStock: true,
              targetPrice: p1 ? p1.currentPrice : 1800,
            },
          },
          {
            id: 'saved-2',
            productId: p2 ? p2.id : 'CP002',
            savedAt: '10 days ago',
            initialPrice: p2 ? p2.originalPrice : 3499,
            previousPrice: p2 ? Math.round(p2.currentPrice * 1.1) : 2499,
            currentPrice: p2 ? p2.currentPrice : 2299,
            targetPrice: p2 ? p2.currentPrice : 2300,
            alertConfig: {
              notifyOnDrop: true,
              notifyOnTarget: true,
              notifyOnBackInStock: true,
              targetPrice: p2 ? p2.currentPrice : 2300,
            },
          },
        ];
        initialSaved.forEach((item) => this.saved.set(item.productId, item));
        this.persistSaved();
      }
    } catch {
      // Fallback
    }

    // Load notifications
    try {
      const storedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (storedNotifs) {
        this.notifications = JSON.parse(storedNotifs);
      } else {
        this.notifications = [
          {
            id: 'notif-drop-1',
            type: 'price_drop',
            title: 'Price Drop Verified',
            message: 'The Heavyweight Boxy Washed Denim Jacket you saved dropped from ₹1,899 → ₹1,599 on Myntra.',
            productId: 'prod-denim-jacket-01',
            productName: 'Heavyweight Boxy Washed Denim Trucker Jacket',
            productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
            oldPrice: 1899,
            newPrice: 1599,
            retailerName: 'Myntra',
            timestamp: '14 mins ago',
            isRead: false,
          },
          {
            id: 'notif-target-2',
            type: 'target_reached',
            title: 'Target Price Reached',
            message: 'Raw Tussar Silk Asymmetric Cape dropped to ₹2,149 on AJIO (below your ₹2,200 alert target).',
            productId: 'prod-organza-cape-06',
            productName: 'Raw Tussar Silk Asymmetric Cape & Palazzo Suit',
            productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
            oldPrice: 2999,
            newPrice: 2149,
            retailerName: 'AJIO',
            timestamp: '2 hours ago',
            isRead: false,
          },
          {
            id: 'notif-drop-3',
            type: 'price_drop',
            title: 'Price Drop Verified',
            message: 'Handcrafted Kalamkari Cotton Midi Dress dropped ₹300 today on Myntra (now ₹1,199).',
            productId: 'prod-kalamkari-midi-02',
            productName: 'Handcrafted Kalamkari Tiered Cotton Midi Dress',
            productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
            oldPrice: 1499,
            newPrice: 1199,
            retailerName: 'Myntra',
            timestamp: '5 hours ago',
            isRead: false,
          },
        ];
        this.persistNotifs();
      }
    } catch {
      // Fallback
    }

    // Load config
    try {
      const storedCfg = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (storedCfg) {
        this.config = JSON.parse(storedCfg);
      }
    } catch {
      // Fallback
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  private persistSaved() {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(Array.from(this.saved.values())));
    } catch {}
  }

  private persistNotifs() {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
    } catch {}
  }

  private persistConfig() {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch {}
  }

  private persistProducts() {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
    } catch {}
  }

  // --- Public Getters & Actions ---

  public getProducts(): Product[] {
    return this.products;
  }

  public getRetailers(): Retailer[] {
    return getAllRetailers();
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getSavedItems(): { product: Product; savedMeta: SavedProduct }[] {
    const results: { product: Product; savedMeta: SavedProduct }[] = [];
    this.saved.forEach((savedMeta, productId) => {
      const product = this.getProductById(productId);
      if (product) {
        // keep current price in sync
        savedMeta.currentPrice = product.currentPrice;
        results.push({ product, savedMeta });
      }
    });
    return results;
  }

  public getSavedDroppedCount(): number {
    let count = 0;
    this.saved.forEach((savedMeta, productId) => {
      const product = this.getProductById(productId);
      if (product && product.currentPrice < savedMeta.initialPrice) {
        count++;
      }
    });
    return count;
  }

  public isSaved(productId: string): boolean {
    return this.saved.has(productId);
  }

  public toggleSave(productId: string, targetPrice?: number): boolean {
    const product = this.getProductById(productId);
    if (!product) return false;

    if (this.saved.has(productId)) {
      this.saved.delete(productId);
      this.persistSaved();
      this.notify();
      return false;
    } else {
      const newSaved: SavedProduct = {
        id: `saved-${Date.now()}`,
        productId,
        savedAt: 'Just now',
        initialPrice: product.currentPrice,
        previousPrice: product.currentPrice,
        currentPrice: product.currentPrice,
        targetPrice: targetPrice || Math.round(product.currentPrice * 0.85),
        alertConfig: {
          notifyOnDrop: true,
          notifyOnTarget: true,
          notifyOnBackInStock: true,
          targetPrice: targetPrice || Math.round(product.currentPrice * 0.85),
        },
      };
      this.saved.set(productId, newSaved);
      this.persistSaved();
      this.notify();
      return true;
    }
  }

  public updateAlertTarget(productId: string, targetPrice: number) {
    const savedMeta = this.saved.get(productId);
    if (savedMeta) {
      savedMeta.targetPrice = targetPrice;
      savedMeta.alertConfig.targetPrice = targetPrice;
      this.persistSaved();
      this.notify();
    }
  }

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public getUnreadNotifCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  public markNotifRead(id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      this.persistNotifs();
      this.notify();
    }
  }

  public markAllNotifsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.persistNotifs();
    this.notify();
  }

  public getConfig(): DataSourceConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<DataSourceConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.persistConfig();
    this.notify();
  }

  // Search & Filter Engine
  public searchProducts(filters: SearchFilters): Product[] {
    let result = [...this.products];

    // Query Search
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();

      // Special semantic queries:
      // "under 2000" / "under 1500" / "under 999"
      const underMatch = q.match(/under\s*₹?\s*(\d+)/i);
      let queryPriceCap: number | null = null;
      if (underMatch) {
        queryPriceCap = parseInt(underMatch[1], 10);
      }

      // "4.5 star" / "4+ star"
      const ratingMatch = q.match(/(\d(\.\d)?)\s*(star|★)/i);
      let queryMinRating: number | null = null;
      if (ratingMatch) {
        queryMinRating = parseFloat(ratingMatch[1]);
      }

      // "40%+ discount" / "50% off"
      const discountMatch = q.match(/(\d+)%\s*(off|discount)/i);
      let queryMinDiscount: number | null = null;
      if (discountMatch) {
        queryMinDiscount = parseInt(discountMatch[1], 10);
      }

      result = result.filter((p) => {
        // Price cap filter
        if (queryPriceCap !== null && p.currentPrice > queryPriceCap) return false;
        // Rating filter
        if (queryMinRating !== null && p.rating < queryMinRating) return false;
        // Discount filter
        if (queryMinDiscount !== null && p.discountPercent < queryMinDiscount) return false;

        // Clean query terms for textual matching
        const cleanQ = q
          .replace(/under\s*₹?\s*\d+/gi, '')
          .replace(/\d(\.\d)?\s*(star|★)/gi, '')
          .replace(/\d+%\s*(off|discount)/gi, '')
          .trim();

        if (!cleanQ) return true;

        const haystack = `${p.name} ${p.brand} ${p.subcategory} ${p.tags.join(' ')} ${p.description} ${p.colors.join(' ')}`.toLowerCase();
        
        // Tokenize query words
        const terms = cleanQ.split(/\s+/).filter(Boolean);
        return terms.every((term) => haystack.includes(term));
      });
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Retailer filter
    if (filters.retailers && filters.retailers.length > 0) {
      result = result.filter((p) => filters.retailers.includes(p.primaryRetailerId));
    }

    // Min / Max Price
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.currentPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.currentPrice <= filters.maxPrice!);
    }

    // Min Rating
    if (filters.minRating !== undefined && filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating!);
    }

    // Min Discount
    if (filters.minDiscount !== undefined && filters.minDiscount > 0) {
      result = result.filter((p) => p.discountPercent >= filters.minDiscount!);
    }

    // In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((p) => p.availability !== 'out_of_stock');
    }

    // Min Trend Score
    if (filters.minTrendScore !== undefined && filters.minTrendScore > 0) {
      result = result.filter((p) => p.scores.trendScore >= filters.minTrendScore!);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'score':
        result.sort((a, b) => b.scores.overallScore - a.scores.overallScore);
        break;
      case 'price_drop':
        result.sort((a, b) => b.scores.priceDropScore - a.scores.priceDropScore);
        break;
      case 'price_asc':
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price_desc':
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.scores.trendScore - a.scores.trendScore);
        break;
      default:
        result.sort((a, b) => b.scores.overallScore - a.scores.overallScore);
    }

    return result;
  }

  // Simulation / Ingestion Trigger for testing price drops & alerts
  public triggerSimulatedPriceScan(): { updatedCount: number; newDrops: number } {
    let newDrops = 0;
    
    // Pick a couple items to simulate a price reduction
    this.products.forEach((p) => {
      if (p.id === 'prod-cargo-pants-08') {
        const oldPrice = p.currentPrice;
        p.currentPrice = 1149; // dropped from 1299
        p.discountPercent = 50;
        p.priceHistory.observations.push({
          timestamp: 'Just now',
          price: 1149,
          originalPrice: p.originalPrice,
          discountPercent: 50,
          retailerId: p.primaryRetailerId,
          isLowest: true,
          verifiedSource: 'demo_snapshot',
        });
        p.priceHistory.lowestObservedPrice = 1149;
        
        // If user had this saved, trigger an alert!
        if (this.saved.has(p.id)) {
          newDrops++;
          this.notifications.unshift({
            id: `notif-${Date.now()}`,
            type: 'price_drop',
            title: 'Price Drop Alert',
            message: `${p.name} dropped from ₹${oldPrice} → ₹1,149 on Myntra.`,
            productId: p.id,
            productName: p.name,
            productImage: p.imageUrl,
            oldPrice,
            newPrice: 1149,
            retailerName: 'Myntra',
            timestamp: 'Just now',
            isRead: false,
          });
        }
      }
    });

    this.persistProducts();
    this.persistNotifs();
    this.notify();

    return { updatedCount: this.products.length, newDrops };
  }
}

export const store = new TrendStitchStore();
