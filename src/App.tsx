import React, { useState, useEffect } from 'react';
import { TabType, TasteProfile, Product } from './types';
import { INITIAL_TASTE_PROFILE } from './data/mockData';
import { store } from './services/store';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { TrendRadarScreen } from './components/screens/TrendRadarScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { TasteScreen } from './components/screens/TasteScreen';
import { ProductDetailPage } from './components/ProductDetailPage';
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { DataSourceSettingsModal } from './components/DataSourceSettingsModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [savedItems, setSavedItems] = useState(store.getSavedItems());
  const [unreadCount, setUnreadCount] = useState(store.getUnreadNotifCount());
  const [tasteProfile, setTasteProfile] = useState<TasteProfile>(INITIAL_TASTE_PROFILE);

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProducts([...store.getProducts()]);
      setSavedItems([...store.getSavedItems()]);
      setUnreadCount(store.getUnreadNotifCount());
      // Keep selectedProduct in sync if it is currently open
      if (selectedProduct) {
        const updated = store.getProductById(selectedProduct.id);
        if (updated) setSelectedProduct(updated);
      }
    });
    return unsubscribe;
  }, [selectedProduct]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const savedItemIds = new Set(savedItems.map((item) => item.product.id));

  const handleToggleSave = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowSaved = store.toggleSave(productId);
    if (isNowSaved) {
      showToast('Saved to your radar • Price drop tracking activated');
    } else {
      showToast('Removed from saved items');
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };

  const handleSetAlertTarget = (productId: string, targetPrice: number) => {
    store.updateAlertTarget(productId, targetPrice);
    showToast(`Alert set for ₹${targetPrice.toLocaleString('en-IN')}`);
  };

  const handleExportFeed = () => {
    const dataStr = JSON.stringify(
      {
        profile: tasteProfile,
        savedItems: store.getSavedItems(),
        config: store.getConfig(),
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trendstitch-intel-feed-${Date.now()}.json`;
    link.click();
    showToast('Wardrobe radar & intelligence feed exported');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#161616] flex flex-col font-sans selection:bg-[#C83818] selection:text-white">
      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#161616] text-[#FAF8F5] text-xs font-semibold px-4 py-2.5 shadow-xl border border-[#3A3836] flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C83818]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Routing: Product Intelligence View vs Main Screen Views */}
      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          onBack={handleCloseProductDetail}
          isSaved={savedItemIds.has(selectedProduct.id)}
          onToggleSave={handleToggleSave}
          onSelectProduct={handleSelectProduct}
          onSetAlertTarget={handleSetAlertTarget}
        />
      ) : (
        <>
          {/* Main Global Header */}
          <Header
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            tasteProfile={tasteProfile}
            unreadCount={unreadCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSearch={() => {
              setCurrentTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showTicker={currentTab === 'trend-radar' || currentTab === 'discover'}
          />

          {/* Main Screen Content */}
          <main className="flex-1">
            {currentTab === 'discover' && (
              <DiscoverScreen
                products={products}
                savedItemIds={savedItemIds}
                onToggleSave={handleToggleSave}
                onSelectProduct={handleSelectProduct}
                onOpenDataSourceSettings={() => setIsDataSourceModalOpen(true)}
              />
            )}

            {currentTab === 'trend-radar' && (
              <TrendRadarScreen
                products={products}
                savedItemIds={savedItemIds}
                onToggleSave={handleToggleSave}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentTab === 'saved' && (
              <SavedScreen
                savedItems={savedItems}
                onSelectProduct={handleSelectProduct}
                onRemoveSaved={(id) => handleToggleSave(id)}
                onNavigateToDiscover={() => setCurrentTab('discover')}
              />
            )}

            {currentTab === 'taste' && (
              <TasteScreen
                profile={tasteProfile}
                onUpdateProfile={(updated) => {
                  setTasteProfile(updated);
                  showToast('Taste preferences updated');
                }}
                onConnectBoutique={() => setIsDataSourceModalOpen(true)}
                onExportFeed={handleExportFeed}
              />
            )}
          </main>

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedCount={savedItems.length}
          />
        </>
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Data Sources, Retailer Ingestion & API Settings Modal */}
      <DataSourceSettingsModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        onSimulatePriceDrop={() => {
          showToast('Price drop simulated across retailer feed');
        }}
      />
    </div>
  );
}
