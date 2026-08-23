import React, { useState } from "react";
import { Play, ChevronRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface InteractiveTourProps {
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  onReset: () => void;
}

export const DEMO_STEPS = [
  {
    step: 1,
    title: "Welcome / Intro",
    desc: "Open REMI: 'Remember what matters.'",
  },
  {
    step: 2,
    title: "People Directory",
    desc: "Explore familiar people (Aarav, Priya, Raj).",
  },
  {
    step: 3,
    title: "Camera Recognition",
    desc: "Scan & recognize Aarav as 'Your grandson'.",
  },
  {
    step: 4,
    title: "Conversation Recording",
    desc: "Aarav: 'I'll come visit you tomorrow.'",
  },
  {
    step: 5,
    title: "AI Memory Synthesis",
    desc: "Auto-extract structured context & date.",
  },
  {
    step: 6,
    title: "Memory Timeline",
    desc: "View chronologically in 'My Memories'.",
  },
  {
    step: 7,
    title: "Phone Left Behind",
    desc: "Trigger stationary gentle audio speaker alert.",
  },
  {
    step: 8,
    title: "Reconnection Context",
    desc: "Gentle context payoff: 'Aarav is your grandson...'",
  },
];

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  currentStep,
  onStepClick,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-[#E5E0D4] border-b border-[#D8D2C4] px-4 py-2 select-none z-30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5E8271] animate-pulse" />
          <span className="text-[12px] font-bold text-[#262B27] font-display flex items-center gap-1">
            <span>Demo Guide</span>
            <span className="text-[#5E8271] font-medium font-sans">
              (Step {currentStep + 1} of {DEMO_STEPS.length})
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[11px] font-semibold text-[#43604F] bg-white/80 hover:bg-white px-2.5 py-1 rounded-full border border-[#D8D2C4] transition shadow-2xs"
          >
            {isOpen ? "Hide Steps" : "View 8 Demo Steps"}
          </button>

          <button
            onClick={onReset}
            title="Reset to Step 1"
            className="p-1 rounded-full text-[#6E756D] hover:text-[#262B27] transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 pt-2 border-t border-[#D8D2C4]/70 grid grid-cols-2 sm:grid-cols-4 gap-1.5 animate-fadeIn">
          {DEMO_STEPS.map((s, idx) => {
            const isCurrent = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <button
                key={s.step}
                onClick={() => onStepClick(idx)}
                className={`p-2 rounded-xl text-left transition-all text-[11px] flex flex-col justify-between border ${
                  isCurrent
                    ? "bg-[#5E8271] text-white border-[#5E8271] shadow-xs"
                    : isCompleted
                    ? "bg-white/90 text-[#262B27] border-[#D8D2C4]"
                    : "bg-white/50 text-[#6E756D] border-transparent hover:bg-white/80"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold font-display">
                    {s.step}. {s.title}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 size={12} className="text-[#5E8271]" />
                  ) : isCurrent ? (
                    <Play size={10} className="fill-current text-white" />
                  ) : null}
                </div>
                <span
                  className={`text-[10px] leading-tight line-clamp-2 ${
                    isCurrent ? "text-[#E7EFE9]" : "text-[#6E756D]"
                  }`}
                >
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
