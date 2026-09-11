import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Camera,
  ExternalLink,
  TrendingDown,
  Sparkles,
  Check,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { LookbookItem } from '../../types';
import { FEATURED_LOOKBOOK } from '../../data/mockData';

interface LookbookDossierScreenProps {
  item?: LookbookItem;
  onBack: () => void;
  onSaveToggle: (id: string) => void;
  isSaved: boolean;
  onSelectAccessory?: (accessoryName: string) => void;
}

export const LookbookDossierScreen: React.FC<LookbookDossierScreenProps> = ({
  item = FEATURED_LOOKBOOK,
  onBack,
  onSaveToggle,
  isSaved,
  onSelectAccessory,
}) => {
  const [selectedStore, setSelectedStore] = useState(item.stores[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);

  const handleCopyCoupon = (code?: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title} on TrendStitch India Edition`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="pb-28 bg-[#FAF8F5] min-h-screen">
      {/* Dossier Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DE]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button
            id="dossier-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1.5 text-[#161616] hover:text-[#C83818] transition-colors cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-8 h-5 bg-[#161616] text-[#FAF8F5] flex items-center justify-center font-editorial text-[10px]">
              TS
            </span>
            <span className="font-editorial text-base font-semibold text-[#161616] tracking-tight">
              Lookbook Dossier
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="dossier-share-btn"
              onClick={handleShare}
              className="p-1.5 text-[#161616] hover:text-[#C83818] transition-colors"
              aria-label="Share Lookbook"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#EAE5DE]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Curator"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {shareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161616] text-[#FAF8F5] text-xs px-4 py-2 shadow-lg">
          Dossier link copied to clipboard
        </div>
      )}

      <main className="max-w-md mx-auto px-4 pt-3 space-y-6">
        {/* Top Tag Indicators */}
        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase">
          <div className="flex items-center space-x-1 text-[#161616]">
            <span className="w-2 h-2 rounded-full bg-[#C83818]" />
            <span>ARCHIVAL MARKET INDEX {item.archivalIndex}</span>
          </div>
          <div className="flex items-center space-x-1 text-[#C83818]">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Top {item.demandPercentile}% Demand</span>
          </div>
        </div>

        {/* HERO IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE6DC] border border-[#EAE5DE]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Top Lookbook Pill */}
          <div className="absolute top-3 left-3 bg-[#FAF8F5]/95 text-[#161616] text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-[#EAE5DE]">
            {item.code}
          </div>

          {/* Catalogued Badge */}
          <div className="absolute bottom-3 right-3 bg-[#161616]/90 text-[#FAF8F5] text-[10px] px-3 py-1 flex items-center space-x-1.5">
            <Camera className="w-3 h-3 text-[#C83818]" />
            <span>{item.looksCatalogued} Looks Catalogued</span>
          </div>
        </div>

        {/* Title & Provenance */}
        <div className="space-y-2 border-b border-[#EAE5DE] pb-4">
          <h1 className="font-editorial text-2xl font-bold text-[#161616] leading-tight">
            {item.title}
          </h1>
          <div className="flex items-center justify-between text-xs text-[#8E8A85]">
            <span>{item.provenance}</span>
            <span className="text-[#C83818] font-semibold uppercase">{item.category}</span>
          </div>
          <p className="text-xs text-[#3A3836] leading-relaxed pt-1">
            {item.description}
          </p>
        </div>

        {/* SECTION 1: MARKET AGGREGATION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#C83818]">
              MARKET AGGREGATION
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] text-[#8E8A85]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Live Sync (4m ago)</span>
            </div>
          </div>

          <div>
            <h2 className="font-editorial text-2xl font-normal text-[#161616] tracking-tight">
              Found Across India
            </h2>
            <p className="text-xs text-[#8E8A85] mt-0.5">
              Verified live prices across domestic luxury and fashion catalog platforms.
            </p>
          </div>

          {/* Store Price Reconciliation Cards */}
          <div className="space-y-2.5 pt-1">
            {item.stores.map((store, i) => {
              const isSelected = selectedStore.storeName === store.storeName;
              return (
                <div
                  key={i}
                  id={`store-option-${i}`}
                  onClick={() => setSelectedStore(store)}
                  className={`p-3 border transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#F5F1EB] border-[#161616]'
                      : 'bg-[#FAF8F5] border-[#EAE5DE] hover:border-[#8E8A85]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-editorial text-sm font-semibold text-[#161616]">
                        {store.storeName}
                      </span>
                      {store.isLowest && (
                        <span className="text-[9px] font-bold bg-[#C83818] text-white px-1.5 py-0.2 uppercase tracking-wider">
                          LOWEST PRICE
                        </span>
                      )}
                      {store.discountPercent && (
                        <span className="text-[10px] font-bold text-[#C83818]">
                          Save {store.discountPercent}%
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#8E8A85] flex items-center space-x-2">
                      <span>{store.stockNote}</span>
                      {store.couponCode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCoupon(store.couponCode);
                          }}
                          className="font-mono text-[9px] bg-[#FAF8F5] border border-[#EAE5DE] px-1 text-[#161616] font-bold hover:border-[#C83818] cursor-pointer"
                        >
                          {copiedCode === store.couponCode ? 'COPIED' : `CODE: ${store.couponCode}`}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-editorial text-base font-bold text-[#161616]">
                      ₹{store.price.toLocaleString('en-IN')}
                    </div>
                    {store.originalPrice && (
                      <div className="text-[11px] text-[#8E8A85] line-through">
                        ₹{store.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: MARKET ANALYTICS - 60-DAY PRICE TRAJECTORY */}
        <section className="space-y-3 bg-[#F5F1EB] border border-[#EAE5DE] p-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8E8A85]">
              MARKET ANALYTICS
            </span>
            <span className="text-[10px] font-bold text-[#C83818] uppercase">
              -37% Peak Drop
            </span>
          </div>

          <h2 className="font-editorial text-2xl font-normal text-[#161616] tracking-tight">
            60-Day Price Trajectory
          </h2>

          {/* 3 Metric Stat Blocks */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold uppercase text-[#8E8A85] tracking-wider">
                LOWEST
              </div>
              <div className="font-editorial text-base font-bold text-[#C83818] mt-0.5">
                ₹{item.lowestPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold uppercase text-[#8E8A85] tracking-wider">
                60D AVG
              </div>
              <div className="font-editorial text-base font-bold text-[#161616] mt-0.5">
                ₹2,750
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold uppercase text-[#8E8A85] tracking-wider">
                LAUNCH
              </div>
              <div className="font-editorial text-base font-bold text-[#161616] mt-0.5">
                ₹{item.originalPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Trajectory Graphic Line Chart */}
          <div className="pt-4 pb-2">
            <div className="relative h-28 w-full bg-[#FAF8F5] border border-[#EAE5DE] p-3 flex flex-col justify-between">
              {/* SVG Curve */}
              <svg className="absolute inset-0 w-full h-full p-3 overflow-visible pointer-events-none" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C83818" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C83818" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 15 15 Q 120 25 150 40 T 285 70 L 285 80 L 15 80 Z"
                  fill="url(#priceGradient)"
                />
                {/* Main line curve */}
                <path
                  d="M 15 15 Q 120 25 150 40 T 285 70"
                  fill="none"
                  stroke="#C83818"
                  strokeWidth="2.5"
                />
                {/* Data Points */}
                <circle cx="15" cy="15" r="4" fill="#161616" />
                <circle cx="150" cy="40" r="4" fill="#161616" />
                <circle cx="285" cy="70" r="5" fill="#C83818" stroke="#FAF8F5" strokeWidth="2" />
              </svg>

              {/* Data Labels inside Chart */}
              <div className="relative z-10 flex justify-between text-[9px] text-[#8E8A85] mt-auto pt-16">
                <div>60 DAYS AGO (₹3,499)</div>
                <div className="text-center">MID-SEASON (₹2,750)</div>
                <div className="text-right text-[#C83818] font-bold">TODAY (₹2,149)</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CURATION MATRIX - STYLE WITH INDIAN STREETWEAR */}
        <section className="space-y-3 pt-2">
          <div className="border-b border-[#EAE5DE] pb-1.5">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#C83818]">
              CURATION MATRIX
            </span>
          </div>

          <h2 className="font-editorial text-2xl font-normal text-[#161616] tracking-tight">
            Style with Indian Streetwear &amp; Accents
          </h2>
          <p className="text-xs text-[#8E8A85]">
            Recommended layering combinations compiled by Delhi stylists.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {item.accessories.map((acc) => (
              <div
                key={acc.id}
                id={`accessory-${acc.id}`}
                onClick={() => onSelectAccessory && onSelectAccessory(acc.name)}
                className="bg-[#F5F1EB] border border-[#EAE5DE] overflow-hidden group cursor-pointer hover:border-[#161616] transition-colors flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-[#ECE6DC]">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-[#FAF8F5]/90 text-[#161616] text-[9px] font-bold px-1.5 py-0.5 border border-[#EAE5DE]">
                    MATCH +{acc.matchPercent}%
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5 bg-[#FAF8F5]">
                  <div>
                    <div className="text-[9px] font-bold text-[#C83818] uppercase tracking-wider truncate">
                      {acc.brand}
                    </div>
                    <div className="font-editorial text-xs font-semibold text-[#161616] truncate">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-[#8E8A85]">
                      ₹{acc.price.toLocaleString('en-IN')} via {acc.store}
                    </div>
                  </div>

                  <div className="text-[10px] font-semibold text-[#161616] group-hover:text-[#C83818] flex items-center space-x-1 pt-1 border-t border-[#EAE5DE]">
                    <span>Inspect Item</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM CHECKOUT / PURCHASE BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5] border-t border-[#EAE5DE] p-3 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between space-x-3">
          {/* Price details */}
          <div className="leading-tight">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-editorial text-xl font-bold text-[#161616]">
                ₹{selectedStore.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-[#C83818] uppercase">
                Save {selectedStore.discountPercent || 46}%
              </span>
            </div>
            <div className="text-[10px] text-[#8E8A85] truncate max-w-[150px]">
              Lowest on {selectedStore.storeName} • In Stock
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Bookmark button */}
            <button
              id="dossier-bookmark-toggle-btn"
              onClick={() => onSaveToggle(item.id)}
              className="w-10 h-10 border border-[#161616] bg-[#FAF8F5] flex items-center justify-center hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Save fit"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isSaved ? 'fill-[#161616] text-[#161616]' : 'text-[#161616]'
                }`}
              />
            </button>

            {/* Shop Deal on Store */}
            <button
              id="shop-deal-primary-btn"
              onClick={() => {
                window.open('https://www.google.com/search?q=' + encodeURIComponent(item.title + ' ' + selectedStore.storeName), '_blank');
              }}
              className="bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase px-5 py-3 flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>SHOP DEAL ON {selectedStore.storeName.toUpperCase()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
