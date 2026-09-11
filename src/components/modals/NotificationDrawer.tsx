import React from 'react';
import { X, Bell, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';
import { Product } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const notifications = store.getNotifications();
  const unreadCount = store.getUnreadNotifCount();

  const handleNotificationClick = (productId: string, notifId: string) => {
    store.markNotifRead(notifId);
    const prod = store.getProductById(productId);
    if (prod) {
      onSelectProduct(prod);
      onClose();
    }
  };

  const handleMarkAllRead = () => {
    store.markAllNotifsRead();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#161616]/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col border-l border-[#EAE5DE]">
        {/* Header */}
        <div className="p-4 border-b border-[#EAE5DE] flex items-center justify-between bg-[#F5F1EB]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-base font-semibold text-[#161616]">
              Price Drop &amp; Deal Radar
            </h3>
            {unreadCount > 0 && (
              <span className="bg-[#C83818] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            id="close-notifications-btn"
            onClick={onClose}
            className="p-1 hover:text-[#C83818] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#8E8A85] uppercase tracking-wider">
            <span>Verified Price Reconciliations</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[#C83818] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8E8A85]">
              No price drop notifications at this moment.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.productId, notif.id)}
                className={`p-3 border transition-colors cursor-pointer space-y-2 group ${
                  notif.isRead
                    ? 'bg-[#FAF8F5] border-[#EAE5DE] opacity-80'
                    : 'bg-[#F5F1EB] border-[#161616]/30 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#C83818] uppercase tracking-wider flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>{notif.retailerName}</span>
                  </span>
                  <span className="text-[#8E8A85]">{notif.timestamp}</span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="w-12 h-14 bg-[#ECE6DC] overflow-hidden shrink-0 border border-[#EAE5DE]">
                    <img
                      src={notif.productImage}
                      alt={notif.productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-editorial text-xs font-bold text-[#161616] group-hover:text-[#C83818] line-clamp-1">
                      {notif.productName}
                    </h4>
                    <p className="text-[11px] text-[#3A3836] line-clamp-2 leading-tight mt-0.5">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="pt-1.5 flex items-center justify-between border-t border-[#EAE5DE] text-xs">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-[#8E8A85] line-through text-[11px]">
                      ₹{notif.oldPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="font-editorial font-bold text-[#161616]">
                      ₹{notif.newPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#161616] flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#EAE5DE] bg-[#F5F1EB] text-[10px] text-[#8E8A85] text-center">
          TrendStitch polls Myntra, AJIO, Amazon &amp; Tata CLiQ continuously.
        </div>
      </div>
    </div>
  );
};
