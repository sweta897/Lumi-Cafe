import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Award,
  Coffee,
  Check,
  Gift,
  HelpCircle,
  Milk,
  Croissant,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { REWARDS_CATALOG, LOYALTY_TIERS } from '../data/roasteriesData';
import { RewardVoucher } from '../types';

export const LoyaltyView: React.FC = () => {
  const {
    loyaltyPoints,
    stampCount,
    maxStamps,
    redeemVoucher,
    redeemedVouchers,
    appliedReward,
    setIsCartOpen,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine current tier
  const currentTier =
    loyaltyPoints >= 500
      ? LOYALTY_TIERS[2]
      : loyaltyPoints >= 200
      ? LOYALTY_TIERS[1]
      : LOYALTY_TIERS[0];

  const nextTier =
    currentTier.id === 'seedling'
      ? LOYALTY_TIERS[1]
      : currentTier.id === 'friend'
      ? LOYALTY_TIERS[2]
      : null;

  const pointsToNext = nextTier ? nextTier.minPoints - loyaltyPoints : 0;
  const tierProgress = nextTier
    ? Math.min(100, Math.max(0, ((loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100;

  const handleRedeem = (voucher: RewardVoucher) => {
    const success = redeemVoucher(voucher);
    if (success) {
      setToastMessage(`Unlocked: ${voucher.title}! Applied to your cart.`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setToastMessage(`Needs ${voucher.pointsCost - loyaltyPoints} more points to unlock.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const getVoucherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Milk':
        return Milk;
      case 'Croissant':
        return Croissant;
      case 'Coffee':
        return Coffee;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#2C241E] text-[#FAF7F2] text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#E5BA75]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 8-Cup Digital Stamp Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE5DB] shadow-xs relative overflow-hidden">
        {/* Decorative subtle texture */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#8A796C] font-medium">
              <Award className="w-3.5 h-3.5 text-[#B57C57]" />
              <span>Roastery Passport</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#2C241E] mt-0.5">
              8-Cup Loyalty Stamp Card
            </h3>
          </div>
          <div className="text-right">
            <span className="font-mono tabular-nums text-xs font-bold text-[#8C5542] px-2.5 py-1 rounded-full bg-[#F5ECE3]">
              {stampCount} of {maxStamps} Stamps
            </span>
          </div>
        </div>

        <p className="text-xs text-[#7B6C60] mt-1">
          Receive 1 stamp for every handcrafted beverage. Fill all 8 stamps to receive a complimentary specialty drink voucher.
        </p>

        {/* The 8 Stamp Grid */}
        <div className="grid grid-cols-4 gap-2.5 mt-4">
          {Array.from({ length: maxStamps }).map((_, idx) => {
            const isStamped = idx < stampCount;
            const isLast = idx === maxStamps - 1;

            return (
              <div
                key={idx}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 transition-all relative ${
                  isStamped
                    ? 'border-[#B57C57] bg-[#FAF3EC] text-[#8C5542] shadow-2xs rotate-[-1deg]'
                    : isLast
                    ? 'border-dashed border-[#D9CDBF] bg-[#FAF8F5] text-[#9A897B]'
                    : 'border-dashed border-[#E3D9CC] bg-[#FAF8F5] text-[#B0A294]'
                }`}
              >
                {isStamped ? (
                  <div className="flex flex-col items-center animate-in zoom-in-75 duration-300">
                    <Coffee className="w-5 h-5 fill-[#8C5542] text-[#8C5542]" />
                    <span className="text-[9px] font-mono font-bold tracking-tight text-[#8C5542] mt-0.5">
                      STAMP #{idx + 1}
                    </span>
                  </div>
                ) : isLast ? (
                  <div className="flex flex-col items-center text-center">
                    <Gift className="w-5 h-5 text-[#8C5542]" />
                    <span className="text-[9px] font-mono font-semibold text-[#8C5542] mt-0.5">
                      FREE DRINK
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-xs font-semibold text-[#B0A294]">
                      {idx + 1}
                    </span>
                    <span className="text-[8px] text-[#C4B7AA] uppercase">Cup</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stamp progress bar */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#7B6C60]">
          <span>
            {maxStamps - stampCount === 0
              ? 'Card full! Enjoy your free reward.'
              : `${maxStamps - stampCount} more stamp${maxStamps - stampCount > 1 ? 's' : ''} to unlock Free Drink`}
          </span>
          <span className="font-mono tabular-nums font-semibold text-[#2C241E]">
            {Math.round((stampCount / maxStamps) * 100)}%
          </span>
        </div>
      </div>

      {/* Points & Member Tier Card */}
      <div className="bg-gradient-to-br from-[#FBF8F3] to-[#F5ECE1] rounded-3xl p-5 border border-[#EBE3D6] shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${currentTier.badgeBg} ${currentTier.color}`}>
                Tier: {currentTier.name}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-display text-3xl font-bold font-mono tabular-nums text-[#2C241E]">
                {loyaltyPoints}
              </span>
              <span className="text-xs text-[#7A6B60] ml-1.5 font-medium">available points</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 backdrop-blur-xs text-[#8C5542]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Progress towards next tier */}
        {nextTier ? (
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#78695E] mb-1.5">
              <span>Next tier: <strong className="text-[#3A2D23]">{nextTier.name}</strong></span>
              <span className="font-mono tabular-nums">{pointsToNext} pts needed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5DCD0] overflow-hidden">
              <div
                className="h-full bg-[#3E3027] rounded-full transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#4A6848] font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Highest Roaster's Circle status reached
          </p>
        )}

        {/* Tier Perks list */}
        <div className="pt-2 border-t border-[#E8DECFA]">
          <span className="text-[11px] uppercase tracking-wider text-[#8A796D] font-mono block mb-1.5">
            Active Member Privileges
          </span>
          <ul className="space-y-1.5 text-xs text-[#5D4E42]">
            {currentTier.perks.map((perk, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#5D7C5B] shrink-0 mt-0.5" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Redeemable Rewards Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="font-display text-base font-semibold text-[#2C241E]">
              Perks & Vouchers
            </h4>
            <p className="text-xs text-[#7B6C60]">Redeem your balance for instant discounts</p>
          </div>
          {appliedReward && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-[11px] text-[#8C5542] hover:underline flex items-center gap-0.5"
            >
              <span>View Applied</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {REWARDS_CATALOG.map((reward) => {
            const canAfford = loyaltyPoints >= reward.pointsCost;
            const isApplied = appliedReward?.id === reward.id;
            const isRedeemed = redeemedVouchers.some((v) => v.id === reward.id);
            const Icon = getVoucherIcon(reward.icon);

            return (
              <div
                key={reward.id}
                className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 ${
                  isApplied
                    ? 'border-[#B4D3AF] bg-[#F7FAF6]'
                    : 'border-[#ECE5DB] hover:border-[#DACFBF]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] border border-[#EADBCA] flex items-center justify-center text-[#8C5542] shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-display font-semibold text-xs text-[#2C241E] truncate">
                      {reward.title}
                    </h5>
                    <p className="text-[11px] text-[#7A6B60] line-clamp-1 mt-0.5">
                      {reward.description}
                    </p>
                    <span className="font-mono text-[11px] font-semibold text-[#8C5542] mt-1 block">
                      {reward.pointsCost} points
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford && !isApplied}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isApplied
                      ? 'bg-[#3E5C3B] text-white'
                      : canAfford
                      ? 'bg-[#3E3027] hover:bg-[#2B211A] text-[#FAF8F5]'
                      : 'bg-[#F2ECE3] text-[#A6978A] cursor-not-allowed'
                  }`}
                >
                  {isApplied ? 'Applied' : canAfford ? 'Redeem' : 'Need Points'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sustainable Reusable Cup Info */}
      <div className="bg-[#EFF5EE] rounded-2xl p-4 border border-[#D1E3CE] flex items-start gap-3">
        <Coffee className="w-5 h-5 text-[#3E653F] shrink-0 mt-0.5" />
        <div className="text-xs text-[#305231]">
          <span className="font-semibold block text-[12px]">Eco Tumbler Incentive</span>
          <p className="text-[11px] text-[#416842] mt-0.5 leading-relaxed">
            Bring your own reusable mug or thermos on any pre-order to receive an automatic <strong>+20 bonus points</strong> added to your balance.
          </p>
        </div>
      </div>
    </div>
  );
};
