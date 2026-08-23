import React from "react";
import { Camera, Sparkles, Volume2, Clock, Plus, ChevronRight } from "lucide-react";
import { Person, MemoryItem, ScreenType } from "../../types";
import { Avatar } from "../Avatar";
import { ReconnectionBanner } from "../ReconnectionModal";
import { sound } from "../../utils/audio";

interface HomeScreenProps {
  people: Person[];
  memories: MemoryItem[];
  patientName: string;
  greeting: string;
  onOpenCamera: () => void;
  onNavigate: (screen: ScreenType) => void;
  reconnectPerson: Person | null;
  onDismissReconnect: () => void;
  onSelectPerson: (person: Person) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  people,
  memories,
  patientName,
  greeting,
  onOpenCamera,
  onNavigate,
  reconnectPerson,
  onDismissReconnect,
  onSelectPerson,
}) => {
  const recentMemories = memories.slice(0, 3);
  const getPerson = (id: string) => people.find((p) => p.id === id);

  const handleReadMemory = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    sound.playGentleChime("recognition");
    sound.speakGentle(text);
  };

  return (
    <div
      id="remi-home-screen"
      className="flex flex-col h-full bg-[#F6F4EF] text-[#262B27] select-none"
    >
      {/* Top Ambient Status Header */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF3EF] border border-[#Dce5DF]">
            <span className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full bg-[#5E8271] breathe" />
            </span>
            <span className="text-[12.5px] font-semibold text-[#43604F]">
              REMI is listening &amp; observing gently
            </span>
          </div>

          <span className="text-[12.5px] font-medium text-[#8A9089]">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        {/* Large Greeting */}
        <h1 className="text-[30px] font-extrabold tracking-tight text-[#262B27] font-display">
          {greeting}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 custom-scrollbar">
        {/* Reconnection Prompt if active */}
        {reconnectPerson && (
          <ReconnectionBanner
            person={reconnectPerson}
            onViewMemory={() => onNavigate("memories")}
            onDismiss={onDismissReconnect}
          />
        )}

        {/* Recent Memories Section Header */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#6E756D] font-display">
            Recent Memories
          </h2>

          <button
            onClick={() => onNavigate("memories")}
            className="text-[13px] font-semibold text-[#5E8271] hover:underline flex items-center gap-0.5"
          >
            <span>View timeline</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Memory Cards (Large readable cards as requested) */}
        <div className="space-y-3.5">
          {recentMemories.map((mem) => {
            const person = getPerson(mem.personId);
            return (
              <div
                key={mem.id}
                id={`memory-card-${mem.id}`}
                onClick={() => {
                  if (person) onSelectPerson(person);
                }}
                className="bg-white rounded-3xl p-5 shadow-xs border border-[#EFEBE0] hover:border-[#D8D2C4] active:scale-[0.99] transition-all cursor-pointer relative group"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    photoUrl={mem.photoUrl || person?.photoUrl}
                    initial={mem.personName ? mem.personName[0].toUpperCase() : "M"}
                    color={mem.avatarColor || person?.avatarColor || "#5E8271"}
                    size={58}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-[17px] font-bold text-[#262B27] font-display leading-tight">
                        {mem.description}
                      </h3>
                      <button
                        onClick={(e) =>
                          handleReadMemory(
                            e,
                            `${mem.description}. Relationship: ${mem.relationship}. Details: ${mem.context}`
                          )
                        }
                        title="Read memory aloud"
                        aria-label="Listen to memory"
                        className="p-1.5 rounded-full text-[#8A9089] hover:text-[#5E8271] hover:bg-[#EFF3EF] transition"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="text-[13px] font-bold text-[#5E8271] mb-2 font-display">
                      {mem.relationship}
                    </div>

                    <p className="text-[15px] text-[#555C54] leading-snug bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE0]">
                      "{mem.context}"
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[12px] text-[#8A9089]">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={12} />
                        <span>{mem.day} · {mem.time}</span>
                      </span>

                      {mem.whenOccurring && (
                        <span className="font-semibold text-[#43604F] bg-[#EFF3EF] px-2.5 py-0.5 rounded-full text-[11.5px]">
                          {mem.whenOccurring}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent "Who is this?" Camera Action Bar */}
      <div className="px-6 pb-6 pt-3 shrink-0 bg-gradient-to-t from-[#F6F4EF] via-[#F6F4EF] to-transparent">
        <button
          id="who-is-this-camera-button"
          onClick={onOpenCamera}
          className="w-full py-4.5 px-6 rounded-3xl bg-[#262B27] text-white shadow-xl hover:bg-[#1B1F1C] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-black/10"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
            <Camera size={22} className="text-white" />
          </div>
          <div className="text-left">
            <div className="text-[18px] font-bold font-display leading-tight">
              Who is this?
            </div>
            <div className="text-[12.5px] text-[#C7CCC5] font-normal">
              Point camera to identify someone familiar
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
