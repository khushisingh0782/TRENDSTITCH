import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Star,
  TrendingDown,
  ExternalLink,
  ShieldCheck,
  Bell,
  Check,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { Product, ProductOffer } from '../types';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string, e?: any) => void;
  onSelectProduct: (product: Product) => void;
  onSetAlertTarget: (productId: string, targetPrice: number) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  isSaved,
  onToggleSave,
  onSelectProduct,
  onSetAlertTarget,
}) => {
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [targetPriceInput, setTargetPriceInput] = useState(
    Math.round(product.currentPrice * 0.85).toString()
  );
  const [alertSaved, setAlertSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Similar products in the same category or style
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 4);

  // More from this brand
  const moreFromBrand = allProducts
    .filter((p) => p.id !== product.id && p.brand.toLowerCase() === product.brand.toLowerCase())
    .slice(0, 4);

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(targetPriceInput, 10);
    if (!isNaN(val) && val > 0) {
      onSetAlertTarget(product.id, val);
      if (!isSaved) {
        onToggleSave(product.id);
      }
      setAlertSaved(true);
      setTimeout(() => setAlertSaved(false), 3000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `TrendStitch Deal: ${product.name} at ₹${product.currentPrice} (${product.discountPercent}% off)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [product.imageUrl];

  return (
    <div className="pb-28 bg-[#FAF8F5] min-h-screen text-[#161616]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DE]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            id="detail-back-btn"
            onClick={onBack}
            className="p-1.5 -ml-1.5 text-[#161616] hover:text-[#C83818] transition-colors cursor-pointer flex items-center space-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-[#161616] text-[#FAF8F5] flex items-center justify-center font-editorial text-xs">
              TS
            </span>
            <span className="font-editorial text-base font-semibold text-[#161616] tracking-tight">
              Product Intelligence
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="p-2 text-[#161616] hover:text-[#C83818] transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="detail-bookmark-btn"
              onClick={(e) => onToggleSave(product.id, e)}
              className="p-2 text-[#161616] hover:text-[#C83818] transition-colors cursor-pointer"
              aria-label="Save"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isSaved ? 'fill-[#C83818] text-[#C83818]' : 'text-[#161616]'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {shareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#161616] text-[#FAF8F5] text-xs px-4 py-2 shadow-lg border border-[#3A3836]">
          Link copied to clipboard
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        {/* Brand, Name & Status */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#8E8A85] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase">
              {product.availability === 'in_stock' ? 'In Stock' : 'Low Stock'}
            </span>
          </div>
          <h1 className="font-editorial text-2xl font-bold text-[#161616] leading-tight">
            {product.name}
          </h1>
          <p className="text-xs text-[#8E8A85]">
            {product.subcategory} • Updated {product.lastUpdatedTimestamp}
          </p>
        </div>

        {/* Gallery */}
        <div className="space-y-2">
          <div className="relative aspect-[3/4] max-h-[460px] w-full overflow-hidden bg-[#ECE6DC] border border-[#EAE5DE]">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#C83818] text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 shrink-0 border overflow-hidden cursor-pointer ${
                    selectedImage === img ? 'border-[#161616] ring-1 ring-[#161616]' : 'border-[#EAE5DE]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Primary Call to Action */}
        <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#8E8A85]">
              Current Best Verified Price
            </div>
            <div className="flex items-baseline space-x-2 pt-0.5">
              <span className="font-editorial text-2xl font-bold text-[#161616]">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.currentPrice && (
                <span className="text-sm text-[#8E8A85] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-[#C83818]">
                Save ₹{(product.originalPrice - product.currentPrice).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-xs text-[#3A3836] pt-1">
              Primary Stockist: <span className="font-semibold capitalize">{product.primaryRetailerId}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3.5 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Shop at {product.primaryRetailerId.toUpperCase()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1. EXPLAINABLE TRENDSTITCH SCORE BREAKDOWN */}
        <section className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#C83818]" />
              <h2 className="font-editorial text-base font-bold text-[#161616]">
                TrendStitch Intelligence Score
              </h2>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-[#8E8A85] uppercase">Overall:</span>
              <span className="font-editorial text-xl font-black text-[#161616] bg-[#FAF8F5] px-2 py-0.5 border border-[#161616]">
                {product.scores.overallScore}/100
              </span>
            </div>
          </div>

          {/* Explainable text banner */}
          <div className="bg-[#FAF8F5] p-3 border border-[#EAE5DE] text-xs text-[#161616] leading-relaxed font-medium">
            <span className="font-bold text-[#C83818] uppercase mr-1.5">Why Selected:</span>
            {product.scores.explanation}
          </div>

          {/* 5 Explainable Sub-Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
            {/* Aesthetic Score */}
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] space-y-0.5">
              <div className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
                ✨ Aesthetic
              </div>
              <div className="font-editorial text-base font-bold text-[#161616]">
                {product.scores.aestheticScore || 85}
                <span className="text-[10px] text-[#8E8A85]">/100</span>
              </div>
              <div className="text-[9px] text-[#8E8A85]">
                Contemporary Curation
              </div>
            </div>

            {/* Review Score */}
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] space-y-0.5">
              <div className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
                ⭐ Review
              </div>
              <div className="font-editorial text-base font-bold text-[#161616]">
                {product.scores.reviewScore}
                <span className="text-[10px] text-[#8E8A85]">/100</span>
              </div>
              <div className="text-[9px] text-[#8E8A85]">
                {product.rating.toFixed(1)}★ ({product.reviewCount})
              </div>
            </div>

            {/* Deal Score */}
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] space-y-0.5">
              <div className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
                💰 Deal
              </div>
              <div className="font-editorial text-base font-bold text-[#C83818]">
                {product.scores.dealScore}
                <span className="text-[10px] text-[#8E8A85]">/100</span>
              </div>
              <div className="text-[9px] text-[#8E8A85]">
                {product.discountPercent}% Off MRP
              </div>
            </div>

            {/* Price Drop Score */}
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] space-y-0.5">
              <div className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
                📉 Price Drop
              </div>
              <div className="font-editorial text-base font-bold text-[#161616]">
                {product.scores.priceDropScore}
                <span className="text-[10px] text-[#8E8A85]">/100</span>
              </div>
              <div className="text-[9px] text-[#8E8A85]">
                {product.priceHistory.change7d < 0 ? `-₹${Math.abs(product.priceHistory.change7d)}` : 'Stable'}
              </div>
            </div>

            {/* Trend Score */}
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] space-y-0.5">
              <div className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
                🔥 Trend
              </div>
              <div className="font-editorial text-base font-bold text-[#161616]">
                {product.scores.trendScore}
                <span className="text-[10px] text-[#8E8A85]">/100</span>
              </div>
              <div className="text-[9px] text-[#8E8A85]">
                High Velocity
              </div>
            </div>
          </div>
        </section>

        {/* 2. CROSS-RETAILER PRICE COMPARISON TABLE */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
            <h2 className="font-editorial text-lg font-bold text-[#161616]">
              Live Multi-Store Price Comparison
            </h2>
            <span className="text-[10px] font-bold text-[#8E8A85] uppercase">
              {(product.offers || []).length} Retailers Monitored
            </span>
          </div>

          <div className="overflow-x-auto border border-[#EAE5DE]">
            <table className="w-full text-left text-xs bg-[#FAF8F5]">
              <thead className="bg-[#F5F1EB] text-[10px] uppercase font-bold text-[#8E8A85] border-b border-[#EAE5DE]">
                <tr>
                  <th className="p-3">Retailer</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DE]">
                {(product.offers || []).map((offer) => (
                  <tr
                    key={offer.id}
                    className={`hover:bg-[#F5F1EB] transition-colors ${
                      offer.isBestPrice ? 'bg-[#F5F1EB]/70' : ''
                    }`}
                  >
                    <td className="p-3 font-semibold text-[#161616] flex items-center space-x-1.5">
                      <span>{offer.retailerName}</span>
                      {offer.isBestPrice && (
                        <span className="bg-[#C83818] text-white text-[8px] font-black px-1.5 py-0.2 uppercase">
                          Best
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-editorial font-bold text-sm text-[#161616]">
                      ₹{offer.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-[#C83818] font-semibold">
                      {offer.discountPercent}% off
                    </td>
                    <td className="p-3 text-[#8E8A85]">
                      {offer.rating}★ ({offer.reviewCount})
                    </td>
                    <td className="p-3">
                      {offer.inStock ? (
                        <span className="text-[10px] text-emerald-700 font-medium">In Stock</span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-medium">Out of stock</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 border transition-colors ${
                          offer.isBestPrice
                            ? 'bg-[#161616] text-[#FAF8F5] border-[#161616] hover:bg-[#3A3836]'
                            : 'bg-[#FAF8F5] text-[#161616] border-[#EAE5DE] hover:border-[#161616]'
                        }`}
                      >
                        <span>Shop</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. VERIFIED HISTORICAL PRICE OBSERVATIONS */}
        <section className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#8E8A85]" />
              <h2 className="font-editorial text-base font-bold text-[#161616]">
                Verified Price Observations
              </h2>
            </div>
            <span className="text-[9px] font-semibold text-[#8E8A85] uppercase">
              No Simulated Data
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold text-[#8E8A85] uppercase">Lowest Observed</div>
              <div className="font-editorial text-base font-bold text-[#C83818] mt-0.5">
                ₹{product.priceHistory.lowestObservedPrice.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold text-[#8E8A85] uppercase">Current Price</div>
              <div className="font-editorial text-base font-bold text-[#161616] mt-0.5">
                ₹{product.currentPrice.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE]">
              <div className="text-[9px] font-bold text-[#8E8A85] uppercase">Highest Observed</div>
              <div className="font-editorial text-base font-bold text-[#8E8A85] mt-0.5">
                ₹{product.priceHistory.highestObservedPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Timeline points list */}
          <div className="pt-2 space-y-1.5">
            <div className="text-[10px] font-bold uppercase text-[#8E8A85]">
              Observation Log:
            </div>
            <div className="space-y-1 bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] max-h-36 overflow-y-auto text-xs">
              {product.priceHistory.observations.map((obs, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-[#EAE5DE] last:border-0">
                  <span className="text-[#8E8A85]">{obs.timestamp}</span>
                  <span className="font-semibold text-[#161616]">
                    ₹{obs.price.toLocaleString('en-IN')}
                  </span>
                  {obs.isLowest && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5">
                      Lowest Point
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. WHY TRENDING & WHY GOOD DEAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#F5F1EB] p-4 border border-[#EAE5DE] space-y-2">
            <h3 className="font-editorial text-sm font-bold text-[#161616] uppercase tracking-wider flex items-center space-x-1.5">
              <span>🔥 Why It's Trending</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#3A3836]">
              {product.whyTrending.map((point, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-[#C83818] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F5F1EB] p-4 border border-[#EAE5DE] space-y-2">
            <h3 className="font-editorial text-sm font-bold text-[#161616] uppercase tracking-wider flex items-center space-x-1.5">
              <span>💰 Why It's A Good Deal</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#3A3836]">
              {product.whyGoodDeal.map((point, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. SIZES & COLORS */}
        <div className="bg-[#FAF8F5] border border-[#EAE5DE] p-4 space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Available Sizes:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 border border-[#EAE5DE] bg-[#F5F1EB] text-xs font-semibold text-[#161616]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Colors / Washes:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 border border-[#EAE5DE] text-xs text-[#3A3836]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 6. SET PRICE DROP ALERT FORM */}
        <section className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-base font-bold text-[#161616]">
              Set Target Price Drop Alert
            </h3>
          </div>
          <p className="text-xs text-[#3A3836]">
            Get notified when this item drops below your target price across any supported retailer.
          </p>

          <form onSubmit={handleSaveAlert} className="flex items-center space-x-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-[#8E8A85]">₹</span>
              <input
                type="number"
                value={targetPriceInput}
                onChange={(e) => setTargetPriceInput(e.target.value)}
                placeholder="Target Price in INR"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DE] py-2 pl-7 pr-3 text-xs font-semibold text-[#161616] focus:outline-none focus:border-[#161616]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#161616] text-[#FAF8F5] hover:bg-[#3A3836] text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              {alertSaved ? 'Alert Active ✓' : 'Set Alert'}
            </button>
          </form>
        </section>

        {/* 7. SIMILAR HIGHLY-RATED PRODUCTS */}
        {similarProducts.length > 0 && (
          <section className="space-y-3 pt-3">
            <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
              <h3 className="font-editorial text-lg font-bold text-[#161616]">
                Similar Highly-Rated Pieces
              </h3>
              <span className="text-[10px] font-bold text-[#8E8A85] uppercase">
                {product.subcategory}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similarProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-[#FAF8F5] border border-[#EAE5DE] hover:border-[#161616] p-2 space-y-1.5 cursor-pointer group transition-colors"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#ECE6DC]">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-[9px] font-bold text-[#8E8A85] uppercase truncate">
                    {p.brand}
                  </div>
                  <h4 className="font-editorial text-xs font-semibold text-[#161616] line-clamp-1 group-hover:text-[#C83818]">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-editorial text-xs font-bold text-[#161616]">
                      ₹{p.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-[#C83818] font-bold">
                      {p.discountPercent}% off
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. MORE FROM THIS BRAND */}
        {moreFromBrand.length > 0 && (
          <section className="space-y-3 pt-3">
            <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-1.5">
              <h3 className="font-editorial text-lg font-bold text-[#161616]">
                More From {product.brand}
              </h3>
              <span className="text-[10px] font-bold text-[#8E8A85] uppercase">
                Brand Catalog
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moreFromBrand.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-[#FAF8F5] border border-[#EAE5DE] hover:border-[#161616] p-2 space-y-1.5 cursor-pointer group transition-colors"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#ECE6DC]">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-[9px] font-bold text-[#8E8A85] uppercase truncate">
                    {p.brand}
                  </div>
                  <h4 className="font-editorial text-xs font-semibold text-[#161616] line-clamp-1 group-hover:text-[#C83818]">
                    {p.name}
                  </h4>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-editorial text-xs font-bold text-[#161616]">
                      ₹{p.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-[#C83818] font-bold">
                      {p.discountPercent}% off
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
