import React from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Clock, Star, Flame, User, Check, Coffee } from 'lucide-react';

export const RoasteryDetailModal: React.FC = () => {
  const {
    viewingRoasteryDetail,
    setViewingRoasteryDetail,
    setSelectedRoastery,
    setActiveTab,
  } = useApp();

  if (!viewingRoasteryDetail) return null;

  const handleSelectAndOrder = () => {
    setSelectedRoastery(viewingRoasteryDetail);
    setViewingRoasteryDetail(null);
    setActiveTab('menu');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#EAE3D6] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE4D8] shrink-0">
          <img
            src={viewingRoasteryDetail.heroImage}
            alt={viewingRoasteryDetail.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setViewingRoasteryDetail(null)}
            className="absolute top-3 right-3 min-w-[36px] min-h-[36px] rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title on Image Scrim */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-medium text-[#E8D9C8] uppercase tracking-wider">
              Artisan Micro-Roaster
            </span>
            <h3 className="font-display text-xl font-bold leading-tight">
              {viewingRoasteryDetail.name}
            </h3>
            <p className="text-xs text-[#EAE2D8] mt-0.5 line-clamp-1">
              {viewingRoasteryDetail.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Rating and Distance */}
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DB] text-[#6E5E52]">
            <div className="flex items-center gap-1.5 font-medium">
              <Star className="w-4 h-4 fill-[#D4A359] text-[#D4A359]" />
              <span className="font-mono tabular-nums text-sm font-semibold text-[#2C241E]">
                {viewingRoasteryDetail.rating}
              </span>
              <span>({viewingRoasteryDetail.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8C7D73]" />
              <span>{viewingRoasteryDetail.openingHours}</span>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A796C] font-semibold block mb-1">
              Roast Philosophy
            </span>
            <p className="text-[#594B40] leading-relaxed text-xs">
              {viewingRoasteryDetail.roastPhilosophy}
            </p>
          </div>

          {/* Sourced Origins */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#ECE5DB] space-y-2">
            <div className="flex items-center gap-1.5 text-[#3D3027] font-semibold">
              <Coffee className="w-3.5 h-3.5 text-[#8C5542]" />
              <span>Featured Single-Origin Lots</span>
            </div>
            <div className="space-y-1.5">
              {viewingRoasteryDetail.specialtyOrigins.map((origin, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-[#5D4E42] bg-[#FAF8F5] p-2 rounded-xl border border-[#F0E9DF]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8C5542]" />
                  <span className="font-medium">{origin}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Roast Schedule */}
          <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#EBE2D4] space-y-1">
            <div className="flex items-center gap-1.5 text-[#59483B] font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#A66144]" />
              <span>Roasting Schedule</span>
            </div>
            <p className="text-[#6D5D51] text-[11px] leading-relaxed">
              {viewingRoasteryDetail.roastSchedule}
            </p>
          </div>

          {/* Baristas on Shift */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A796C] font-semibold block mb-2">
              Baristas On Shift
            </span>
            <div className="grid grid-cols-2 gap-2">
              {viewingRoasteryDetail.baristasOnShift.map((barista, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-2.5 border border-[#ECE5DB] flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-[#EFE8DD] text-[#59493E] flex items-center justify-center font-bold text-xs shrink-0">
                    {barista.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-[#2C241E] block truncate">
                      {barista.name}
                    </span>
                    <span className="text-[10px] text-[#867568] block truncate">
                      {barista.specialty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="pt-2 text-xs text-[#7A6B60] flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8C5542] shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-[#2C241E] block">
                {viewingRoasteryDetail.address}
              </span>
              <span>{viewingRoasteryDetail.neighborhood} · {viewingRoasteryDetail.distance}</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-white border-t border-[#ECE5DB] shrink-0">
          <button
            onClick={handleSelectAndOrder}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF8F5] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Select Roastery & Browse Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
