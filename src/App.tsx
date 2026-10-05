/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { ExploreView } from './components/ExploreView';
import { MenuView } from './components/MenuView';
import { OrderTracker } from './components/OrderTracker';
import { LoyaltyView } from './components/LoyaltyView';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { CartSheet } from './components/CartSheet';
import { RoasteryDetailModal } from './components/RoasteryDetailModal';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, cartCount, cartTotal, setIsCartOpen } = useApp();

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header />

      {/* Main Tab Screen Area */}
      <main className="flex-1 px-4 pt-4">
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'menu' && <MenuView />}
        {activeTab === 'activity' && <OrderTracker />}
        {activeTab === 'rewards' && <LoyaltyView />}
      </main>

      {/* Floating Bottom Quick Cart Bar (Thumb Zone) when items exist & not on Activity */}
      {cartCount > 0 && activeTab !== 'activity' && (
        <div className="sticky bottom-18 px-4 z-20 pointer-events-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF8F5] font-semibold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-black/15 transition-all active:scale-[0.98] border border-[#524135]"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E5BA75] text-[#2C241E] text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
              <span>View Pre-Order Bag</span>
            </div>
            <div className="flex items-center gap-2 font-mono tabular-nums">
              <span>${cartTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar />

      {/* Overlays and Modals */}
      <DrinkCustomizerModal />
      <CartSheet />
      <RoasteryDetailModal />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
