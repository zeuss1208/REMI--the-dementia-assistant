import React, { useEffect, useState } from "react";
import { Volume2, BellRing, MapPin, CheckCircle2 } from "lucide-react";
import { sound } from "../utils/audio";

interface PhoneLeftAlertModalProps {
  onClose: () => void;
  inactivityMinutes?: number;
}

export const PhoneLeftAlertModal: React.FC<PhoneLeftAlertModalProps> = ({
  onClose,
  inactivityMinutes = 30,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [foundAcknowledged, setFoundAcknowledged] = useState(false);

  useEffect(() => {
    // Play gentle dual tone chime immediately
    sound.playGentleChime("alert");

    // Speak gently
    const phrase = "It looks like you may have left your phone behind. Would you like me to help you find it?";
    setIsPlayingAudio(true);
    sound.speakGentle(phrase, () => {
      setIsPlayingAudio(false);
    });

    return () => {
      sound.stopSpeaking();
    };
  }, []);

  const handleHelpFind = () => {
    sound.playGentleChime("alert");
    sound.speakGentle("I'm right here on the table next to you. You are doing great.");
    setFoundAcknowledged(true);
    setTimeout(() => {
      onClose();
    }, 2800);
  };

  return (
    <div
      id="phone-left-alert-overlay"
      className="absolute inset-0 z-50 flex flex-col justify-end bg-[#262B27]/50 backdrop-blur-xs p-4 animate-fadeIn"
    >
      <div className="w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#EFEBE0] animate-slideUp">
        <div className="flex justify-center mb-5">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-20 h-20 rounded-full breathe bg-[#DD8F73]/25" />
            <div className="w-14 h-14 rounded-full bg-[#DD8F73] flex items-center justify-center text-white shadow-md">
              <Volume2 size={28} className={isPlayingAudio ? "animate-pulse" : ""} />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEEE7] text-[#B56345] text-[12px] font-semibold mb-2.5">
            <BellRing size={13} />
            <span>Stationary for {inactivityMinutes} minutes</span>
          </div>

          <h2 className="text-[20px] font-bold text-[#262B27] font-display leading-snug">
            It looks like you may have left your phone behind.
          </h2>

          <p className="text-[15px] text-[#6E756D] mt-2 leading-relaxed">
            Would you like me to help you find it?
          </p>
        </div>

        {foundAcknowledged ? (
          <div className="flex items-center justify-center gap-2 p-4 bg-[#EFF3EF] rounded-2xl text-[#43604F] font-semibold text-[15px]">
            <CheckCircle2 size={20} />
            <span>I'm right here! Reconnected safely.</span>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              id="help-find-phone-button"
              onClick={handleHelpFind}
              className="w-full py-4 rounded-2xl font-bold text-[16px] font-display bg-[#DD8F73] text-white shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:bg-[#D47F61]"
            >
              <MapPin size={18} />
              <span>Yes, help me find it</span>
            </button>

            <button
              id="dismiss-alert-button"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-semibold text-[15px] font-display text-[#6E756D] bg-[#F6F4EF] hover:bg-[#EFEBE0] active:scale-[0.98] transition-transform"
            >
              I have it with me
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
