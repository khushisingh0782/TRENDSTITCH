import React from 'react';
import { Search, Bell, Sparkles, ShieldCheck, Database } from 'lucide-react';
import { TabType, TasteProfile } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  tasteProfile: TasteProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenCatalogHealth?: () => void;
  showTicker?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  tasteProfile,
  unreadCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenCatalogHealth,
  showTicker = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DE]">
      {/* Main Bar */}
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left Logo / Img square */}
        <div className="flex items-center space-x-3">
          <button
            id="header-brand-badge"
            onClick={() => onTabChange('discover')}
            className="w-10 h-7 bg-[#161616] text-[#FAF8F5] flex items-center justify-center font-editorial text-xs tracking-wider cursor-pointer hover:bg-[#3A3836] transition-colors"
          >
            TS
          </button>
          
          <div className="flex flex-col text-left">
            <span className="font-editorial text-lg tracking-tight font-semibold text-[#161616] leading-none">
              TRENDSTITCH
            </span>
            <span className="text-[9px] font-medium tracking-[0.18em] text-[#C83818] uppercase mt-0.5">
              INDIA EDITION
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Catalog Health & Provenance Audit Button */}
          {onOpenCatalogHealth && (
            <button
              id="header-catalog-health-btn"
              onClick={onOpenCatalogHealth}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md transition flex items-center gap-1.5 shadow-xs"
              title="Open Catalog Health & Provenance Audit Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Catalog Audit</span>
              <span className="text-[10px] px-1 py-0.2 bg-emerald-200 text-emerald-950 font-bold rounded">0 Dups</span>
            </button>
          )}

          {/* Quick Search */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2 text-[#161616] hover:text-[#C83818] transition-colors relative"
            aria-label="Search Trends"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Bell with unread dot */}
          <button
            id="header-notifications-btn"
            onClick={onOpenNotifications}
            className="p-2 text-[#161616] hover:text-[#C83818] transition-colors relative"
            aria-label="Price Drop Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C83818] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile Avatar -> switches to Taste tab */}
          <button
            id="header-profile-avatar-btn"
            onClick={() => onTabChange('taste')}
            className={`relative p-0.5 border ${
              currentTab === 'taste' ? 'border-[#C83818]' : 'border-transparent'
            } transition-all rounded-full overflow-hidden`}
            aria-label="View Taste Profile"
          >
            <img
              src={tasteProfile.avatar}
              alt={tasteProfile.name}
              className="w-7 h-7 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-600 rounded-full border border-white" />
          </button>
        </div>
      </div>

      {/* Radar Live Ticker */}
      {showTicker && (
        <div className="bg-[#161616] text-[#FAF8F5] text-[10px] font-medium tracking-wide py-1 px-4 flex items-center overflow-hidden border-t border-[#3A3836]">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C83818] animate-pulse" />
              <span className="text-[#C83818] font-bold uppercase tracking-wider">PRICE RADAR</span>
              <span className="text-[#8E8A85]">|</span>
              <span className="text-[#FAF8F5] font-semibold uppercase tracking-wider">VERIFIED MOVERS:</span>
            </div>
            <div className="ml-2 truncate text-[#FAF8F5]/90 flex-1">
              Puma Chunky Sneakers dropped to ₹2,199 on Flipkart • Levi's Trucker dropped ₹700 on Myntra
            </div>
            {onOpenCatalogHealth ? (
              <button
                onClick={onOpenCatalogHealth}
                className="text-stone-300 hover:text-white text-[9px] font-medium underline underline-offset-2 shrink-0 pl-2 cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>215 Real Verified • 802 Demo • 0 Duplicates (Audit)</span>
              </button>
            ) : (
              <div className="text-[#8E8A85] text-[9px] shrink-0 pl-2">
                215 Real Verified • 802 Demo
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
