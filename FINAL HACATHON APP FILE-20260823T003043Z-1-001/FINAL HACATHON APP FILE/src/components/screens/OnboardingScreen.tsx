import React from "react";
import { ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onCaregiverSetup: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onCaregiverSetup,
}) => {
  return (
    <div
      id="remi-onboarding-screen"
      className="flex flex-col h-full justify-between px-7 py-8 bg-[#F6F4EF] text-[#262B27] select-none relative overflow-hidden"
    >
      {/* Gentle background organic blobs */}
      <div className="absolute top-10 -left-16 w-56 h-56 rounded-full bg-[#5E8271]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-16 w-56 h-56 rounded-full bg-[#E0A752]/10 blur-3xl pointer-events-none" />

      {/* Top Status */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EFEBE0] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#5E8271] breathe" />
          <span className="text-[12px] font-semibold text-[#5E8271]">
            Memory Companion
          </span>
        </div>

        <span className="text-[12px] font-medium text-[#8A9089]">
          v2.4 Ready
        </span>
      </div>

      {/* Central Brand & Value Proposition */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-6 z-10">
        {/* Living Breathing Emblem */}
        <div className="relative mb-8 flex items-center justify-center">
          <span className="absolute w-36 h-36 rounded-full breathe bg-[#5E8271]/20 pointer-events-none" />
          <span className="absolute w-28 h-28 rounded-full breathe bg-[#5E8271]/35 pointer-events-none" style={{ animationDelay: "1s" }} />
          
          <div className="relative w-24 h-24 rounded-full bg-[#5E8271] flex items-center justify-center shadow-xl border-4 border-white">
            <span className="text-white text-[38px] font-extrabold font-display tracking-tight">
              R
            </span>
          </div>
        </div>

        <h1 className="text-[34px] font-extrabold tracking-tight text-[#262B27] font-display">
          REMI
        </h1>

        <p className="text-[18px] font-semibold text-[#5E8271] mt-1 font-display tracking-tight">
          Remember what matters.
        </p>

        <p className="text-[16px] text-[#6E756D] max-w-[300px] mt-4 leading-relaxed font-normal">
          REMI helps you remember the people, moments and conversations that matter.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 text-[13px] text-[#8A9089] font-medium">
          <span className="flex items-center gap-1">
            <Heart size={14} className="text-[#5E8271]" />
            <span>Calm & Gentle</span>
          </span>
          <span>•</span>
          <span>Never clinical</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 z-10">
        <button
          id="get-started-button"
          onClick={onGetStarted}
          className="w-full py-4 rounded-2xl font-bold text-[17px] font-display bg-[#5E8271] text-white shadow-md active:scale-[0.98] transition-all hover:bg-[#4E6F5F] flex items-center justify-center gap-2"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        <button
          id="caregiver-setup-button"
          onClick={onCaregiverSetup}
          className="w-full py-3.5 rounded-2xl font-semibold text-[15px] font-display text-[#43604F] bg-white border border-[#D8D2C4] hover:bg-[#FAF8F5] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <ShieldCheck size={17} className="text-[#5E8271]" />
          <span>Caregiver Setup</span>
        </button>
      </div>
    </div>
  );
};
