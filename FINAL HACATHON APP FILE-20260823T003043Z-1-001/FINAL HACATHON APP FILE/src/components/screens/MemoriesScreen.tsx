import React, { useState } from "react";
import { Clock, Volume2, Search, Sparkles, Filter, ChevronRight, Calendar } from "lucide-react";
import { MemoryItem, Person } from "../../types";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import { sound } from "../../utils/audio";

interface MemoriesScreenProps {
  memories: MemoryItem[];
  people: Person[];
  onSelectPerson?: (person: Person) => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({
  memories,
  people,
  onSelectPerson,
}) => {
  const [filterPersonId, setFilterPersonId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getPerson = (id: string) => people.find((p) => p.id === id);

  const filteredMemories = memories.filter((m) => {
    if (filterPersonId !== "all" && m.personId !== filterPersonId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.personName.toLowerCase().includes(q) ||
        m.relationship.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.context.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by day (Today, Yesterday, Earlier)
  const initialGrouped: Record<string, MemoryItem[]> = {};
  const grouped = filteredMemories.reduce((acc, item) => {
    const day = item.day || "Today";
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, initialGrouped);

  const handleRead = (e: React.MouseEvent, mem: MemoryItem) => {
    e.stopPropagation();
    sound.playGentleChime("recognition");
    sound.speakGentle(
      `${mem.day} at ${mem.time}. ${mem.description}. Relationship: ${mem.relationship}. Context: ${mem.context}`
    );
  };

  return (
    <div
      id="remi-memories-screen"
      className="flex flex-col h-full bg-[#F6F4EF] text-[#262B27] select-none"
    >
      <TopBar title="My Memories" subtitle="Chronological Timeline" />

      {/* Filter & Search Toolbar */}
      <div className="px-5 pt-3 pb-2 space-y-2.5 bg-[#F6F4EF] shrink-0 border-b border-[#EFEBE0]/60">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9089]"
          />
          <input
            type="text"
            placeholder="Search memories or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#EFEBE0] text-[14px] text-[#262B27] placeholder:text-[#8A9089] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
          />
        </div>

        {/* Person Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          <button
            onClick={() => setFilterPersonId("all")}
            className={`px-3 py-1.5 rounded-full text-[12.5px] font-bold font-display transition shrink-0 ${
              filterPersonId === "all"
                ? "bg-[#5E8271] text-white shadow-2xs"
                : "bg-white text-[#6E756D] border border-[#EFEBE0] hover:bg-[#FAF8F5]"
            }`}
          >
            All ({memories.length})
          </button>
          {people.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPersonId(p.id)}
              className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition shrink-0 flex items-center gap-1.5 ${
                filterPersonId === p.id
                  ? "bg-[#5E8271] text-white shadow-2xs"
                  : "bg-white text-[#6E756D] border border-[#EFEBE0] hover:bg-[#FAF8F5]"
              }`}
            >
              <Avatar
                photoUrl={p.photoUrl}
                initial={p.initial}
                color={p.avatarColor}
                size={18}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 custom-scrollbar">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-[#8A9089]">
            <Clock size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-[16px] font-medium">No memories found</p>
            <p className="text-[13px] mt-1">Try another search or observe a new conversation.</p>
          </div>
        ) : (
          (Object.entries(grouped) as [string, MemoryItem[]][]).map(([day, items]) => (
            <div key={day} className="space-y-3">
              {/* Day Header Badge */}
              <div className="sticky top-0 z-10 py-1 bg-[#F6F4EF]/95 backdrop-blur-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5E8271]" />
                <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#43604F] font-display">
                  {day}
                </h2>
                <span className="text-[12px] text-[#8A9089] font-medium">
                  ({items.length} {items.length === 1 ? "moment" : "moments"})
                </span>
              </div>

              {/* Connected Timeline Column */}
              <div className="relative pl-4 space-y-4 border-l-2 border-[#E7E3D9] ml-1.5">
                {items.map((mem) => {
                  const person = getPerson(mem.personId);
                  return (
                    <div
                      key={mem.id}
                      className="relative group bg-white rounded-3xl p-4.5 shadow-xs border border-[#EFEBE0] hover:border-[#D8D2C4] transition-all"
                    >
                      {/* Timeline Dot Indicator */}
                      <span
                        className="absolute -left-[23px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: mem.avatarColor || "#5E8271" }}
                      />

                      {/* Card Content */}
                      <div className="flex items-start gap-3.5">
                        <Avatar
                          photoUrl={mem.photoUrl || person?.photoUrl}
                          initial={mem.personName ? mem.personName[0].toUpperCase() : "M"}
                          color={mem.avatarColor || "#5E8271"}
                          size={50}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="text-[12.5px] font-semibold text-[#8A9089] flex items-center gap-1">
                              <Clock size={12} />
                              <span>{mem.time}</span>
                            </div>

                            <button
                              onClick={(e) => handleRead(e, mem)}
                              title="Listen to memory"
                              className="p-1 rounded-full text-[#8A9089] hover:text-[#5E8271] hover:bg-[#EFF3EF] transition"
                            >
                              <Volume2 size={15} />
                            </button>
                          </div>

                          <h3 className="text-[16px] font-bold text-[#262B27] font-display mt-0.5 leading-snug">
                            {mem.description}
                          </h3>

                          <div className="text-[12.5px] font-bold text-[#5E8271] font-display mt-0.5">
                            {mem.relationship}
                          </div>

                          <p className="text-[14.5px] text-[#555C54] mt-2 leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE0]">
                            "{mem.context}"
                          </p>

                          {mem.whenOccurring && (
                            <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EFF3EF] text-[#43604F] text-[11.5px] font-semibold">
                              <Calendar size={12} />
                              <span>{mem.whenOccurring}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
