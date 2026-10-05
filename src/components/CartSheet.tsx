import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Sparkles, Clock, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartSheet: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    selectedRoastery,
    appliedReward,
    applyReward,
    redeemedVouchers,
    loyaltyPoints,
    createOrder,
    setActiveTab,
  } = useApp();

  const [pickupTiming, setPickupTiming] = useState<'asap' | '15min' | '30min'>('asap');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const discount = appliedReward?.discountAmount ? Math.min(appliedReward.discountAmount, cartTotal) : 0;
  const discountedSubtotal = Math.max(0, cartTotal - discount);
  const tax = Number((discountedSubtotal * 0.0825).toFixed(2));
  const finalTotal = Number((discountedSubtotal + tax).toFixed(2));

  const hasReusableCup = cart.some((c) => c.customization.bringOwnCup);
  const estimatedPoints = Math.round(discountedSubtotal * 10) + (hasReusableCup ? 20 : 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      createOrder(pickupTiming);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-[#FAF8F5] rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border-t border-[#EAE3D6] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-[#DACFBF] rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-[#ECE5DB]">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#2C241E]">
              Your Pre-Order Bag
            </h3>
            <p className="text-xs text-[#7A6B5F]">
              Pickup at <span className="font-medium text-[#4A3B31]">{selectedRoastery.name}</span>
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#EFE9DF] text-[#594B40] hover:bg-[#E5DDCF] flex items-center justify-center transition-colors -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {cart.length === 0 ? (
          <div className="flex-1 px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#EFE8DC] flex items-center justify-center text-[#786758] mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="font-display text-base font-semibold text-[#2C241E]">
              Your bag is currently empty
            </h4>
            <p className="text-xs text-[#7B6C60] max-w-xs mt-1 leading-relaxed">
              Explore freshly roasted single-origin coffees, pour overs, and matcha treats from local micro-roasteries.
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveTab('menu');
              }}
              className="mt-6 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#3E3027] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B211A] transition-colors"
            >
              Browse Artisan Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
            {/* Pickup Timing Selector */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#ECE5DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2C241E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8E5A47]" />
                  Pickup Timing
                </span>
                <span className="text-[11px] text-[#867568]">Freshly ground to order</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { id: 'asap' as const, label: 'ASAP', sub: '5–8 mins' },
                  { id: '15min' as const, label: 'In 15m', sub: '15–18 mins' },
                  { id: '30min' as const, label: 'In 30m', sub: '30–35 mins' },
                ].map((timing) => (
                  <button
                    key={timing.id}
                    type="button"
                    onClick={() => setPickupTiming(timing.id)}
                    className={`min-h-[44px] p-2 rounded-xl border text-center transition-all ${
                      pickupTiming === timing.id
                        ? 'border-[#3D3027] bg-[#EFE9DF] text-[#2C241E] font-semibold'
                        : 'border-[#EAE3D6] bg-[#FAF8F5] text-[#69584B] hover:border-[#D5C7B7]'
                    }`}
                  >
                    <div>{timing.label}</div>
                    <div className="text-[10px] text-[#867568] font-normal">{timing.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[#857467]">
                <span className="font-medium text-[#4A3B31]">Items ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-[#A66150] hover:underline"
                >
                  Clear all
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#ECE5DB] flex gap-3 items-start"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F3EDE3] shrink-0">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-display font-semibold text-[#2C241E] text-xs leading-tight">
                        {item.menuItem.name}
                      </h5>
                      <span className="font-mono tabular-nums font-semibold text-[#3E3027]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Customization pills/unboxed details */}
                    {!item.menuItem.isFood ? (
                      <p className="text-[11px] text-[#7A6B5F] mt-1 leading-relaxed">
                        {item.customization.size === 'large' ? 'Large 16oz' : 'Regular 12oz'} ·{' '}
                        {item.customization.temperature === 'iced' ? 'Iced' : 'Hot'} ·{' '}
                        {item.customization.milk !== 'none' ? `${item.customization.milk} milk` : 'Black'} ·{' '}
                        {item.customization.shots} shot · {item.customization.sweetness}% sweet
                        {item.customization.syrup !== 'none' && ` · ${item.customization.syrup.replace('_', ' ')}`}
                        {item.customization.bringOwnCup && ' · Personal Mug (+20pts)'}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#7A6B5F] mt-1">Freshly warmed</p>
                    )}

                    {/* Stepper & Delete */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F4EFE6]">
                      <div className="flex items-center border border-[#EBE4D7] rounded-lg bg-[#FAF8F5] p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="min-w-[28px] min-h-[28px] rounded-md text-[#594B40] hover:bg-[#EFE9DF] flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono tabular-nums font-semibold text-[11px] text-[#2C241E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="min-w-[28px] min-h-[28px] rounded-md text-[#594B40] hover:bg-[#EFE9DF] flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#9C8276] hover:text-[#B24E39] p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loyalty Rewards Application */}
            <div className="bg-[#FAF5EC] rounded-2xl p-3.5 border border-[#EADBCA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#544336] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A37B3E]" />
                  Loyalty Perk / Reward
                </span>
                <span className="text-[11px] text-[#7D6B5D] font-mono tabular-nums">
                  {loyaltyPoints} pts available
                </span>
              </div>

              {appliedReward ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#DFD1BE]">
                  <div>
                    <span className="font-medium text-[#2C241E]">{appliedReward.title}</span>
                    <p className="text-[11px] text-[#2F6B34] font-medium">
                      -${appliedReward.discountAmount?.toFixed(2)} applied
                    </p>
                  </div>
                  <button
                    onClick={() => applyReward(null)}
                    className="text-[#968274] hover:text-[#B24E39] text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#79695C]">
                    Have loyalty stamps or points to redeem?
                  </span>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('rewards');
                    }}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white border border-[#D5C6B2] text-[#4A3B2F] font-medium text-[11px] hover:bg-[#F5EFE4] transition-colors"
                  >
                    Redeem Perks
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#ECE5DB] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#68574B]">
                <span className="font-sans">Subtotal</span>
                <span className="tabular-nums">${cartTotal.toFixed(2)}</span>
              </div>
              {appliedReward && (
                <div className="flex justify-between text-[#2F6B34]">
                  <span className="font-sans">Reward ({appliedReward.title})</span>
                  <span className="tabular-nums">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#68574B]">
                <span className="font-sans">Estimated Tax (8.25%)</span>
                <span className="tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#2C241E] font-bold text-sm pt-2 border-t border-[#ECE5DB]">
                <span className="font-sans">Total</span>
                <span className="tabular-nums">${finalTotal.toFixed(2)}</span>
              </div>

              {/* Points to earn badge */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-[#4E684C] font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#5A7C57]" />
                  Points earned with this order
                </span>
                <span className="font-mono tabular-nums font-semibold">+{estimatedPoints} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Pre-Order CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-[#ECE5DB] shrink-0">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF8F5] font-semibold text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D8BC8C]" />
                {isSubmitting ? 'Transmitting to Barista...' : 'Send Pre-Order to Barista'}
              </span>
              <div className="flex items-center gap-1 font-mono tabular-nums">
                <span>${finalTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <p className="text-[10px] text-center text-[#8D7D71] mt-2">
              Pay at pickup or charged to linked Pastel Pay · No waiting in line
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
