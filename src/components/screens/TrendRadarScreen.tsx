import React, { useState } from 'react';
import { Sparkles, TrendingDown, Star, Tag, Award, Compass, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { TREND_COLLECTIONS } from '../../data/productDatabase';

interface TrendRadarScreenProps {
  products: Product[];
  savedItemIds: Set<string>;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectProduct: (product: Product) => void;
}

export const TrendRadarScreen: React.FC<TrendRadarScreenProps> = ({
  products,
  savedItemIds,
  onToggleSave,
  onSelectProduct,
}) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string>('coll-trending-now');

  const activeCollection = TREND_COLLECTIONS.find((c) => c.id === activeCollectionId) || TREND_COLLECTIONS[0];
  const collectionProducts = products.filter((p) => activeCollection.productIds.includes(p.id));

  return (
    <div className="pb-28 pt-2 max-w-4xl mx-auto px-4 space-y-6">
      {/* 1. HEADER & VERIFIED SIGNAL DISCLOSURE */}
      <div className="space-y-1 border-b border-[#EAE5DE] pb-4">
        <div className="flex items-center space-x-2">
          <Compass className="w-5 h-5 text-[#C83818]" />
          <h1 className="font-editorial text-2xl font-bold text-[#161616]">
            Trend &amp; Deal Radar
          </h1>
        </div>
        <p className="text-xs text-[#8E8A85] leading-relaxed">
          Signals computed purely from verified price trajectories, Bayesian review ratings, and wishlisting velocity.
        </p>
      </div>

      {/* 2. CURATED COLLECTION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {TREND_COLLECTIONS.map((coll) => {
          const isActive = coll.id === activeCollectionId;
          return (
            <button
              key={coll.id}
              onClick={() => setActiveCollectionId(coll.id)}
              className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-[#161616] text-[#FAF8F5] border-[#161616] shadow-sm'
                  : 'bg-[#FAF8F5] text-[#161616] border-[#EAE5DE] hover:border-[#161616]'
              }`}
            >
              <div className="space-y-0.5">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 uppercase tracking-wider ${
                    isActive ? 'bg-[#FAF8F5]/20 text-[#FAF8F5]' : 'bg-[#F5F1EB] text-[#8E8A85]'
                  }`}
                >
                  {coll.badge}
                </span>
                <h3 className="font-editorial text-xs font-bold pt-1 leading-snug">
                  {coll.title}
                </h3>
              </div>
              <span className="text-[10px] text-right font-mono opacity-70">
                {coll.productIds.length} items
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE COLLECTION HERO BANNER */}
      <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-1">
        <div className="flex items-center space-x-2">
          <h2 className="font-editorial text-lg font-bold text-[#161616]">
            {activeCollection.title}
          </h2>
          <span className="text-xs font-semibold text-[#8E8A85]">
            ({collectionProducts.length} verified styles)
          </span>
        </div>
        <p className="text-xs text-[#3A3836]">
          {activeCollection.subtitle}
        </p>
      </div>

      {/* 4. PRODUCTS IN ACTIVE COLLECTION */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {collectionProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSaved={savedItemIds.has(product.id)}
            onToggleSave={onToggleSave}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

      {/* 5. ADDITIONAL CURATED RADARS */}
      <section className="pt-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
          <h3 className="font-editorial text-base font-bold text-[#161616]">
            High Velocity Movers Across Marketplaces
          </h3>
          <span className="text-[10px] font-bold text-[#8E8A85] uppercase">
            Myntra • AJIO • Tata CLiQ • Nykaa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3.5 space-y-1">
            <span className="text-[9px] font-bold text-[#C83818] uppercase">
              Top Price Advantage
            </span>
            <h4 className="font-editorial text-sm font-bold text-[#161616]">
              Puma Select Chunky Sneakers
            </h4>
            <p className="text-[#8E8A85] text-[11px]">
              ₹2,199 on Flipkart vs ₹2,999 on AJIO (Saves ₹800 instantly on identical colorway).
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3.5 space-y-1">
            <span className="text-[9px] font-bold text-amber-700 uppercase">
              Highest Reviewed
            </span>
            <h4 className="font-editorial text-sm font-bold text-[#161616]">
              Tribe Amrapali Ghungroo Choker
            </h4>
            <p className="text-[#8E8A85] text-[11px]">
              4.8★ across 3,200 verified reviews. Down to ₹649 on Nykaa Fashion.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-3.5 space-y-1">
            <span className="text-[9px] font-bold text-emerald-800 uppercase">
              Fastest Wishlisted
            </span>
            <h4 className="font-editorial text-sm font-bold text-[#161616]">
              Levi's Washed Trucker Jacket
            </h4>
            <p className="text-[#8E8A85] text-[11px]">
              Dropped ₹700 in past 14 days; #1 saved outerwear item across Delhi and Bangalore boards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
