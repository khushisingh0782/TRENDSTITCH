import React, { useState } from 'react';
import { X, Globe, Plus, Check } from 'lucide-react';

interface ConnectBoutiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (boutiqueName: string) => void;
}

export const ConnectBoutiqueModal: React.FC<ConnectBoutiqueModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [boutiqueUrl, setBoutiqueUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  const sampleBoutiques = [
    { name: 'Suta Bombay', url: 'https://suta.in' },
    { name: 'The Jodi Life', url: 'https://thejodilife.com' },
    { name: 'Pernia’s Pop-Up Shop', url: 'https://perniaspopupshop.com' },
    { name: 'Ogaan India', url: 'https://ogaan.com' },
  ];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boutiqueUrl.trim()) return;

    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(boutiqueUrl);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#161616] w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-lg font-bold text-[#161616]">
              Connect Boutique / D2C Store
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#C83818]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#3A3836]">
          Add custom Indian indie label or Shopify store to monitor price drops, restocks, and cart coupons automatically.
        </p>

        <form onSubmit={handleConnect} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Store URL or Domain
            </label>
            <input
              type="text"
              required
              value={boutiqueUrl}
              onChange={(e) => setBoutiqueUrl(e.target.value)}
              placeholder="https://thejodilife.com or ogaan.com"
              className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2.5 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
              Popular Indian Indie Designers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleBoutiques.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setBoutiqueUrl(b.url)}
                  className="text-[10px] bg-[#F5F1EB] hover:bg-[#161616] hover:text-white px-2 py-1 border border-[#EAE5DE] transition-colors cursor-pointer"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold uppercase text-[#8E8A85] hover:text-[#161616]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="flex-2 py-2.5 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition-colors"
            >
              {success ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CONNECTED TO CRAWLER</span>
                </>
              ) : isConnecting ? (
                <span>Validating Sitemap...</span>
              ) : (
                <span>Add to Scraper Engine</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
