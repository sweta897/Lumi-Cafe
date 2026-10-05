import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Coffee, Clock3, Award } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, activeOrder, stampCount } = useApp();

  const tabs = [
    {
      id: 'explore' as const,
      label: 'Roasteries',
      icon: Store,
    },
    {
      id: 'menu' as const,
      label: 'Order',
      icon: Coffee,
    },
    {
      id: 'activity' as const,
      label: 'Tracker',
      icon: Clock3,
      badge: activeOrder && activeOrder.status !== 'picked_up' ? 'live' : null,
    },
    {
      id: 'rewards' as const,
      label: 'Rewards',
      icon: Award,
      stampText: `${stampCount}/8`,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-t border-[#ECE5DB] pb-safe px-3"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative ${
                isActive ? 'text-[#3E2F26]' : 'text-[#8C7D73] hover:text-[#56453B]'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-[#EDE5DA]' : 'bg-transparent'
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />
                </div>

                {/* Live pulsing dot for active tracker */}
                {tab.badge === 'live' && (
                  <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B26B50] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B26B50]"></span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[11px] tracking-tight leading-none ${
                    isActive ? 'font-semibold text-[#2C231D]' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
                {tab.stampText && (
                  <span className="text-[9px] font-mono tabular-nums text-[#8B7C72]">
                    · {tab.stampText}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
