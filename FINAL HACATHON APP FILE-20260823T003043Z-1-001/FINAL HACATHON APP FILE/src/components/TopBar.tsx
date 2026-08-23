import React from "react";
import { ArrowLeft } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBack,
  rightElement,
}) => {
  return (
    <header className="flex items-center justify-between px-5 pt-3 pb-2.5 shrink-0 select-none border-b border-[#EFEBE0]/80 bg-[#F6F4EF]/90 backdrop-blur-sm z-10">
      <div className="w-10 flex items-center">
        {onBack && (
          <button
            id="topbar-back-button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#E7E3D9] text-[#262B27] shadow-xs active:scale-95 transition-transform hover:bg-[#FAF8F5]"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>

      <div className="flex-1 text-center px-2">
        <h1 className="text-[17px] font-bold tracking-tight text-[#262B27] font-display line-clamp-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px] text-[#6E756D] font-medium leading-none mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-10 flex justify-end items-center">{rightElement}</div>
    </header>
  );
};
