import React from "react";
import { Home, Clock, Users, ShieldCheck } from "lucide-react";
import { ScreenType } from "../types";

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const items: { id: ScreenType; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "memories", label: "Memories", icon: Clock },
    { id: "people", label: "People", icon: Users },
    { id: "caregiver", label: "Caregiver", icon: ShieldCheck },
  ];

  return (
    <nav
      id="remi-bottom-navigation"
      aria-label="Main Navigation"
      className="flex items-center justify-around px-2 pt-2 pb-3 shrink-0 bg-white border-t border-[#EFEBE0] select-none z-20"
    >
      {items.map((item) => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive
                ? "text-[#5E8271]"
                : "text-[#8A9089] hover:text-[#262B27]"
            }`}
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.9}
                className={isActive ? "scale-105" : ""}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#5E8271] rounded-full" />
              )}
            </div>
            <span
              className={`text-[12px] mt-1 tracking-tight font-medium ${
                isActive ? "font-bold text-[#5E8271]" : "text-[#8A9089]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
