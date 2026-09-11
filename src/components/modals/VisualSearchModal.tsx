import React, { useState } from 'react';
import { X, Camera, Upload, CheckCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { LookbookItem } from '../../types';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (item?: LookbookItem) => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  if (!isOpen) return null;

  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultsFound, setResultsFound] = useState(false);

  const samplePresets = [
    {
      name: 'Tussar Cape Ensemble',
      url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Bagru Block Print Co-ord',
      url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Temple Silver Choker',
      url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleScan = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setIsScanning(true);
    setResultsFound(false);
    setTimeout(() => {
      setIsScanning(false);
      setResultsFound(true);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleScan(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#161616] w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-lg font-bold text-[#161616]">
              Visual Fashion Lens
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#C83818]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#3A3836]">
          Upload an Instagram screenshot or photo to find lowest price matches across Myntra, AJIO, SHEIN India, &amp; D2C brands.
        </p>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-[#EAE5DE] hover:border-[#161616] bg-[#F5F1EB] p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors block text-center">
          <Upload className="w-6 h-6 text-[#8E8A85]" />
          <span className="text-xs font-semibold text-[#161616]">
            Upload or take photo
          </span>
          <span className="text-[10px] text-[#8E8A85]">
            Supports JPG, PNG • Max 10MB
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* Preset Sample Quick Clicks */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
            Or Test With Sample Curated Looks:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {samplePresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleScan(preset.url)}
                className="p-1.5 border border-[#EAE5DE] hover:border-[#161616] bg-[#F5F1EB] text-left space-y-1 cursor-pointer transition-colors"
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-16 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[9px] font-semibold text-[#161616] truncate">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scanning State */}
        {isScanning && (
          <div className="p-4 bg-[#161616] text-[#FAF8F5] text-center space-y-2 animate-pulse">
            <Sparkles className="w-5 h-5 mx-auto text-[#C83818] animate-spin" />
            <div className="text-xs font-semibold uppercase tracking-wider">
              Analyzing silhouette &amp; textile weave...
            </div>
            <div className="text-[10px] text-[#8E8A85]">
              Cross-referencing 12 Indian platforms
            </div>
          </div>
        )}

        {/* Results Found */}
        {resultsFound && (
          <div className="p-3 bg-[#F5F1EB] border border-[#161616] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Exact Match Found (98% Confidence)</span>
              </span>
              <span className="text-[10px] text-[#8E8A85]">4 Stores</span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={selectedImage || samplePresets[0].url}
                alt=""
                className="w-16 h-20 object-cover border border-[#EAE5DE]"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <h4 className="font-editorial text-sm font-bold text-[#161616]">
                  Raw Tussar Silk Asymmetric Cape
                </h4>
                <div className="text-xs font-bold text-[#C83818]">
                  Lowest: ₹2,149 on SHEIN India
                </div>
                <div className="text-[10px] text-[#8E8A85]">
                  Save 46% vs Nykaa Fashion (₹2,999)
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectResult();
              }}
              className="w-full py-2.5 bg-[#161616] text-[#FAF8F5] hover:bg-[#3A3836] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1"
            >
              <span>Inspect Lookbook Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
