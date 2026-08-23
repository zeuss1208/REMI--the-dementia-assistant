import React, { useState } from "react";
import {
  ShieldCheck,
  BellRing,
  Trash2,
  HardDrive,
  User,
  Sparkles,
  Lock,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  ChevronRight,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { CaregiverSettings, Person, MemoryItem } from "../../types";
import { TopBar } from "../TopBar";
import { sound } from "../../utils/audio";

interface CaregiverScreenProps {
  settings: CaregiverSettings;
  onUpdateSettings: (newSettings: CaregiverSettings) => void;
  peopleCount: number;
  memoriesCount: number;
  onTriggerPhoneAlert: () => void;
  onClearAllMemories: () => void;
  onResetDemoData: () => void;
}

export const CaregiverScreen: React.FC<CaregiverScreenProps> = ({
  settings,
  onUpdateSettings,
  peopleCount,
  memoriesCount,
  onTriggerPhoneAlert,
  onClearAllMemories,
  onResetDemoData,
}) => {
  const [patientName, setPatientName] = useState(settings.patientName);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSavePatientName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ ...settings, patientName });
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  return (
    <div
      id="remi-caregiver-screen"
      className="flex flex-col h-full bg-[#F6F4EF] text-[#262B27] select-none"
    >
      <TopBar
        title="Caregiver Hub"
        subtitle="Patient Care & Configuration"
      />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
        {/* Quick Demo Test Action */}
        <div className="bg-[#43604F] rounded-3xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E0A752] animate-pulse" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#CFE0D5]">
              Demo &amp; Testing Tool
            </span>
          </div>

          <h3 className="text-[17px] font-bold font-display leading-snug">
            Simulate Phone Left Behind
          </h3>

          <p className="text-[13.5px] text-[#E7EFE9] mt-1 leading-relaxed">
            Demonstrates stationary accelerometer detection triggering the gentle speaker voice orientation.
          </p>

          <button
            id="simulate-phone-left-behind-button"
            onClick={onTriggerPhoneAlert}
            className="mt-4 w-full py-3.5 rounded-2xl font-bold text-[14.5px] font-display bg-[#E0A752] text-[#262B27] hover:bg-[#D49942] active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-xs"
          >
            <MapPin size={17} />
            <span>Simulate Phone Left Behind</span>
          </button>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#6E756D] font-display flex items-center gap-2">
              <User size={16} className="text-[#5E8271]" />
              <span>Patient Profile</span>
            </h3>

            {savedBadge && (
              <span className="text-[12px] text-[#5E8271] font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSavePatientName} className="space-y-3">
            <div>
              <label className="text-[12px] font-medium text-[#8A9089] block mb-1">
                Patient Preferred Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="flex-1 rounded-2xl px-4 py-2.5 bg-[#FAF8F5] border border-[#EFEBE0] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl font-semibold text-[13.5px] font-display bg-[#5E8271] text-white hover:bg-[#4E6F5F] transition active:scale-95"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Phone Inactivity Threshold */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#6E756D] font-display flex items-center gap-2">
              <BellRing size={16} className="text-[#5E8271]" />
              <span>Phone Inactivity Alert</span>
            </h3>
            <span className="text-[13px] font-bold text-[#5E8271]">
              {settings.inactivityThresholdMinutes} mins
            </span>
          </div>

          <p className="text-[13px] text-[#8A9089] leading-snug">
            If the device remains stationary longer than this window during active hours, REMI plays a calm speaker prompt.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[15, 30, 60].map((mins) => {
              const active = settings.inactivityThresholdMinutes === mins;
              return (
                <button
                  key={mins}
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      inactivityThresholdMinutes: mins,
                    })
                  }
                  className={`py-2.5 rounded-2xl text-[13.5px] font-bold font-display transition active:scale-95 ${
                    active
                      ? "bg-[#5E8271] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#6E756D] border border-[#EFEBE0] hover:bg-[#EFEBE0]"
                  }`}
                >
                  {mins} min
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Capture Strategy */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0] space-y-3">
          <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#6E756D] font-display flex items-center gap-2">
            <Sparkles size={16} className="text-[#5E8271]" />
            <span>Memory Capture Mode</span>
          </h3>

          <div className="space-y-2">
            {[
              {
                id: "meaningful",
                title: "Meaningful conversations only",
                desc: "Quietly filters routine noise; only retains appointments, visits, and personal requests.",
              },
              {
                id: "manual",
                title: "Manual trigger only",
                desc: "Only records when the user presses 'Who is this?' or conversation mic.",
              },
            ].map((opt) => {
              const active = settings.memoryCaptureMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      memoryCaptureMode: opt.id as any,
                    })
                  }
                  className={`w-full p-3.5 rounded-2xl text-left border transition active:scale-[0.99] flex items-start gap-3 ${
                    active
                      ? "bg-[#EFF3EF] border-[#5E8271] text-[#262B27]"
                      : "bg-[#FAF8F5] border-[#EFEBE0] text-[#6E756D]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      active
                        ? "border-[#5E8271] bg-[#5E8271]"
                        : "border-[#B9BDB4]"
                    }`}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold font-display text-[#262B27]">
                      {opt.title}
                    </div>
                    <div className="text-[12.5px] text-[#6E756D] mt-0.5 leading-snug">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Retention Policy */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#6E756D] font-display flex items-center gap-2">
              <HardDrive size={16} className="text-[#5E8271]" />
              <span>Memory Retention</span>
            </h3>
            <span className="text-[13px] font-bold text-[#5E8271]">
              {settings.memoryRetentionDays}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["30 days", "90 days", "Forever"] as const).map((dur) => {
              const active = settings.memoryRetentionDays === dur;
              return (
                <button
                  key={dur}
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      memoryRetentionDays: dur,
                    })
                  }
                  className={`py-2.5 rounded-2xl text-[13px] font-bold font-display transition active:scale-95 ${
                    active
                      ? "bg-[#5E8271] text-white shadow-xs"
                      : "bg-[#FAF8F5] text-[#6E756D] border border-[#EFEBE0] hover:bg-[#EFEBE0]"
                  }`}
                >
                  {dur}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIVACY & ETHICS SECTION (Prompt Requirement) */}
        <div className="bg-[#EFF3EF] rounded-3xl p-5 border border-[#DCE5DF] space-y-3">
          <div className="flex items-center gap-2 text-[#43604F]">
            <Lock size={17} />
            <h3 className="text-[15px] font-extrabold font-display">
              Your memories belong to you.
            </h3>
          </div>

          <p className="text-[13px] text-[#556B5C] leading-relaxed">
            REMI is engineered as a private, supportive memory companion:
          </p>

          <ul className="space-y-2 text-[12.5px] text-[#4A5D50]">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-[#5E8271] shrink-0 mt-0.5" />
              <span><strong>Explicit Consent:</strong> Data is only recorded for registered loved ones and key moments.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-[#5E8271] shrink-0 mt-0.5" />
              <span><strong>Zero Raw Hoarding:</strong> Raw video and audio streams are processed to extract facts, then discarded.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-[#5E8271] shrink-0 mt-0.5" />
              <span><strong>Full Caregiver Control:</strong> Delete individual memories or clear entire timelines at any time.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-[#5E8271] shrink-0 mt-0.5" />
              <span><strong>Calm, Dignified Design:</strong> No alarmist alerts or disorienting medical jargon.</span>
            </li>
          </ul>
        </div>

        {/* Reset & Maintenance */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0] space-y-3">
          <h3 className="text-[15px] font-bold uppercase tracking-wider text-[#6E756D] font-display">
            Data Management &amp; Demo
          </h3>

          <div className="space-y-2">
            <button
              onClick={onResetDemoData}
              className="w-full py-3 rounded-2xl text-[14px] font-semibold font-display text-[#43604F] bg-[#FAF8F5] hover:bg-[#EFEBE0] border border-[#EFEBE0] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              <span>Restore Sample Demo People &amp; Memories</span>
            </button>

            {showClearConfirm ? (
              <div className="p-3 bg-[#FBEEE7] rounded-2xl border border-[#DD8F73]/30 space-y-2">
                <p className="text-[12.5px] text-[#B56345] font-semibold text-center">
                  Are you sure? This will remove all {memoriesCount} memories.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClearAllMemories();
                      setShowClearConfirm(false);
                    }}
                    className="py-2 rounded-xl bg-[#DD8F73] text-white text-[13px] font-bold"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="py-2 rounded-xl bg-white text-[#6E756D] text-[13px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 rounded-2xl text-[14px] font-semibold font-display text-[#B56345] bg-[#FAF8F5] hover:bg-[#FBEEE7] border border-[#EFEBE0] active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={15} />
                <span>Clear All Memories ({memoriesCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
