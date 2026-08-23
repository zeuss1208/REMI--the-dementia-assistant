import React from "react";
import { Sparkles, X, ArrowRight, Heart } from "lucide-react";
import { Person } from "../types";
import { Avatar } from "./Avatar";

interface ReconnectionBannerProps {
  person: Person;
  onViewMemory: () => void;
  onDismiss: () => void;
}

export const ReconnectionBanner: React.FC<ReconnectionBannerProps> = ({
  person,
  onViewMemory,
  onDismiss,
}) => {
  return (
    <div
      id="reconnection-context-banner"
      className="relative rounded-3xl p-5 bg-[#43604F] text-white shadow-lg overflow-hidden border border-[#5E8271]/40 animate-slideDown select-none"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#5E8271]/40 blur-2xl pointer-events-none" />

      <button
        id="dismiss-reconnect-banner"
        onClick={onDismiss}
        aria-label="Dismiss prompt"
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white/80 active:scale-95 transition"
      >
        <X size={15} />
      </button>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E0A752] breathe" />
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#CFE0D5]">
          Gentle Context Reconnection
        </span>
      </div>

      <div className="flex gap-3.5 items-start mt-1">
        <Avatar
          photoUrl={person.photoUrl}
          initial={person.initial}
          color={person.avatarColor}
          size={52}
          ring
        />
        <div className="flex-1 pr-4">
          <p className="text-[16px] font-semibold text-white leading-snug">
            {person.name} is your {person.relationship.toLowerCase()}.
          </p>
          <p className="text-[14px] text-[#E7EFE9] mt-1 leading-relaxed">
            He visited recently and mentioned he would come again today.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
        <span className="text-[12px] text-[#CFE0D5] flex items-center gap-1.5">
          <Heart size={13} className="text-[#E0A752]" />
          <span>REMI helps you stay oriented</span>
        </span>

        <button
          id="view-reconnect-memory-button"
          onClick={onViewMemory}
          className="px-4 py-2 rounded-full font-bold text-[13px] font-display bg-white text-[#262B27] hover:bg-[#F6F4EF] active:scale-95 transition shadow-xs flex items-center gap-1.5"
        >
          <span>View memory</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
