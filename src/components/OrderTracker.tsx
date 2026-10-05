import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Coffee,
  Sparkles,
  MapPin,
  QrCode,
  RotateCw,
  ChevronRight,
  Flame,
  Award,
  FastForward,
} from 'lucide-react';
import { OrderStatus } from '../types';

export const OrderTracker: React.FC = () => {
  const {
    activeOrder,
    fastForwardOrder,
    orderHistory,
    reorderPastOrder,
    setActiveTab,
    selectedRoastery,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'current' | 'history'>('current');
  const [showQrModal, setShowQrModal] = useState(false);

  const steps = [
    {
      status: 'received' as OrderStatus,
      title: 'Order Queued',
      desc: 'Transmitted to bar espresso machine',
      icon: Clock,
    },
    {
      status: 'grinding' as OrderStatus,
      title: 'Grinding & Dialing',
      desc: 'Grinding single-origin beans at 93°C',
      icon: Coffee,
    },
    {
      status: 'crafting' as OrderStatus,
      title: 'Steaming & Finishing',
      desc: 'Texturing velvety microfoam',
      icon: Flame,
    },
    {
      status: 'ready' as OrderStatus,
      title: 'Ready for Pickup',
      desc: 'Waiting at express pickup bar',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Sub tabs: Active Order vs Past History */}
      <div className="flex items-center gap-1 p-1 bg-[#EFE9DF] rounded-xl max-w-xs mx-auto">
        <button
          onClick={() => setActiveTabSub('current')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTabSub === 'current'
              ? 'bg-white text-[#2C241E] shadow-2xs'
              : 'text-[#6D5E52] hover:text-[#2C241E]'
          }`}
        >
          Active Status {activeOrder && <span className="inline-block w-2 h-2 rounded-full bg-[#B26B50] ml-1" />}
        </button>
        <button
          onClick={() => setActiveTabSub('history')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTabSub === 'history'
              ? 'bg-white text-[#2C241E] shadow-2xs'
              : 'text-[#6D5E52] hover:text-[#2C241E]'
          }`}
        >
          Past Orders ({orderHistory.length})
        </button>
      </div>

      {activeTabSub === 'current' ? (
        activeOrder ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Live Status Header Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECE5DB] shadow-xs relative overflow-hidden">
              {/* Background ambient pastel tint */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#F6EFE6] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A796C]">
                      Order #{activeOrder.orderNumber}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#2C241E] mt-0.5">
                      {activeOrder.status === 'ready'
                        ? 'Ready for Pickup!'
                        : activeOrder.status === 'crafting'
                        ? 'Steaming & Finishing'
                        : activeOrder.status === 'grinding'
                        ? 'Grinding Fresh Beans'
                        : 'Order Queued'}
                    </h3>
                  </div>

                  {/* QR trigger */}
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-[#F8F4ED] hover:bg-[#EFE9DF] text-[#423429] transition-colors border border-[#ECE5DB]"
                    title="View Pickup Pass QR"
                  >
                    <QrCode className="w-5 h-5 text-[#3F3127]" />
                    <span className="text-[9px] font-mono font-bold tracking-tight">QR PASS</span>
                  </button>
                </div>

                {/* Pickup details row */}
                <div className="mt-4 p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DD] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8C7D73] uppercase tracking-wide">Pickup Location</span>
                    <p className="text-xs font-semibold text-[#2C241E] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#A6836D]" />
                      {activeOrder.roasteryName}
                    </p>
                    <p className="text-[11px] text-[#7A6B60]">{activeOrder.pickupCounter}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#8C7D73] uppercase tracking-wide">Pickup PIN</span>
                    <p className="font-mono text-base font-bold text-[#8C5542] tracking-wider">
                      {activeOrder.pickupPin}
                    </p>
                  </div>
                </div>

                {/* Real-time estimated countdown */}
                <div className="mt-4 flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-[#56453A]">
                    <Clock className="w-4 h-4 text-[#8C5542] animate-pulse" />
                    <span>
                      Estimated ready:{' '}
                      <span className="font-semibold text-[#2C241E]">
                        {activeOrder.status === 'ready' ? 'Now at Counter' : activeOrder.estimatedReadyTime}
                      </span>
                    </span>
                  </div>

                  {/* Fast Forward Demo Control */}
                  <button
                    onClick={fastForwardOrder}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFE9DF] hover:bg-[#E4DBCF] text-[#4A3B31] text-[11px] font-medium transition-colors"
                    title="Simulate next status stage"
                  >
                    <FastForward className="w-3 h-3 text-[#8C5542]" />
                    <span>Advance Stage</span>
                  </button>
                </div>

                {/* Live Step Progress Visual */}
                <div className="mt-5 space-y-4">
                  {steps.map((step, idx) => {
                    const isCompleted = activeOrder.activeStepIndex > idx;
                    const isCurrent = activeOrder.activeStepIndex === idx;
                    const IconComp = step.icon;

                    return (
                      <div key={step.status} className="flex items-start gap-3 relative">
                        {/* Connecting line */}
                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute left-4 top-8 w-0.5 h-8 -ml-px transition-colors duration-500 ${
                              isCompleted ? 'bg-[#3E3027]' : 'bg-[#EAE2D5]'
                            }`}
                          />
                        )}

                        {/* Step Icon circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-[#3E3027] text-white'
                              : isCurrent
                              ? 'bg-[#EEDFD2] text-[#6A3F2F] ring-4 ring-[#EEDFD2]/40'
                              : 'bg-[#F2ECE3] text-[#A6978A]'
                          }`}
                        >
                          <IconComp className="w-4 h-4 stroke-[2]" />
                        </div>

                        {/* Step details */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-baseline justify-between">
                            <span
                              className={`text-xs font-semibold ${
                                isCurrent
                                  ? 'text-[#2C241E]'
                                  : isCompleted
                                  ? 'text-[#56453A]'
                                  : 'text-[#96877A]'
                              }`}
                            >
                              {step.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono font-medium text-[#A25A44] animate-pulse">
                                IN PROGRESS
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] text-[#4A6B48] font-medium">Done</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A6A5E] mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Barista live note banner */}
                {activeOrder.baristaNote && (
                  <div className="mt-5 p-3 rounded-2xl bg-[#F6F1E9] border border-[#E9DFD0] text-xs flex items-start gap-2.5">
                    <Coffee className="w-4 h-4 text-[#8C5542] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#423328] text-[11px]">Live Barista Update:</span>
                      <p className="text-[#6D5D51] text-[11px] mt-0.5 leading-relaxed">
                        {activeOrder.baristaNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-3xl p-5 border border-[#ECE5DB] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-[#7A6B60]">
                <span className="font-medium text-[#2C241E]">Ordered Items</span>
                <span className="font-mono tabular-nums">{activeOrder.items.length} items</span>
              </div>

              <div className="divide-y divide-[#F3ECE1]">
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-[#2C241E]">
                        {item.quantity}× {item.menuItem.name}
                      </div>
                      <div className="text-[11px] text-[#7C6C61]">
                        {item.customization.size === 'large' ? 'Large 16oz' : 'Regular 12oz'} ·{' '}
                        {item.customization.temperature} · {item.customization.milk} milk
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-[#3E3027] font-medium">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#ECE5DB] flex justify-between font-mono text-xs font-semibold text-[#2C241E]">
                <span>Total Paid</span>
                <span className="tabular-nums">${activeOrder.total.toFixed(2)}</span>
              </div>

              {/* Loyalty points earned */}
              <div className="pt-1 flex items-center gap-1.5 text-xs text-[#3E5C3B] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#51794D]" />
                <span>
                  Earned <strong className="font-mono tabular-nums">+{activeOrder.pointsEarned}</strong> loyalty points & {activeOrder.stampsEarned} stamp
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-[#ECE5DB] text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#F3EDE3] flex items-center justify-center mx-auto text-[#796859]">
              <Coffee className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="font-display text-base font-semibold text-[#2C241E]">
              No Active Pre-Order
            </h4>
            <p className="text-xs text-[#7B6C60] max-w-xs mx-auto leading-relaxed">
              You don't have an order brewing right now. Choose a drink from {selectedRoastery.name} to track in real-time.
            </p>
            <button
              onClick={() => setActiveTab('menu')}
              className="mt-3 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#3E3027] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B211A] transition-colors"
            >
              Order for Pickup
            </button>
          </div>
        )
      ) : (
        /* Past Orders History List */
        <div className="space-y-3 animate-in fade-in duration-300">
          {orderHistory.map((past) => (
            <div
              key={past.id}
              className="bg-white rounded-2xl p-4 border border-[#ECE5DB] space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8C7D73]">#{past.orderNumber}</span>
                  <h4 className="font-display font-semibold text-[#2C241E] text-sm">
                    {past.roasteryName}
                  </h4>
                  <p className="text-[11px] text-[#817267]">{past.createdAt}</p>
                </div>
                <span className="font-mono tabular-nums font-semibold text-xs text-[#2C241E]">
                  ${past.total.toFixed(2)}
                </span>
              </div>

              <div className="text-xs text-[#5D4D41] space-y-1">
                {past.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[200px]">
                      {it.quantity}× {it.menuItem.name}
                    </span>
                    <span className="text-[#8A7A6E] font-mono tabular-nums">
                      ${(it.unitPrice * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between">
                <span className="text-[11px] text-[#426140] flex items-center gap-1 font-medium">
                  <Award className="w-3 h-3" /> +{past.pointsEarned} pts earned
                </span>
                <button
                  onClick={() => reorderPastOrder(past)}
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#3F3127] text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Re-Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Pass Modal */}
      {showQrModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-xs bg-white rounded-3xl p-6 text-center space-y-4 border border-[#ECE5DB] shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A796C]">
                Pickup Verification
              </span>
              <h4 className="font-display text-lg font-bold text-[#2C241E] mt-0.5">
                Pass #{activeOrder.orderNumber}
              </h4>
            </div>

            {/* Stylized QR placeholder */}
            <div className="w-44 h-44 mx-auto p-3 bg-[#FAF8F5] rounded-2xl border-2 border-dashed border-[#D9CDBF] flex flex-col items-center justify-center relative">
              <QrCode className="w-28 h-28 text-[#3A2D24]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <Coffee className="w-4 h-4 text-[#8C5542]" />
                </div>
              </div>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-2.5 font-mono text-center">
              <span className="text-[10px] text-[#867568] block">COUNTER PIN</span>
              <span className="text-xl font-bold text-[#8C5542] tracking-widest">
                {activeOrder.pickupPin}
              </span>
            </div>

            <p className="text-[11px] text-[#7A6B60] leading-snug">
              Hold towards the scanner at {activeOrder.pickupCounter} to collect your fresh brew.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-[#3E3027] text-white font-medium text-xs hover:bg-[#2B211A] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
