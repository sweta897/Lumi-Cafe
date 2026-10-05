import React, { useState } from 'react';
import { Roastery } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, MapPin, Check, Info } from 'lucide-react';

interface RoasteryCardProps {
  roastery: Roastery;
}

export const RoasteryCard: React.FC<RoasteryCardProps> = ({ roastery }) => {
  const { selectedRoastery, setSelectedRoastery, setActiveTab, setViewingRoasteryDetail } = useApp();
  const [imgError, setImgError] = useState(false);

  const isSelected = selectedRoastery.id === roastery.id;

  const handleSelect = () => {
    setSelectedRoastery(roastery);
  };

  const handleOrder = () => {
    setSelectedRoastery(roastery);
    setActiveTab('menu');
  };

  return (
    <article
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
        isSelected
          ? 'bg-white border-[#C9B6A3] shadow-sm ring-1 ring-[#C9B6A3]/30'
          : 'bg-white/80 border-[#EBE4D8] hover:border-[#D5C7B7]'
      }`}
    >
      {/* Image container with 4:3 ratio & zero broken image policy */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EFE9DF]">
        {!imgError ? (
          <img
            src={roastery.heroImage}
            alt={roastery.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F5EFE6] to-[#ECE3D5] text-[#69584B]">
            <span className="font-display text-lg font-semibold">{roastery.name}</span>
            <span className="text-xs text-[#8A796C] mt-1">Specialty Micro-Roaster</span>
          </div>
        )}

        {/* Selected status watermark tag - subtle */}
        {isSelected && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#2C241E]/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
            <Check className="w-3 h-3 text-[#E2C799]" />
            <span>Active Roastery</span>
          </div>
        )}

        {/* Info button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewingRoasteryDetail(roastery);
          }}
          className="absolute top-3 right-3 min-w-[36px] min-h-[36px] rounded-full bg-white/85 backdrop-blur-md text-[#4A3B31] flex items-center justify-center hover:bg-white transition-colors shadow-xs"
          title="View roastery story & roast schedule"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-2.5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-[#2C241E] leading-snug">
              {roastery.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-[#524439] font-medium shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#D4A359] text-[#D4A359]" />
              <span className="font-mono tabular-nums">{roastery.rating.toFixed(2)}</span>
              <span className="text-[#8E7E73]">({roastery.reviewsCount})</span>
            </div>
          </div>
          
          <p className="text-xs text-[#736356] font-normal italic mt-0.5 line-clamp-1">
            "{roastery.tagline}"
          </p>
        </div>

        {/* Clean Unboxed Metadata with · separator */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7C6C60] pt-0.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#A8988B]" />
            {roastery.neighborhood}
          </span>
          <span aria-hidden="true" className="text-[#BEB2A6]">·</span>
          <span>{roastery.distance}</span>
          <span aria-hidden="true" className="text-[#BEB2A6]">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#A8988B]" />
            {roastery.walkTime}
          </span>
        </div>

        {/* Roasting Schedule & Origins snippet */}
        <div className="bg-[#FAF7F2] rounded-xl p-2.5 text-xs space-y-1 border border-[#EFE8DD]">
          <div className="flex items-center justify-between text-[#857467] text-[11px]">
            <span className="font-medium text-[#5A493C]">Roast Profile</span>
            <span className="truncate max-w-[160px] text-right">{roastery.roastSchedule.split(' ')[0]} roast</span>
          </div>
          <p className="text-[#645447] text-[11px] leading-relaxed line-clamp-1">
            <span className="text-[#8A796D]">Origins:</span> {roastery.specialtyOrigins.join(' · ')}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSelect}
            className={`flex-1 min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              isSelected
                ? 'bg-[#EAE2D5] text-[#3D3025]'
                : 'bg-[#F2ECE1] text-[#59483C] hover:bg-[#EAE2D5]'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#59483C]" />
                Selected
              </>
            ) : (
              'Set as Location'
            )}
          </button>
          
          <button
            onClick={handleOrder}
            className="flex-1 min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF7F2] transition-colors flex items-center justify-center gap-1 shadow-xs active:scale-[0.98]"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </article>
  );
};
