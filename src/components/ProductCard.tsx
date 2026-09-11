import React from 'react';
import { Bookmark, Star, TrendingDown, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const retailerNameMap: Record<string, string> = {
    myntra: 'Myntra',
    ajio: 'AJIO',
    amazon_in: 'Amazon India',
    tatacliq: 'Tata CLiQ',
    nykaa: 'Nykaa',
    flipkart: 'Flipkart',
    meesho: 'Meesho',
    shein_in: 'SHEIN India',
  };

  const primaryRetailerName =
    retailerNameMap[product.primaryRetailerId] || product.primaryRetailerId?.toUpperCase();

  // Cross-store offers
  const offers = product.offers || [];
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);
  const bestOffer = sortedOffers.find((o) => o.isBestPrice) || sortedOffers[0];
  const secondaryOffers = sortedOffers.filter((o) => o !== bestOffer);

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="bg-[#FAF8F5] border border-[#EAE5DE] hover:border-[#161616] transition-all group cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE6DC]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
          {/* TrendStitch Score Pill */}
          <span className="bg-[#161616]/95 text-[#FAF8F5] text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase backdrop-blur-xs flex items-center space-x-1 shadow-xs">
            <span>Score</span>
            <span className="text-[#FAF8F5] font-black">{product.scores?.overallScore || 85}</span>
          </span>

          {/* Discount Pill */}
          {product.discountPercent > 0 && (
            <span className="bg-[#C83818] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-xs">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Save Bookmark Button */}
        <button
          id={`save-btn-${product.id}`}
          onClick={(e) => onToggleSave(product.id, e)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] border border-[#EAE5DE] flex items-center justify-center text-[#161616] hover:text-[#C83818] transition-colors z-10 shadow-xs cursor-pointer"
          aria-label={isSaved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark
            className={`w-4 h-4 ${
              isSaved ? 'fill-[#C83818] text-[#C83818]' : 'text-[#161616]'
            }`}
          />
        </button>

        {/* Price Drop Banner (if recently dropped) */}
        {product.priceHistory?.change7d < 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#FAF8F5]/95 backdrop-blur-xs border border-[#C83818]/30 px-2 py-1 flex items-center justify-between text-[9px] font-semibold text-[#C83818] shadow-xs">
            <span className="flex items-center space-x-1">
              <TrendingDown className="w-3 h-3" />
              <span>Dropped ₹{Math.abs(product.priceHistory.change7d)} in 7d</span>
            </span>
            <span className="font-bold">LOWEST</span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5 bg-[#FAF8F5]">
        <div>
          {/* Brand & Canonical Identifier */}
          <div className="flex items-center justify-between text-[10px] pb-1">
            <span className="font-bold uppercase tracking-wider text-[#8E8A85] truncate max-w-[65%]">
              {product.brand}
            </span>
            {product.canonical_product_id && (
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-[#EAE5DE]/70 text-[#161616]">
                {product.canonical_product_id}
              </span>
            )}
          </div>

          {/* Product Title (Authoritative Canonical Name) */}
          <h3 className="font-editorial text-sm font-bold uppercase text-[#161616] group-hover:text-[#C83818] transition-colors line-clamp-2 leading-tight tracking-wide">
            {product.name}
          </h3>

          {/* Price & Rating Row */}
          <div className="flex items-baseline justify-between pt-1.5">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-editorial text-base font-black text-[#161616]">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-xs text-[#8E8A85] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center space-x-1 text-[11px]">
              <div className="flex items-center space-x-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="text-[#161616] font-bold text-xs">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-[#8E8A85]">
                ({product.reviewCount.toLocaleString('en-IN')})
              </span>
            </div>
          </div>
        </div>

        {/* Cross-Retailer Price Comparison Matrix (1 PRODUCT = 1 CARD) */}
        <div className="pt-2 border-t border-[#EAE5DE] space-y-1.5 text-[10px]">
          {sortedOffers.length > 1 ? (
            <div className="bg-[#F5F1EB] p-2 border border-[#EAE5DE] space-y-1">
              {/* Best Price Line */}
              {bestOffer && (
                <div className="flex items-center justify-between text-[#161616]">
                  <span className="text-[#8E8A85] font-semibold uppercase tracking-wider text-[9px]">
                    Best price:
                  </span>
                  <span className="font-bold text-[#C83818]">
                    {bestOffer.retailerName} ₹{bestOffer.price.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Also Available Line */}
              {secondaryOffers.length > 0 && (
                <div className="flex items-start justify-between text-[#8E8A85] pt-0.5 border-t border-[#EAE5DE]/60">
                  <span className="uppercase tracking-wider text-[9px] shrink-0 font-medium">
                    Also available:
                  </span>
                  <div className="text-right flex flex-wrap justify-end gap-x-2 gap-y-0.5 font-medium text-[#3A3836]">
                    {secondaryOffers.map((o) => (
                      <span key={o.id}>
                        {o.retailerName} ₹{o.price.toLocaleString('en-IN')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-[#8E8A85] py-0.5">
              <span className="text-[9px] uppercase font-medium">Retailer:</span>
              <span className="font-semibold text-[#161616]">
                {primaryRetailerName} ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Action Buttons: [Save] [View Product] */}
          <div className="pt-1 flex items-center space-x-1.5">
            <button
              type="button"
              onClick={(e) => onToggleSave(product.id, e)}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold border transition-colors flex items-center justify-center space-x-1 cursor-pointer ${
                isSaved
                  ? 'bg-[#C83818] text-white border-[#C83818]'
                  : 'bg-[#FAF8F5] text-[#161616] border-[#EAE5DE] hover:border-[#161616]'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelect(product)}
              className="flex-1 py-1.5 px-2 text-[11px] font-bold bg-[#161616] text-[#FAF8F5] hover:bg-[#3A3836] border border-[#161616] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>View Product</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
