import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoasteryCard } from './RoasteryCard';
import { Search, Compass, Sparkles, MapPin, Coffee, ArrowRight } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { roasteries, setActiveTab, setSelectedRoastery, loyaltyPoints } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredRoasteries = roasteries.filter((r) => {
    const q = filterQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.neighborhood.toLowerCase().includes(q) ||
      r.tagline.toLowerCase().includes(q) ||
      r.specialtyOrigins.some((o) => o.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Editorial Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#2D231C] text-[#FAF8F5] p-5 shadow-sm">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/roastery_cozy_minimalist_1791180925197.jpg"
            alt="Artisanal Cafe"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-[#DEC8B6] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#E5BA75]" />
            <span>Local Micro-Roasters Collective</span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">
              Pre-order artisanal sips, zero queue.
            </h2>
            <p className="text-xs text-[#D5C6B7] mt-1.5 leading-relaxed max-w-sm">
              Discover neighborhood small-batch roasteries. Handcrafted pour-overs, single origins, and ceremonial matcha made ready for your arrival.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => setActiveTab('menu')}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#2C241E] font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Explore Seasonal Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-[#F4ECE3] text-xs font-medium backdrop-blur-xs transition-colors"
            >
              View Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search roasteries, neighborhood, or bean lot..."
            className="w-full min-h-[44px] pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-[#ECE5DB] text-xs text-[#2C241E] placeholder:text-[#A39486] focus:outline-none focus:border-[#3D3027] transition-colors"
          />
        </div>

        {/* Quick Filter Tag Buttons (Functional Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { label: 'All Local', val: '' },
            { label: 'Kyoto Drip', val: 'Kyoto' },
            { label: 'Pour-Over', val: 'pour' },
            { label: 'Matcha Tea', val: 'matcha' },
            { label: 'Old Town', val: 'Old Town' },
          ].map((tag) => (
            <button
              key={tag.label}
              onClick={() => setFilterQuery(tag.val)}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors font-medium text-xs ${
                filterQuery === tag.val
                  ? 'bg-[#3E3027] text-white shadow-2xs'
                  : 'bg-white border border-[#ECE5DB] text-[#69594C] hover:border-[#DACFBF]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roasteries Feed Header */}
      <div className="flex items-baseline justify-between px-1">
        <div>
          <h3 className="font-display text-base font-semibold text-[#2C241E]">
            Nearby Roasters
          </h3>
          <p className="text-xs text-[#7B6C60]">
            Within walking distance of your current location
          </p>
        </div>
        <span className="text-xs text-[#8A796C] font-mono tabular-nums">
          {filteredRoasteries.length} available
        </span>
      </div>

      {/* Roasteries Cards */}
      <div className="space-y-4">
        {filteredRoasteries.length > 0 ? (
          filteredRoasteries.map((roastery) => (
            <RoasteryCard key={roastery.id} roastery={roastery} />
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#ECE5DB]">
            <Compass className="w-8 h-8 text-[#A6978A] mx-auto mb-2" />
            <p className="text-xs text-[#6A5A4E] font-medium">No roasteries matched "{filterQuery}"</p>
            <button
              onClick={() => setFilterQuery('')}
              className="mt-3 text-xs text-[#8C5542] underline font-medium"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Quality Standard Note */}
      <div className="p-4 rounded-2xl bg-[#F6F1EA] border border-[#EBE2D4] text-xs space-y-1">
        <span className="font-display font-semibold text-[#3D3027] flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-[#8C5542]" />
          Our Roastery Commitment
        </span>
        <p className="text-[#6D5E52] text-[11px] leading-relaxed">
          Every partner roastery sources directly from specialty smallholder coffee farms at $\ge$84 SCA cup scores and roasts within 10 days of service.
        </p>
      </div>
    </div>
  );
};
