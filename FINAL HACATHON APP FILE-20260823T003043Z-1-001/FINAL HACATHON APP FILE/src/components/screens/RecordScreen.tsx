import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Check, Trash2, ArrowLeft, Volume2, Edit3, MessageCircle } from "lucide-react";
import { Person, StructuredMemoryDraft } from "../../types";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import { sound } from "../../utils/audio";

interface RecordScreenProps {
  person: Person;
  onBack: () => void;
  onSaveMemory: (draft: StructuredMemoryDraft) => void;
}

export const RecordScreen: React.FC<RecordScreenProps> = ({
  person,
  onBack,
  onSaveMemory,
}) => {
  const [phase, setPhase] = useState<"listening" | "understanding" | "review">("listening");
  const [spokenTranscript, setSpokenTranscript] = useState(person.sampleLine || "I'll come visit you tomorrow.");
  const [isRecording, setIsRecording] = useState(true);
  const [draft, setDraft] = useState<StructuredMemoryDraft>({
    person: person.name,
    relationship: person.relationship,
    whatHappened: person.expectedEvent || `${person.name} said he will visit tomorrow.`,
    when: person.expectedWhen || "Tomorrow",
    contextNote: "Quietly synthesized from everyday conversation.",
    isAiGenerated: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>([40, 65, 30, 80, 50, 70, 45]);

  // Audio animation visualizer loop
  useEffect(() => {
    if (phase !== "listening") return;
    const interval = setInterval(() => {
      setAudioWaves([
        20 + Math.random() * 60,
        30 + Math.random() * 70,
        15 + Math.random() * 50,
        40 + Math.random() * 60,
        25 + Math.random() * 75,
        35 + Math.random() * 65,
        20 + Math.random() * 55,
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase transition simulation with server-side AI Memory Extraction
  useEffect(() => {
    if (phase === "listening") {
      const listeningTimer = setTimeout(async () => {
        setIsRecording(false);
        setPhase("understanding");

        try {
          const res = await fetch("/api/extract-memory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conversationText: spokenTranscript,
              personName: person.name,
              relationship: person.relationship,
            }),
          });

          const data = await res.json();
          if (data && data.whatHappened) {
            setDraft({
              person: data.person || person.name,
              relationship: data.relationship || person.relationship,
              whatHappened: data.whatHappened,
              when: data.when || person.expectedWhen || "Upcoming",
              contextNote: data.contextNote || "Extracted by REMI Memory Synthesizer",
              isAiGenerated: data.isAiGenerated ?? true,
            });
          }
        } catch (err) {
          console.warn("Using local structured memory synthesizer fallback:", err);
        }

        // Transition to structured review card
        setTimeout(() => {
          setPhase("review");
          sound.playGentleChime("saved");
        }, 1600);
      }, 3400);

      return () => clearTimeout(listeningTimer);
    }
  }, [phase, spokenTranscript, person]);

  const handleCustomSample = (sample: string) => {
    setSpokenTranscript(sample);
    setPhase("listening");
    setIsRecording(true);
  };

  return (
    <div
      id="remi-record-screen"
      className="flex flex-col h-full bg-[#F6F4EF] text-[#262B27] select-none"
    >
      <TopBar
        title="Conversation Memory"
        subtitle={`Observing with ${person.name}`}
        onBack={onBack}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 overflow-y-auto custom-scrollbar">
        {/* PHASE 1: LISTENING */}
        {phase === "listening" && (
          <div className="flex flex-col items-center text-center max-w-[320px] animate-fadeIn">
            {/* Person Anchor */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#EFEBE0] shadow-xs mb-8">
              <Avatar
                photoUrl={person.photoUrl}
                initial={person.initial}
                color={person.avatarColor}
                size={34}
              />
              <div className="text-left">
                <div className="text-[13px] font-bold text-[#262B27] font-display leading-none">
                  {person.name}
                </div>
                <div className="text-[11.5px] font-medium text-[#5E8271]">
                  {person.relationship}
                </div>
              </div>
            </div>

            {/* Pulsing Microphone Core */}
            <div className="relative flex items-center justify-center mb-8">
              <span className="absolute w-36 h-36 rounded-full breathe bg-[#5E8271]/20 pointer-events-none" />
              <span className="absolute w-28 h-28 rounded-full breathe bg-[#5E8271]/35 pointer-events-none" style={{ animationDelay: "0.5s" }} />

              <div className="w-20 h-20 rounded-full bg-[#5E8271] text-white flex items-center justify-center shadow-lg border-4 border-white">
                <Mic size={36} className="animate-pulse" />
              </div>
            </div>

            {/* Waveform Equalizer */}
            <div className="flex items-center justify-center gap-1.5 h-12 mb-4">
              {audioWaves.map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-[#5E8271] rounded-full transition-all duration-150"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <h2 className="text-[22px] font-bold text-[#262B27] font-display mb-2">
              Listening...
            </h2>

            <p className="text-[15px] text-[#6E756D] leading-relaxed italic bg-white/70 p-3.5 rounded-2xl border border-[#EFEBE0]">
              "{spokenTranscript}"
            </p>

            {/* Quick Demo Switcher */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9089]">
                Try alternative conversation:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  onClick={() => handleCustomSample("I'll come visit you tomorrow afternoon!")}
                  className="text-[11.5px] px-2.5 py-1 rounded-full bg-white text-[#43604F] border border-[#EFEBE0] hover:bg-[#EFF3EF]"
                >
                  "Visit tomorrow"
                </button>
                <button
                  onClick={() => handleCustomSample("Please call me tonight around 7!")}
                  className="text-[11.5px] px-2.5 py-1 rounded-full bg-white text-[#43604F] border border-[#EFEBE0] hover:bg-[#EFF3EF]"
                >
                  "Call tonight"
                </button>
                <button
                  onClick={() => handleCustomSample("Dr. Raj's check-up is scheduled for next Tuesday.")}
                  className="text-[11.5px] px-2.5 py-1 rounded-full bg-white text-[#43604F] border border-[#EFEBE0] hover:bg-[#EFF3EF]"
                >
                  "Doctor appointment"
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: UNDERSTANDING */}
        {phase === "understanding" && (
          <div className="flex flex-col items-center text-center max-w-[300px] animate-fadeIn">
            <div className="relative flex items-center justify-center mb-6">
              <span className="absolute w-28 h-28 rounded-full breathe bg-[#E0A752]/25" />
              <div className="w-18 h-18 rounded-full bg-white border-2 border-[#E0A752] flex items-center justify-center shadow-md">
                <Sparkles size={32} className="text-[#E0A752] animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            <h2 className="text-[20px] font-bold text-[#262B27] font-display mb-2">
              Understanding your conversation...
            </h2>

            <p className="text-[14px] text-[#6E756D] leading-relaxed">
              Extracting meaningful orientation facts and discarding raw audio safely.
            </p>
          </div>
        )}

        {/* PHASE 3: STRUCTURED MEMORY REVIEW */}
        {phase === "review" && (
          <div className="w-full max-w-[360px] animate-slideUp">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF3EF] text-[#43604F] text-[12px] font-bold">
                <Sparkles size={13} className="text-[#5E8271]" />
                <span>New Memory Synthesized</span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[12px] font-semibold text-[#5E8271] flex items-center gap-1 hover:underline"
              >
                <Edit3 size={13} />
                <span>{isEditing ? "Done editing" : "Edit details"}</span>
              </button>
            </div>

            {/* Structured Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#EFEBE0] space-y-4 mb-5">
              {/* Person row */}
              <div className="flex items-center gap-3.5 pb-3 border-b border-[#EFEBE0]">
                <Avatar
                  photoUrl={person.photoUrl}
                  initial={draft.person[0].toUpperCase()}
                  color={person.avatarColor}
                  size={48}
                />
                <div>
                  <div className="text-[17px] font-bold text-[#262B27] font-display">
                    {draft.person}
                  </div>
                  <div className="text-[13px] font-bold text-[#5E8271] font-display">
                    {draft.relationship}
                  </div>
                </div>
              </div>

              {/* What happened? */}
              <div>
                <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#8A9089] block mb-1.5 font-display">
                  What happened?
                </label>
                {isEditing ? (
                  <textarea
                    value={draft.whatHappened}
                    onChange={(e) => setDraft({ ...draft, whatHappened: e.target.value })}
                    rows={2}
                    className="w-full rounded-2xl p-3 bg-[#FAF8F5] border border-[#D8D2C4] text-[15px] text-[#262B27] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                  />
                ) : (
                  <div className="text-[15.5px] font-semibold text-[#262B27] leading-snug bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EFEBE0]">
                    {draft.whatHappened}
                  </div>
                )}
              </div>

              {/* When */}
              <div>
                <label className="text-[11.5px] font-bold uppercase tracking-wider text-[#8A9089] block mb-1.5 font-display">
                  When
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={draft.when}
                    onChange={(e) => setDraft({ ...draft, when: e.target.value })}
                    className="w-full rounded-2xl p-3 bg-[#FAF8F5] border border-[#D8D2C4] text-[15px] text-[#262B27] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                  />
                ) : (
                  <div className="text-[14px] font-medium text-[#43604F] bg-[#EFF3EF] px-3 py-2 rounded-xl inline-block">
                    {draft.when}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                id="save-memory-button"
                onClick={() => onSaveMemory(draft)}
                className="w-full py-4 rounded-2xl font-bold text-[16px] font-display bg-[#5E8271] text-white shadow-md active:scale-[0.98] transition-all hover:bg-[#4E6F5F] flex items-center justify-center gap-2"
              >
                <Check size={18} strokeWidth={2.5} />
                <span>Save Memory</span>
              </button>

              <button
                id="discard-memory-button"
                onClick={onBack}
                className="w-full py-3.5 rounded-2xl font-semibold text-[14.5px] font-display text-[#8A9089] hover:text-[#262B27] bg-white border border-[#D8D2C4] hover:bg-[#FAF8F5] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Discard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
