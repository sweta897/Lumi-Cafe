import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

interface DrinkCardProps {
  item: MenuItem;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ item }) => {
  const { openCustomizer } = useApp();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => openCustomizer(item)}
      className="group bg-white rounded-2xl p-3 border border-[#ECE5DA] hover:border-[#DACFBF] transition-all cursor-pointer flex gap-3.5 items-center relative active:scale-[0.99]"
    >
      {/* Visual Image container with 1:1 / 4:3 thumbnail */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F3EDE3] shrink-0">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-2 bg-[#F3EDE3] text-center text-[#736458] text-xs">
            {item.name}
          </div>
        )}

        {/* Quiet popular label - no garish pills, clean unboxed indicator */}
        {item.popular && (
          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#2C241E]/80 backdrop-blur-xs text-[10px] font-medium text-[#F4EDE2]">
            Barista Pick
          </span>
        )}
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0 pr-10">
        <h4 className="font-display text-sm sm:text-base font-semibold text-[#2C241E] leading-snug group-hover:text-[#6A4D3B] transition-colors truncate">
          {item.name}
        </h4>
        
        <p className="text-xs text-[#7A6B5F] line-clamp-1 mt-0.5 font-normal">
          {item.tagline}
        </p>

        {/* Tasting notes or calorie metadata */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8C7D73] mt-2">
          {item.roastNotes && item.roastNotes.length > 0 ? (
            <span className="truncate max-w-[190px]">{item.roastNotes.join(' · ')}</span>
          ) : (
            <span>Handmade Fresh Daily</span>
          )}
          {item.calories && (
            <>
              <span aria-hidden="true" className="text-[#CFBEAF]">·</span>
              <span className="font-mono tabular-nums">{item.calories} kcal</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 text-sm font-semibold font-mono tabular-nums text-[#3E3026]">
          ${item.price.toFixed(2)}
        </div>
      </div>

      {/* Add / Customize Button with 44x44px hitbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          openCustomizer(item);
        }}
        className="absolute right-3 bottom-3 min-w-[44px] min-h-[44px] rounded-xl bg-[#F4EFE6] group-hover:bg-[#EAE1D3] text-[#47382D] flex items-center justify-center transition-colors shadow-2xs"
        aria-label={`Customize and add ${item.name}`}
      >
        <Plus className="w-5 h-5 stroke-[2.2]" />
      </button>
    </div>
  );
};
