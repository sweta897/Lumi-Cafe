import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ShoppingBag, Sparkles, ChevronDown, Smartphone, Monitor } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedRoastery,
    setViewingRoasteryDetail,
    cartCount,
    setIsCartOpen,
    loyaltyPoints,
    setActiveTab,
    isPhoneFrame,
    setIsPhoneFrame,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#ECE5DB] px-4 py-2.5">
      <div className="flex items-center justify-between">
        {/* Brand / Roastery selector */}
        <button
          onClick={() => setViewingRoasteryDetail(selectedRoastery)}
          className="flex items-center gap-2 text-left group min-h-[44px] -ml-1 pl-1 pr-2 rounded-xl hover:bg-[#F2ECE2] transition-colors"
          title="View roastery details & origins"
        >
          <div className="w-8 h-8 rounded-full bg-[#EAE3D6] flex items-center justify-center text-[#59493E] text-xs font-semibold">
            {selectedRoastery.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-sm font-semibold text-[#2C241E] leading-tight group-hover:text-[#644D3D] transition-colors">
                {selectedRoastery.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A796D] group-hover:translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-[#7C6E64] flex items-center gap-1 leading-none mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#A39284] shrink-0" />
              <span className="truncate max-w-[150px]">{selectedRoastery.neighborhood}</span>
              <span>·</span>
              <span>{selectedRoastery.walkTime}</span>
            </p>
          </div>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Quick Points badge */}
          <button
            onClick={() => setActiveTab('rewards')}
            className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#EFE9DC] hover:bg-[#E7DFC0] text-[#52443A] text-xs font-medium transition-colors min-h-[44px]"
            title="View Loyalty Points & Stamps"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#967C58]" />
            <span className="font-mono tabular-nums font-semibold text-[11px]">{loyaltyPoints}</span>
            <span className="text-[10px] text-[#7A6B5F]">pts</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#F2ECE2] text-[#3A2F28] transition-colors"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5 text-[#3A2F28]" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8E5A47] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Viewport Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-xl text-[#7E7065] hover:text-[#2C241E] hover:bg-[#F2ECE2] transition-colors text-xs"
            title={isPhoneFrame ? "Switch to fluid full width" : "Switch to mobile phone frame"}
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
