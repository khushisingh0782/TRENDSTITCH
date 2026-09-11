import React from 'react';
import { Compass, TrendingUp, BookmarkCheck, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  savedCount = 38,
}) => {
  const tabs = [
    {
      id: 'discover' as TabType,
      label: 'Discover',
      icon: Compass,
    },
    {
      id: 'trend-radar' as TabType,
      label: 'Trend Radar',
      icon: TrendingUp,
    },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: BookmarkCheck,
      badge: savedCount,
    },
    {
      id: 'taste' as TabType,
      label: 'Taste',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#EAE5DE] shadow-sm">
      <div className="max-w-4xl mx-auto h-16 px-3 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all relative ${
                isActive ? 'text-[#161616]' : 'text-[#8E8A85] hover:text-[#3A3836]'
              }`}
            >
              {/* Active top line accent */}
              {isActive && (
                <div className="absolute -top-[1px] w-8 h-[2px] bg-[#C83818]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
                {tab.id === 'saved' && tab.badge && (
                  <span className="sr-only">{tab.badge} saved fits</span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-wider mt-1 ${
                  isActive ? 'font-semibold text-[#161616]' : 'font-normal text-[#8E8A85]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
