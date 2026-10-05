import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Signal, Coffee, Smartphone, Monitor } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isPhoneFrame, setIsPhoneFrame } = useApp();
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#EDE7DF] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4">
      {/* Top Helper Toolbar (visible on desktop) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-xs text-[#6B5C50]">
        <div className="flex items-center gap-1.5 font-medium">
          <Coffee className="w-4 h-4 text-[#8C5542]" />
          <span className="font-display font-semibold text-[#2C241E]">Pastel Brew</span>
          <span className="text-[11px] text-[#867568]">· Minimalist Cafe App</span>
        </div>

        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-[#4A3B31] border border-[#DDD3C7] shadow-2xs transition-colors"
        >
          {isPhoneFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] bg-[#FAF8F5] sm:rounded-[44px] sm:shadow-2xl sm:ring-1 sm:ring-black/10 overflow-hidden sm:border-[8px] sm:border-[#2C2522]'
            : 'max-w-2xl bg-[#FAF8F5] sm:rounded-3xl sm:shadow-lg overflow-hidden'
        } min-h-screen sm:min-h-[840px] flex flex-col relative`}
      >
        {/* iOS Dynamic Island & Status Bar (Simulated) */}
        {isPhoneFrame && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-xs text-[#2C241E] font-semibold select-none bg-[#FAF8F5] shrink-0 z-40">
            <span className="font-mono text-xs tracking-tight">{currentTime}</span>

            {/* Dynamic Island pill */}
            <div className="w-24 h-4 bg-[#2C2522] rounded-full mx-auto -mt-0.5 flex items-center justify-end pr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#181513]" />
            </div>

            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
              <Battery className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        )}

        {/* Inner Content Body */}
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
