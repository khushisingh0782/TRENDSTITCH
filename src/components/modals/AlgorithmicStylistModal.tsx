import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

interface AlgorithmicStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewLookbook: () => void;
}

export const AlgorithmicStylistModal: React.FC<AlgorithmicStylistModalProps> = ({
  isOpen,
  onClose,
  onViewLookbook,
}) => {
  if (!isOpen) return null;

  const [budget, setBudget] = useState('₹3,000');
  const [occasion, setOccasion] = useState('Wedding Guest');
  const [isGenerating, setIsGenerating] = useState(false);

  const [assembledLook, setAssembledLook] = useState({
    title: 'The Organza Cape & Temple Silver Wedding Look',
    totalPrice: 2848,
    originalTotal: 4999,
    savingsPercent: 43,
    pieces: [
      {
        role: 'Primary Garment',
        name: 'Pre-Draped Organza Cape Saree in Rose Gold',
        store: 'AJIO Luxe',
        price: 1599,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      },
      {
        role: 'Artisanal Accent',
        name: 'Oxidized Silver Pearl Coin Choker',
        store: 'Myntra / Amrapali',
        price: 699,
        originalPrice: 1100,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
      },
      {
        role: 'Footwear',
        name: 'Hand-Embroidered Zari Mojaris',
        store: 'Fabindia / Tata CLiQ',
        price: 550,
        originalPrice: 900,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80',
      },
    ],
  });

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAssembledLook({
        title: occasion === 'College OOTD' 
          ? 'Indigo Bagru Kurti & Chunky Silver Streetwear Fit'
          : occasion === 'Indo-Western Work'
          ? 'Ecru Linen Trench Kurta & Straight Trousers'
          : 'The Emerald Chanderi Cape & Kundan Earring Ensemble',
        totalPrice: budget === '₹2,000' ? 1890 : budget === '₹5,000' ? 4490 : 2748,
        originalTotal: budget === '₹2,000' ? 3200 : budget === '₹5,000' ? 7800 : 4850,
        savingsPercent: 41,
        pieces: [
          {
            role: 'Primary Garment',
            name: occasion === 'College OOTD' ? 'Bagru Handblock Mulmul Kurti' : 'Chanderi Gold Foil Cape Suit',
            store: 'Myntra Indie',
            price: budget === '₹2,000' ? 1099 : 1499,
            originalPrice: budget === '₹2,000' ? 1899 : 2800,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
          },
          {
            role: 'Artisanal Accent',
            name: 'Kashmiri Filigree Drop Earrings',
            store: 'Nykaa Fashion',
            price: 599,
            originalPrice: 950,
            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
          },
          {
            role: 'Accessories',
            name: 'Woven Raw Silk Potli Pouch',
            store: 'SHEIN India',
            price: budget === '₹2,000' ? 192 : 650,
            originalPrice: budget === '₹2,000' ? 350 : 1100,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
          },
        ],
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#161616] w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#C83818]" />
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#161616]">
                Algorithmic Indian Stylist
              </h3>
              <p className="text-[10px] text-[#8E8A85] uppercase tracking-wider">
                Cross-Index 8+ Stores Under Budget
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#C83818]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 bg-[#F5F1EB] p-3 border border-[#EAE5DE]">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Target Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-2 text-xs font-semibold text-[#161616] focus:outline-none"
            >
              <option value="Wedding Guest">Wedding Guest 2026</option>
              <option value="College OOTD">College OOTD / Fusion</option>
              <option value="Indo-Western Work">Indo-Western Workwear</option>
              <option value="Festive Brunch">Festive Brunch &amp; Puja</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Budget Cap
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE5DE] p-2 text-xs font-semibold text-[#161616] focus:outline-none"
            >
              <option value="₹2,000">Under ₹2,000 (Budget Steals)</option>
              <option value="₹3,000">Under ₹3,000 (Sweetspot)</option>
              <option value="₹5,000">Under ₹5,000 (Premium D2C)</option>
            </select>
          </div>
        </div>

        {/* Generate / Refresh Button */}
        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="w-full py-2.5 bg-[#F5F1EB] border border-[#161616] hover:bg-[#161616] hover:text-white text-[#161616] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Scouting 8 Indian Stores...' : 'Re-Assemble Look with Live Arbitrage'}</span>
        </button>

        {/* Result Look Preview */}
        <div className="border border-[#EAE5DE] bg-[#F5F1EB] p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-bold text-[#C83818] uppercase tracking-wider">
                COMPOSITE LOOK MATCHED
              </span>
              <h4 className="font-editorial text-base font-bold text-[#161616]">
                {assembledLook.title}
              </h4>
            </div>

            <div className="text-right">
              <div className="font-editorial text-lg font-bold text-[#161616]">
                ₹{assembledLook.totalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#C83818] font-semibold">
                Save {assembledLook.savingsPercent}% (was ₹{assembledLook.originalTotal.toLocaleString('en-IN')})
              </div>
            </div>
          </div>

          {/* 3 Pieces Grid */}
          <div className="space-y-2 pt-1">
            {assembledLook.pieces.map((piece, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] p-2.5 border border-[#EAE5DE] flex items-center justify-between space-x-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={piece.image}
                    alt={piece.name}
                    className="w-12 h-12 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[9px] font-bold text-[#8E8A85] uppercase">
                      {piece.role} • {piece.store}
                    </span>
                    <h5 className="font-editorial text-xs font-semibold text-[#161616] line-clamp-1">
                      {piece.name}
                    </h5>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-editorial text-xs font-bold text-[#161616]">
                    ₹{piece.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8E8A85] line-through">
                    ₹{piece.originalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-[#EAE5DE] text-xs font-semibold uppercase text-[#8E8A85] hover:text-[#161616]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onViewLookbook();
            }}
            className="flex-2 py-3 bg-[#161616] text-[#FAF8F5] hover:bg-[#3A3836] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
          >
            <span>View Full Dossier &amp; Links</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
