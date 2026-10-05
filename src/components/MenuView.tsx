import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DrinkCard } from './DrinkCard';
import { DrinkCategory } from '../types';
import { Search, Sparkles, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react';

export const MenuView: React.FC = () => {
  const {
    menuItems,
    selectedRoastery,
    setViewingRoasteryDetail,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveTab,
  } = useApp();

  const categories: { id: DrinkCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'signature', label: 'Signature' },
    { id: 'pourover', label: 'Pour Overs' },
    { id: 'espresso', label: 'Espresso' },
    { id: 'matcha_tea', label: 'Matcha & Tea' },
    { id: 'iced_coldbrew', label: 'Cold Brew' },
    { id: 'bakery', label: 'Bakery' },
  ];

  const filteredItems = menuItems.filter((item) => {
    // Check category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Check search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchTagline = item.tagline.toLowerCase().includes(q);
      const matchNotes = item.roastNotes?.some((n) => n.toLowerCase().includes(q)) ?? false;
      return matchName || matchTagline || matchNotes;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Active Roastery Selector Banner */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#ECE5DB] flex items-center justify-between">
        <button
          onClick={() => setViewingRoasteryDetail(selectedRoastery)}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#EFE8DD] shrink-0">
            <img
              src={selectedRoastery.heroImage}
              alt={selectedRoastery.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display font-semibold text-[#2C241E] text-xs sm:text-sm">
                {selectedRoastery.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A796C]" />
            </div>
            <p className="text-[11px] text-[#7A6B60] flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#8C5542]" />
              <span>{selectedRoastery.neighborhood}</span>
              <span>·</span>
              <span>{selectedRoastery.walkTime}</span>
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F6F1EA] hover:bg-[#EDE5DA] text-[#4A3B31] text-xs font-semibold transition-colors shrink-0"
        >
          Switch
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8C7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search iced lattes, pour overs, matcha, pastries..."
          className="w-full min-h-[44px] pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-[#ECE5DB] text-xs text-[#2C241E] placeholder:text-[#A39486] focus:outline-none focus:border-[#3D3027] transition-colors"
        />
      </div>

      {/* Category Tabs (Segmented Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#3E3027] text-white shadow-2xs'
                  : 'bg-white border border-[#ECE5DB] text-[#69594C] hover:border-[#DACFBF]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs text-[#7A6B60]">
          <span className="font-semibold text-[#2C241E]">
            {selectedCategory === 'all'
              ? 'Handcrafted Drink & Food Menu'
              : categories.find((c) => c.id === selectedCategory)?.label}
          </span>
          <span className="font-mono tabular-nums">{filteredItems.length} items</span>
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <DrinkCard key={item.id} item={item} />)
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#ECE5DB] space-y-2">
            <p className="text-xs text-[#6A5A4E] font-medium">No items found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-[#8C5542] underline font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
