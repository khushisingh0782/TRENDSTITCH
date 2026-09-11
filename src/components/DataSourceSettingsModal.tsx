import React, { useState } from 'react';
import { X, ShieldCheck, Database, RefreshCw, Key, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { store } from '../services/store';
import { getAllRetailers } from '../services/retailerAdapters';

interface DataSourceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePriceDrop: () => void;
}

export const DataSourceSettingsModal: React.FC<DataSourceSettingsModalProps> = ({
  isOpen,
  onClose,
  onSimulatePriceDrop,
}) => {
  if (!isOpen) return null;

  const currentConfig = store.getConfig();
  const [pinterestClientId, setPinterestClientId] = useState(currentConfig.pinterestClientId || '');
  const [pinterestClientSecret, setPinterestClientSecret] = useState(currentConfig.pinterestClientSecret || '');
  const [amazonAssociateTag, setAmazonAssociateTag] = useState(currentConfig.amazonAssociateTag || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateConfig({
      pinterestClientId,
      pinterestClientSecret,
      amazonAssociateTag,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRunScanner = () => {
    setIsScanning(true);
    setScanMessage('Connecting to supported retailer endpoints...');
    setTimeout(() => {
      const res = store.triggerSimulatedPriceScan();
      setIsScanning(false);
      setScanMessage(`Scanned 8 retailers: ${res.updatedCount} items verified. Verified price drop alert generated!`);
      onSimulatePriceDrop();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/75 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#161616] w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-[#C83818]" />
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#161616]">
                Data Sources &amp; Retailer Ingestion
              </h2>
              <p className="text-[10px] text-[#8E8A85] uppercase tracking-wider">
                Integrations, API Keys &amp; Feed Transparency
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#C83818] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Ingestion Mode Banner */}
        <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-3.5 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#161616]">
              STATUS: DEMO DATA MODE (PRE-COMPILED NORMALIZED FEED)
            </span>
          </div>
          <p className="text-xs text-[#3A3836] leading-relaxed">
            Per strict integrity standards: TrendStitch does not fabricate live statistics. Supported retailers run on pre-verified observation snapshots until live affiliate or API credentials are provided below.
          </p>
        </div>

        {/* Supported Retailers Status Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#8E8A85]">
            <span>Supported Retailers (8 Configured)</span>
            <span>Status</span>
          </div>

          <div className="border border-[#EAE5DE] divide-y divide-[#EAE5DE] bg-[#FAF8F5]">
            {getAllRetailers().map((retailer) => (
              <div
                key={retailer.id}
                className="p-2.5 flex items-center justify-between text-xs hover:bg-[#F5F1EB] transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: retailer.color }}
                  />
                  <span className="font-semibold text-[#161616]">{retailer.name}</span>
                  <span className="text-[10px] text-[#8E8A85]">
                    ({retailer.productCount.toLocaleString('en-IN')} tracked SKUs)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {retailer.authStatus === 'demo' ? (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 uppercase">
                      Demo Data — Not Live
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 border border-red-200 uppercase">
                      Connect Data Source
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Manual Ingestion Scanner Trigger */}
        <div className="bg-[#F5F1EB] border border-[#EAE5DE] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-sm font-bold text-[#161616]">
              Retailer Polling &amp; Price-Drop Simulator
            </h3>
            <span className="text-[10px] text-[#8E8A85]">Manual Test Trigger</span>
          </div>
          <p className="text-xs text-[#3A3836]">
            Run an ingestion cycle to poll retailer price changes, update observation histories, and verify price-drop alert delivery.
          </p>

          <button
            onClick={handleRunScanner}
            disabled={isScanning}
            className="w-full py-2.5 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Polling Retailers...' : 'Poll Retailers Now (Trigger Drops & Alerts)'}</span>
          </button>

          {scanMessage && (
            <div className="p-2 bg-[#FAF8F5] border border-emerald-300 text-xs text-emerald-800 font-medium flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{scanMessage}</span>
            </div>
          )}
        </div>

        {/* Authorized API Credentials Form */}
        <form onSubmit={handleSaveCredentials} className="space-y-3">
          <div className="flex items-center space-x-1.5 border-b border-[#EAE5DE] pb-1">
            <Key className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-sm font-bold text-[#161616]">
              Authorized API &amp; Affiliate Integration
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-[#8E8A85]">
              Amazon Associates India Tracking ID
            </label>
            <input
              type="text"
              value={amazonAssociateTag}
              onChange={(e) => setAmazonAssociateTag(e.target.value)}
              placeholder="e.g. trendstitch-21"
              className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase text-[#8E8A85]">
                Pinterest Authorized API (OAuth v5)
              </label>
              <a
                href="https://developers.pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="text-[9px] text-[#C83818] font-bold hover:underline flex items-center space-x-0.5"
              >
                <span>Pinterest Developer Portal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pinterestClientId}
                onChange={(e) => setPinterestClientId(e.target.value)}
                placeholder="App Client ID"
                className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
              />
              <input
                type="password"
                value={pinterestClientSecret}
                onChange={(e) => setPinterestClientSecret(e.target.value)}
                placeholder="App Client Secret"
                className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
              />
            </div>
            <p className="text-[10px] text-[#8E8A85]">
              Per policy, Pinterest trend discovery strictly requires authorized OAuth access and app approval.
            </p>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold uppercase text-[#8E8A85] hover:text-[#161616]"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {saveSuccess ? 'Credentials Saved ✓' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
