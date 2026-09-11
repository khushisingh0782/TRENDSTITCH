import React, { useState } from 'react';
import {
  Bookmark,
  TrendingDown,
  Bell,
  ExternalLink,
  Trash2,
  Check,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, SavedProduct } from '../../types';
import { store } from '../../services/store';

interface SavedScreenProps {
  savedItems: { product: Product; savedMeta: SavedProduct }[];
  onSelectProduct: (product: Product) => void;
  onRemoveSaved: (productId: string) => void;
  onNavigateToDiscover: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  savedItems,
  onSelectProduct,
  onRemoveSaved,
  onNavigateToDiscover,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'dropped' | 'target_reached'>('all');
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState<string>('');

  // Count items with dropped price
  const droppedItems = savedItems.filter((item) => item.product.currentPrice < item.savedMeta.initialPrice);
  const targetReachedItems = savedItems.filter((item) => item.product.currentPrice <= item.savedMeta.targetPrice);

  const displayedItems = filterTab === 'dropped'
    ? droppedItems
    : filterTab === 'target_reached'
    ? targetReachedItems
    : savedItems;

  const handleStartEditTarget = (item: { product: Product; savedMeta: SavedProduct }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTargetId(item.product.id);
    setTargetInput(item.savedMeta.targetPrice.toString());
  };

  const handleSaveTarget = (productId: string, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const val = parseInt(targetInput, 10);
    if (!isNaN(val) && val > 0) {
      store.updateAlertTarget(productId, val);
    }
    setEditingTargetId(null);
  };

  return (
    <div className="pb-28 pt-2 max-w-4xl mx-auto px-4 space-y-5">
      {/* 1. TOP PROACTIVE PRICE DROP CALLOUT BANNER */}
      {droppedItems.length > 0 && (
        <div className="bg-[#161616] text-[#FAF8F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#3A3836]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#C83818] flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-editorial text-base font-bold">
                {droppedItems.length} of your saved items dropped in price
              </div>
              <div className="text-xs text-[#FAF8F5]/80">
                Live price reductions detected on Myntra, AJIO &amp; partner stockists.
              </div>
            </div>
          </div>

          <button
            onClick={() => setFilterTab('dropped')}
            className="px-4 py-2 bg-[#FAF8F5] text-[#161616] hover:bg-[#EAE5DE] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            View Price Drops
          </button>
        </div>
      )}

      {/* 2. HEADER & FILTER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE5DE] pb-3">
        <div>
          <h1 className="font-editorial text-2xl font-bold text-[#161616]">
            Saved &amp; Price-Drop Radar
          </h1>
          <p className="text-xs text-[#8E8A85]">
            Continuous deal and price trajectory monitoring for your saved wardrobe
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 border font-semibold transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE] hover:border-[#161616]'
            }`}
          >
            All Saved ({savedItems.length})
          </button>
          <button
            onClick={() => setFilterTab('dropped')}
            className={`px-3 py-1.5 border font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
              filterTab === 'dropped'
                ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE] hover:border-[#161616]'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-[#C83818]" />
            <span>Dropped ({droppedItems.length})</span>
          </button>
          <button
            onClick={() => setFilterTab('target_reached')}
            className={`px-3 py-1.5 border font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
              filterTab === 'target_reached'
                ? 'bg-[#161616] text-[#FAF8F5] border-[#161616]'
                : 'bg-[#FAF8F5] text-[#3A3836] border-[#EAE5DE] hover:border-[#161616]'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Target Reached ({targetReachedItems.length})</span>
          </button>
        </div>
      </div>

      {/* 3. SAVED PRODUCTS LIST */}
      {displayedItems.length === 0 ? (
        <div className="p-12 text-center bg-[#F5F1EB] border border-[#EAE5DE] space-y-3">
          <Bookmark className="w-8 h-8 text-[#8E8A85] mx-auto" />
          <h3 className="font-editorial text-lg font-bold text-[#161616]">
            No items in this category
          </h3>
          <p className="text-xs text-[#8E8A85] max-w-md mx-auto">
            {filterTab === 'dropped'
              ? 'None of your saved pieces have recorded a new price drop yet. TrendStitch checks periodically.'
              : 'Save products from the Discover feed to monitor price history, receive drop alerts, and set target alerts.'}
          </p>
          <button
            onClick={onNavigateToDiscover}
            className="mt-2 px-5 py-2.5 bg-[#161616] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            Explore Discover Feed
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedItems.map(({ product, savedMeta }) => {
            const priceDifference = product.currentPrice - savedMeta.initialPrice;
            const hasDropped = priceDifference < 0;
            const targetMet = product.currentPrice <= savedMeta.targetPrice;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-[#FAF8F5] border border-[#EAE5DE] hover:border-[#161616] p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left: Image & Main Info */}
                <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                  <div className="relative w-20 h-24 shrink-0 bg-[#ECE6DC] overflow-hidden border border-[#EAE5DE]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {hasDropped && (
                      <span className="absolute top-1 left-1 bg-[#C83818] text-white text-[8px] font-bold px-1 py-0.2">
                        DROP
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px]">
                      <span className="font-bold text-[#8E8A85] uppercase">
                        {product.brand}
                      </span>
                      <span>•</span>
                      <span className="uppercase font-semibold text-[#161616] bg-[#F5F1EB] px-1.5 py-0.2 border border-[#EAE5DE]">
                        {product.primaryRetailerId}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        {product.availability === 'in_stock' ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>

                    <h3 className="font-editorial text-sm font-semibold text-[#161616] line-clamp-1 max-w-sm hover:text-[#C83818]">
                      {product.name}
                    </h3>

                    {/* Price & Drop Status */}
                    <div className="flex items-baseline space-x-2 pt-0.5">
                      <span className="font-editorial text-base font-bold text-[#161616]">
                        ₹{product.currentPrice.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice > product.currentPrice && (
                        <span className="text-xs text-[#8E8A85] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {hasDropped && (
                        <span className="text-xs font-bold text-[#C83818] flex items-center space-x-0.5">
                          <TrendingDown className="w-3 h-3" />
                          <span>Dropped ₹{Math.abs(priceDifference)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Target Price & Actions */}
                <div
                  className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#EAE5DE]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Target Price Configuration */}
                  <div className="text-right">
                    <div className="text-[9px] uppercase font-bold text-[#8E8A85]">
                      Alert Target Price
                    </div>

                    {editingTargetId === product.id ? (
                      <form
                        onSubmit={(e) => handleSaveTarget(product.id, e)}
                        className="flex items-center space-x-1 mt-0.5"
                      >
                        <input
                          type="number"
                          value={targetInput}
                          onChange={(e) => setTargetInput(e.target.value)}
                          className="w-20 bg-white border border-[#161616] px-1 py-0.5 text-xs font-bold text-[#161616]"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="bg-[#161616] text-[#FAF8F5] px-2 py-0.5 text-xs font-bold"
                        >
                          ✓
                        </button>
                      </form>
                    ) : (
                      <div
                        onClick={(e) => handleStartEditTarget({ product, savedMeta }, e)}
                        className="font-editorial text-sm font-bold text-[#161616] hover:text-[#C83818] cursor-pointer flex items-center justify-end space-x-1"
                        title="Click to edit alert target"
                      >
                        <span>₹{savedMeta.targetPrice.toLocaleString('en-IN')}</span>
                        {targetMet && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1">
                            Met
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Direct Shop Button */}
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>Shop</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(product.id);
                    }}
                    className="p-2 text-[#8E8A85] hover:text-[#C83818] transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
