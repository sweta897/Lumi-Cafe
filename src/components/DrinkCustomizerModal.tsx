import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomizationOptions } from '../types';
import { X, Sparkles, Check, Plus, Minus, Coffee } from 'lucide-react';

export const DrinkCustomizerModal: React.FC = () => {
  const { customizingItem, closeCustomizer, addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'regular' | 'large'>('regular');
  const [temperature, setTemperature] = useState<'iced' | 'hot'>('iced');
  const [milk, setMilk] = useState<'oat' | 'whole' | 'almond' | 'pistachio' | 'none'>('oat');
  const [shots, setShots] = useState<'single' | 'double' | 'triple' | 'decaf'>('double');
  const [sweetness, setSweetness] = useState<0 | 25 | 50 | 100>(25);
  const [syrup, setSyrup] = useState<'none' | 'vanilla' | 'lavender_cardamom' | 'salted_brown_sugar' | 'toasted_maple'>('vanilla');
  const [iceLevel, setIceLevel] = useState<'standard' | 'light' | 'sphere_cube'>('standard');
  const [bringOwnCup, setBringOwnCup] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!customizingItem) return null;

  // Calculate live item price
  let currentUnitPrice = customizingItem.price;
  if (size === 'large') currentUnitPrice += 0.75;
  if (milk === 'pistachio') currentUnitPrice += 0.80;
  if (shots === 'triple') currentUnitPrice += 1.00;
  if (syrup !== 'none' && !customizingItem.isFood) currentUnitPrice += 0.50;

  const totalCalculated = currentUnitPrice * quantity;

  const handleConfirm = () => {
    const finalOptions: CustomizationOptions = {
      size,
      temperature,
      milk,
      shots,
      sweetness,
      syrup,
      iceLevel,
      bringOwnCup,
      specialInstructions,
    };
    addToCart(customizingItem, finalOptions, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-t-3xl shadow-xl max-h-[92vh] flex flex-col overflow-hidden border-t border-[#EAE3D6] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-[#DACFBF] rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 pb-3 flex items-start justify-between border-b border-[#EBE4D7]">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#2C241E]">
              {customizingItem.name}
            </h3>
            <p className="text-xs text-[#7B6C60] line-clamp-1 mt-0.5">
              {customizingItem.tagline}
            </p>
          </div>
          <button
            onClick={closeCustomizer}
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#EFE9DF] text-[#594B40] hover:bg-[#E5DDCF] flex items-center justify-center transition-colors -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Customization Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm">
          {/* Size (Drink only) */}
          {!customizingItem.isFood && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Cup Size</span>
                <span className="text-[11px] text-[#867568]">Choose volume</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSize('regular')}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    size === 'regular'
                      ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                      : 'border-[#EBE4D7] bg-white text-[#635347] hover:border-[#D5C8B8]'
                  }`}
                >
                  <span className="font-medium text-xs">Regular (12 oz)</span>
                  <span className="text-xs font-mono text-[#867568]">Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSize('large')}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                    size === 'large'
                      ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                      : 'border-[#EBE4D7] bg-white text-[#635347] hover:border-[#D5C8B8]'
                  }`}
                >
                  <span className="font-medium text-xs">Large (16 oz)</span>
                  <span className="text-xs font-mono text-[#867568]">+$0.75</span>
                </button>
              </div>
            </div>
          )}

          {/* Temperature (Drink only) */}
          {!customizingItem.isFood && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Temperature</span>
                <span className="text-[11px] text-[#867568]">Hot or Iced</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemperature('iced')}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-medium transition-colors ${
                    temperature === 'iced'
                      ? 'border-[#3D3027] bg-[#E7EFF0] text-[#244247]'
                      : 'border-[#EBE4D7] bg-white text-[#635347]'
                  }`}
                >
                  Iced (Chilled)
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('hot')}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-medium transition-colors ${
                    temperature === 'hot'
                      ? 'border-[#3D3027] bg-[#F7ECE4] text-[#633C29]'
                      : 'border-[#EBE4D7] bg-white text-[#635347]'
                  }`}
                >
                  Hot (Silky Microfoam)
                </button>
              </div>
            </div>
          )}

          {/* Milk Selection */}
          {!customizingItem.isFood && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Milk Choice</span>
                <span className="text-[11px] text-[#867568]">Plant & Organic options</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'oat' as const, label: 'Minor Figures Oat', price: 'Included' },
                  { id: 'whole' as const, label: 'Organic Whole Milk', price: 'Included' },
                  { id: 'almond' as const, label: 'Sprouted Almond', price: 'Included' },
                  { id: 'pistachio' as const, label: 'House Pistachio Milk', price: '+$0.80' },
                  { id: 'none' as const, label: 'No Milk / Black', price: 'Included' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMilk(m.id)}
                    className={`min-h-[44px] p-2 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      milk === m.id
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                        : 'border-[#EBE4D7] bg-white text-[#635347]'
                    }`}
                  >
                    <span className="font-medium text-xs truncate max-w-[130px]">{m.label}</span>
                    <span className="text-[11px] font-mono text-[#867568]">{m.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Espresso Shots */}
          {!customizingItem.isFood && customizingItem.category !== 'matcha_tea' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Espresso Strength</span>
                <span className="text-[11px] text-[#867568]">Dialed-in extraction</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'single' as const, label: 'Single Shot', sub: 'Light' },
                  { id: 'double' as const, label: 'Double (Std)', sub: 'Balanced' },
                  { id: 'triple' as const, label: 'Triple Shot', sub: '+$1.00' },
                  { id: 'decaf' as const, label: 'Swiss Decaf', sub: 'Water process' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShots(s.id)}
                    className={`min-h-[44px] p-2 rounded-xl border text-center transition-colors ${
                      shots === s.id
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                        : 'border-[#EBE4D7] bg-white text-[#635347]'
                    }`}
                  >
                    <div className="font-medium text-xs leading-none">{s.label}</div>
                    <div className="text-[10px] text-[#867568] mt-1">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Artisanal Syrups */}
          {!customizingItem.isFood && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">House Botanical Syrups</span>
                <span className="text-[11px] text-[#867568]">+$0.50 each</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none' as const, label: 'None (Natural)' },
                  { id: 'vanilla' as const, label: 'Madagascar Vanilla Bean' },
                  { id: 'lavender_cardamom' as const, label: 'Lavender & Cardamom' },
                  { id: 'salted_brown_sugar' as const, label: 'Salted Brown Sugar' },
                  { id: 'toasted_maple' as const, label: 'Toasted Maple' },
                ].map((syr) => (
                  <button
                    key={syr.id}
                    type="button"
                    onClick={() => setSyrup(syr.id)}
                    className={`min-h-[44px] p-2 rounded-xl border text-left text-xs font-medium transition-colors ${
                      syrup === syr.id
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                        : 'border-[#EBE4D7] bg-white text-[#635347]'
                    }`}
                  >
                    <span className="line-clamp-1">{syr.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness Slider/Buttons */}
          {!customizingItem.isFood && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Sweetness</span>
                <span className="text-[11px] font-mono tabular-nums text-[#867568]">{sweetness}% Sweet</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 25, 50, 100].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSweetness(level as any)}
                    className={`min-h-[44px] py-2 rounded-xl border text-center text-xs font-medium transition-colors ${
                      sweetness === level
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                        : 'border-[#EBE4D7] bg-white text-[#635347]'
                    }`}
                  >
                    {level === 0 ? '0% Unsweet' : `${level}%`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ice Choice (if iced) */}
          {!customizingItem.isFood && temperature === 'iced' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#382D25] text-xs">Ice Cube Preference</span>
                <span className="text-[11px] text-[#867568]">Artisanal chilling</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard' as const, label: 'Standard Ice' },
                  { id: 'light' as const, label: 'Light Ice' },
                  { id: 'sphere_cube' as const, label: 'Clear Sphere Cube' },
                ].map((ice) => (
                  <button
                    key={ice.id}
                    type="button"
                    onClick={() => setIceLevel(ice.id)}
                    className={`min-h-[44px] p-2 rounded-xl border text-center text-xs font-medium transition-colors ${
                      iceLevel === ice.id
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E]'
                        : 'border-[#EBE4D7] bg-white text-[#635347]'
                    }`}
                  >
                    {ice.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reusable Mug Loyalty Bonus */}
          <div
            onClick={() => setBringOwnCup(!bringOwnCup)}
            className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              bringOwnCup
                ? 'bg-[#EFF5EE] border-[#B9D5B4] text-[#274828]'
                : 'bg-white border-[#EBE4D7] text-[#594B40]'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
              bringOwnCup ? 'bg-[#3A6B3C] border-[#3A6B3C] text-white' : 'border-[#C8BCAB] bg-white'
            }`}>
              {bringOwnCup && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-medium text-xs">
                <span>I'm bringing my own reusable cup / mug</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#DDECDC] text-[#284C29] text-[10px] font-semibold">
                  <Sparkles className="w-2.5 h-2.5" /> +20 pts
                </span>
              </div>
              <p className="text-[11px] text-[#716154] mt-0.5 leading-snug">
                Help eliminate single-use paper cups and earn +20 bonus loyalty points toward free drinks.
              </p>
            </div>
          </div>

          {/* Barista Notes */}
          <div>
            <label className="block text-xs font-medium text-[#382D25] mb-1.5">
              Special instructions for Barista (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra hot foam, sprinkle of cinnamon..."
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-white rounded-xl border border-[#EBE4D7] focus:outline-none focus:border-[#3D3027] text-[#2C241E] placeholder:text-[#A39486]"
            />
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="p-4 bg-white border-t border-[#EBE4D7] flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#EBE4D7] rounded-xl bg-[#FAF8F5] p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="min-w-[36px] min-h-[36px] rounded-lg text-[#594B40] hover:bg-[#EFE9DF] disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono tabular-nums font-semibold text-xs text-[#2C241E]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="min-w-[36px] min-h-[36px] rounded-lg text-[#594B40] hover:bg-[#EFE9DF] flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF8F5] font-semibold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Add to Pre-Order</span>
            <span className="font-mono tabular-nums">${totalCalculated.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
