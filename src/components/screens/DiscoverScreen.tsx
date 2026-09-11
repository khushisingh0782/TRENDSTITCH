import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  TrendingDown,
  Sparkles,
  Star,
  Database,
  Tag,
  Check,
  ChevronDown,
  Loader2,
  RefreshCw,
  Sliders,
  Flame,
  Shirt,
  Sparkle,
} from 'lucide-react';
import { Product, FashionCategory, RetailerId } from '../../types';
import { ProductCard } from '../ProductCard';
import { CatalogApiService } from '../../services/catalogApi';
import { CatalogQueryParams } from '../../services/catalogDatabase';

interface DiscoverScreenProps {
  products: Product[];
  savedItemIds: Set<string>;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
  onOpenDataSourceSettings: () => void;
  onOpenCatalogHealth?: () => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  savedItemIds,
  onToggleSave,
  onSelectProduct,
  onOpenDataSourceSettings,
  onOpenCatalogHealth,
}) => {
  // Query & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryScope, setInventoryScope] = useState<'all' | 'verified_real' | 'demo_seeded'>('all');
  const [activeSection, setActiveSection] = useState<CatalogQueryParams['section']>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRetailers, setSelectedRetailers] = useState<RetailerId[]>([]);
  const [selectedSort, setSelectedSort] = useState<CatalogQueryParams['sortBy']>('trending');
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination & Catalog Results State
  const [page, setPage] = useState(1);
  const limit = 32;
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Curated category & section tabs
  const sectionTabs: { id: CatalogQueryParams['section']; label: string; icon?: any }[] = [
    { id: 'all', label: 'All Unique Products (1,000+)' },
    { id: 'trending', label: 'Trending Now' },
    { id: 'aesthetic_picks', label: 'Aesthetic Picks' },
    { id: 'biggest_drops', label: 'Biggest Price Drops' },
    { id: 'best_reviewed', label: 'Best Reviewed' },
    { id: 'under_999', label: 'Under ₹999' },
    { id: 'under_1499', label: 'Under ₹1,499' },
    { id: 'streetwear', label: 'Streetwear' },
    { id: 'western', label: 'Western' },
    { id: 'indo_western', label: 'Indo-Western' },
    { id: 'college', label: 'College Edits' },
    { id: 'party', label: 'Partywear' },
    { id: 'workwear', label: 'Workwear' },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Tops & Blouses', value: 'tops' },
    { label: 'Shirts', value: 'shirts' },
    { label: 'T-Shirts & Tanks', value: 't_shirts' },
    { label: 'Jeans & Denim', value: 'jeans' },
    { label: 'Trousers & Pants', value: 'trousers' },
    { label: 'Co-ord Sets', value: 'co_ords' },
    { label: 'Jackets & Blazers', value: 'jackets' },
    { label: 'Sweaters & Hoodies', value: 'sweaters' },
    { label: 'Indian Wear', value: 'indian' },
    { label: 'Indo-Western', value: 'indo_western' },
    { label: 'Footwear & Sneakers', value: 'footwear' },
    { label: 'Bags & Totes', value: 'bags' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Accessories', value: 'accessories' },
  ];

  const retailers: { label: string; value: RetailerId; color: string }[] = [
    { label: 'Myntra', value: 'myntra', color: '#E11B55' },
    { label: 'AJIO', value: 'ajio', color: '#2C4152' },
    { label: 'Amazon India', value: 'amazon_in', color: '#FF9900' },
    { label: 'Tata CLiQ', value: 'tatacliq', color: '#B91C1C' },
    { label: 'Nykaa Fashion', value: 'nykaa', color: '#FC2779' },
    { label: 'Flipkart', value: 'flipkart', color: '#2874F0' },
    { label: 'Meesho', value: 'meesho', color: '#9C27B0' },
    { label: 'SHEIN India', value: 'shein_in', color: '#161616' },
  ];

  // Fetch initial page or refetch upon query change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setPage(1);

    const queryParams: CatalogQueryParams = {
      page: 1,
      limit,
      query: searchQuery,
      section: activeSection,
      inventoryScope,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      retailer: selectedRetailers.length === 1 ? selectedRetailers[0] : undefined,
      sortBy: selectedSort,
      minRating: minRating > 0 ? minRating : undefined,
      minDiscount: minDiscount > 0 ? minDiscount : undefined,
      maxPrice: maxPrice,
      inStockOnly: inStockOnly,
    };

    CatalogApiService.getProducts(queryParams)
      .then((res) => {
        if (!isCancelled) {
          let prods = res.products;
          // If multi-retailer selected (>1), filter locally
          if (selectedRetailers.length > 1) {
            prods = prods.filter((p) => selectedRetailers.includes(p.primaryRetailerId));
          }
          setDisplayedProducts(prods);
          setTotalCount(res.total);
          setTotalPages(res.totalPages);
          setHasMore(res.hasMore);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [
    searchQuery,
    inventoryScope,
    activeSection,
    selectedCategory,
    selectedRetailers,
    selectedSort,
    minRating,
    minDiscount,
    maxPrice,
    inStockOnly,
  ]);

  // Load More Handler (Pagination)
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await CatalogApiService.getProducts({
        page: nextPage,
        limit,
        query: searchQuery,
        section: activeSection,
        inventoryScope,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        retailer: selectedRetailers.length === 1 ? selectedRetailers[0] : undefined,
        sortBy: selectedSort,
        minRating: minRating > 0 ? minRating : undefined,
        minDiscount: minDiscount > 0 ? minDiscount : undefined,
        maxPrice: maxPrice,
        inStockOnly: inStockOnly,
      });

      let nextProds = res.products;
      if (selectedRetailers.length > 1) {
        nextProds = nextProds.filter((p) => selectedRetailers.includes(p.primaryRetailerId));
      }

      setDisplayedProducts((prev) => [...prev, ...nextProds]);
      setPage(nextPage);
      setHasMore(res.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRetailerToggle = (r: RetailerId) => {
    if (selectedRetailers.includes(r)) {
      setSelectedRetailers(selectedRetailers.filter((id) => id !== r));
    } else {
      setSelectedRetailers([...selectedRetailers, r]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveSection('all');
    setSelectedCategory('all');
    setSelectedRetailers([]);
    setMinRating(0);
    setMinDiscount(0);
    setMaxPrice(undefined);
    setInStockOnly(false);
    setSelectedSort('trending');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedRetailers.length > 0 ||
    minRating > 0 ||
    minDiscount > 0 ||
    maxPrice !== undefined ||
    inStockOnly ||
    selectedSort !== 'trending';

  return (
    <div className="pb-28 pt-2 max-w-5xl mx-auto px-4 space-y-5">
      {/* 1. DATA SOURCE TRANSPARENCY & SCALE BANNER */}
      <div className="flex flex-wrap items-center justify-between bg-[#F5F1EB] border border-[#EAE5DE] px-3.5 py-2 text-[10px] gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[#161616]">
            DATA ENGINE: {totalCount.toLocaleString('en-IN')} UNIQUE CANONICAL PRODUCTS • DEDUPLICATED ACROSS 8 RETAILERS
          </span>
          <span className="text-[#8E8A85] hidden md:inline">
            • 1 Product = 1 Card
          </span>
        </div>
        <button
          onClick={onOpenDataSourceSettings}
          className="text-[#C83818] font-bold hover:underline cursor-pointer flex items-center space-x-1"
        >
          <Database className="w-3 h-3" />
          <span>Connector Status</span>
        </button>
      </div>

      {/* 2. NATURAL SEARCH BAR & FILTER TOGGLE */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8E8A85] absolute left-3.5 top-3" />
            <input
              id="product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Deep Search e.g. "baggy jeans under 1500", "black oversized shirt", "minimal western dresses", "white sneakers"...'
              className="w-full bg-[#F5F1EB] border border-[#EAE5DE] pl-10 pr-9 py-2.5 text-xs text-[#161616] placeholder-[#8E8A85] focus:outline-none focus:border-[#161616] focus:bg-[#FAF8F5] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#8E8A85] hover:text-[#161616]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="filter-drawer-toggle-btn"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`px-3.5 py-2.5 border flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              isFilterDrawerOpen || hasActiveFilters
                ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                : 'bg-[#F5F1EB] text-[#161616] border-[#EAE5DE] hover:border-[#161616]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#C83818]" />
            )}
          </button>
        </div>

        {/* Quick Search Preset Chips */}
        {!searchQuery && (
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] text-[#8E8A85] scrollbar-none pb-1">
            <span className="uppercase font-bold shrink-0">Popular:</span>
            {[
              'baggy jeans under ₹1500',
              'black oversized shirt',
              'minimal western dresses',
              'cute college outfits',
              'white sneakers',
              'quiet luxury',
              'Indo western outfits',
              'party tops',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setSearchQuery(preset)}
                className="px-2 py-0.5 bg-[#FAF8F5] border border-[#EAE5DE] hover:border-[#161616] shrink-0 text-[#161616] transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. CURATED EDITORIAL SECTION TABS */}
      <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-[#EAE5DE]">
        {sectionTabs.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id);
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                  : 'bg-[#F5F1EB] text-[#3A3836] border-transparent hover:border-[#EAE5DE]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. EXPANDABLE MULTI-FACET FILTER DRAWER */}
      {isFilterDrawerOpen && (
        <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
            <h3 className="font-editorial text-sm font-bold text-[#161616] uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#C83818]" />
              <span>Deep Catalog Search &amp; Deal Filters</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[10px] font-bold text-[#C83818] uppercase tracking-wider hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Retailer Multi-Select (All 8 supported retailers) */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase text-[10px] text-[#8E8A85]">
                Supported Retailers ({selectedRetailers.length || 'All 8'})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {retailers.map((r) => {
                  const isChecked = selectedRetailers.includes(r.value);
                  return (
                    <button
                      key={r.value}
                      onClick={() => handleRetailerToggle(r.value)}
                      className={`px-2 py-1 text-[10px] font-medium border transition-colors cursor-pointer flex items-center space-x-1 ${
                        isChecked
                          ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                          : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE]'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      <span>{r.label}</span>
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <span className="font-bold uppercase text-[10px] text-[#8E8A85]">
                Fashion Category
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-1.5 text-xs font-semibold text-[#161616] focus:outline-none"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Rating */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-bold uppercase text-[10px] text-[#8E8A85]">
                  Max Price Cap
                </span>
                <div className="flex flex-wrap gap-1">
                  {[999, 1499, 2499, 3999, undefined].map((price, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMaxPrice(price)}
                      className={`px-2 py-1 text-[10px] font-semibold border ${
                        maxPrice === price
                          ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                          : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE]'
                      }`}
                    >
                      {price ? `≤ ₹${price}` : 'Any'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase text-[10px] text-[#8E8A85]">
                  Minimum Rating
                </span>
                <div className="flex space-x-1">
                  {[0, 4.0, 4.3, 4.6].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`px-2 py-1 text-[10px] font-semibold border ${
                        minRating === rate
                          ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                          : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE]'
                      }`}
                    >
                      {rate === 0 ? 'All' : `${rate}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sorting & Availability */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-bold uppercase text-[10px] text-[#8E8A85]">
                  Sort By Algorithm
                </span>
                <select
                  value={selectedSort}
                  onChange={(e: any) => setSelectedSort(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-1.5 text-xs font-semibold text-[#161616] focus:outline-none"
                >
                  <option value="trending">Trending Now (Velocity)</option>
                  <option value="score">Overall Score (Composite)</option>
                  <option value="price_drop">Biggest Price Drop</option>
                  <option value="best_deal">Best Deal (% Discount)</option>
                  <option value="best_reviewed">Best Reviewed (Bayesian)</option>
                  <option value="most_rated">Most Reviewed Volume</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <div className="space-y-1 pt-1">
                <label className="flex items-center space-x-2 text-xs text-[#161616] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#161616]"
                  />
                  <span className="font-semibold text-[11px]">In-Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CATALOG SCALE COUNTER & ACTIVE SORT INFO */}
      <div className="flex items-center justify-between text-xs text-[#8E8A85] border-b border-[#EAE5DE] pb-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#161616]">
            Showing {displayedProducts.length} of {totalCount.toLocaleString('en-IN')} unique products
          </span>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 hidden sm:inline">
            1 Product = 1 Card
          </span>
          {searchQuery && (
            <span className="bg-[#EAE5DE] text-[#161616] px-1.5 py-0.5 text-[10px] font-semibold">
              for "{searchQuery}"
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>
            Page {page} of {totalPages}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[#C83818] font-bold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 6. MAIN PRODUCT GRID WITH SERVER-PAGINATED LOAD MORE */}
      {isLoading && displayedProducts.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C83818] animate-spin mx-auto" />
          <p className="text-xs text-[#8E8A85] font-semibold tracking-wider uppercase">
            Querying 1,000+ Fashion Products &amp; Real Multi-Store Offers...
          </p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#F5F1EB] border border-[#EAE5DE] p-8">
          <p className="font-editorial text-base text-[#161616] font-bold">
            No products matched your exact filter combination.
          </p>
          <p className="text-xs text-[#8E8A85]">
            Try relaxing price caps or search terms to browse the 1,000+ item catalog.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[#161616] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSaved={savedItemIds.has(product.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectProduct}
              />
            ))}
          </div>

          {/* Load More Button with Progress Bar */}
          {hasMore && (
            <div className="pt-4 pb-8 text-center space-y-3 max-w-sm mx-auto">
              <div className="w-full bg-[#EAE5DE] h-1.5 overflow-hidden">
                <div
                  className="bg-[#161616] h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((displayedProducts.length / totalCount) * 100))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#8E8A85]">
                Loaded {displayedProducts.length} of {totalCount} items
              </p>
              <button
                id="load-more-products-btn"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full py-3 px-6 bg-[#161616] text-[#FAF8F5] hover:bg-[#3A3836] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading next 32 products...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Fashion Items</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && totalCount > 0 && (
            <div className="py-8 text-center border-t border-[#EAE5DE]">
              <p className="text-xs text-[#8E8A85] font-semibold">
                ✓ All {totalCount.toLocaleString('en-IN')} products currently loaded.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
