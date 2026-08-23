import React, { useState } from "react";
import { Plus, X, Camera, MessageSquare, Clock, Phone, ChevronRight, Sparkles, Heart } from "lucide-react";
import { Person, MemoryItem } from "../../types";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import { sound } from "../../utils/audio";

interface PeopleScreenProps {
  people: Person[];
  memories: MemoryItem[];
  onAddPerson: (newPerson: Person) => void;
  onSelectForCamera: (person: Person) => void;
  onSelectForRecord: (person: Person) => void;
  onViewMemories: () => void;
}

const COLOR_PALETTE = ["#5E8271", "#E0A752", "#7C8CA6", "#B57B6B", "#8C7AA6", "#43604F"];

export const PeopleScreen: React.FC<PeopleScreenProps> = ({
  people,
  memories,
  onAddPerson,
  onSelectForCamera,
  onSelectForRecord,
  onViewMemories,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [importantInfo, setImportantInfo] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [photoUrl, setPhotoUrl] = useState("");

  const getMemoriesForPerson = (personId: string) =>
    memories.filter((m) => m.personId === personId);

  const handleSubmitNewPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;

    const newPerson: Person = {
      id: `p_${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim(),
      lastInteraction: "Just registered",
      avatarColor: selectedColor,
      initial: name.trim()[0].toUpperCase(),
      photoUrl: photoUrl.trim() || undefined,
      importantInfo: importantInfo.trim() || "Registered familiar person.",
      sampleLine: `Hello! So nice seeing you today.`,
      expectedEvent: `${name.trim()} visited with you today.`,
      expectedWhen: "Today",
      phone: phone.trim() || undefined,
    };

    onAddPerson(newPerson);
    sound.playGentleChime("saved");

    // Reset
    setName("");
    setRelationship("");
    setImportantInfo("");
    setPhone("");
    setPhotoUrl("");
    setShowAddModal(false);
  };

  return (
    <div
      id="remi-people-screen"
      className="flex flex-col h-full bg-[#F6F4EF] text-[#262B27] select-none relative"
    >
      <TopBar
        title="People"
        subtitle="Familiar Faces & Circles"
        rightElement={
          <button
            id="add-person-button"
            onClick={() => setShowAddModal(true)}
            aria-label="Add person"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#5E8271] text-white shadow-xs active:scale-95 transition hover:bg-[#4E6F5F]"
          >
            <Plus size={20} />
          </button>
        }
      />

      {/* People Directory List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 custom-scrollbar">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#8A9089] font-display">
            {people.length} Familiar People
          </span>
          <span className="text-[12px] font-medium text-[#5E8271]">
            Tap card for context
          </span>
        </div>

        {people.map((person) => {
          const personMemories = getMemoriesForPerson(person.id);
          return (
            <div
              key={person.id}
              id={`person-card-${person.id}`}
              onClick={() => setSelectedPerson(person)}
              className="bg-white rounded-3xl p-4.5 shadow-xs border border-[#EFEBE0] hover:border-[#D8D2C4] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Avatar
                  photoUrl={person.photoUrl}
                  initial={person.initial}
                  color={person.avatarColor}
                  size={58}
                />

                <div className="min-w-0">
                  <div className="text-[18px] font-bold text-[#262B27] font-display leading-tight">
                    {person.name}
                  </div>
                  <div className="text-[13.5px] font-bold text-[#5E8271] font-display mt-0.5">
                    {person.relationship}
                  </div>
                  <div className="text-[12px] text-[#8A9089] mt-1 flex items-center gap-2">
                    <span>{personMemories.length} memories</span>
                    <span>•</span>
                    <span>Last seen {person.lastInteraction.toLowerCase()}</span>
                  </div>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-[#B9BDB4] group-hover:text-[#5E8271] group-hover:translate-x-0.5 transition shrink-0"
              />
            </div>
          );
        })}
      </div>

      {/* Person Detail Drawer */}
      {selectedPerson && (
        <div
          id="person-detail-drawer-overlay"
          className="absolute inset-0 z-40 flex flex-col justify-end bg-[#262B27]/40 backdrop-blur-xs p-3 animate-fadeIn"
        >
          <div className="w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#EFEBE0] max-h-[85%] flex flex-col animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE0]">
              <div className="flex items-center gap-3.5">
                <Avatar
                  photoUrl={selectedPerson.photoUrl}
                  initial={selectedPerson.initial}
                  color={selectedPerson.avatarColor}
                  size={58}
                  ring
                />
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#262B27] font-display">
                    {selectedPerson.name}
                  </h3>
                  <p className="text-[14px] font-bold text-[#5E8271] font-display">
                    {selectedPerson.relationship}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPerson(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F6F4EF] text-[#6E756D] hover:bg-[#EFEBE0] active:scale-95 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar">
              <div>
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#8A9089] block mb-1 font-display">
                  Important Information
                </span>
                <p className="text-[14.5px] text-[#555C54] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EFEBE0]">
                  {selectedPerson.importantInfo}
                </p>
              </div>

              {selectedPerson.phone && (
                <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFEBE0]">
                  <span className="text-[13px] text-[#6E756D] flex items-center gap-2">
                    <Phone size={14} className="text-[#5E8271]" />
                    <span>{selectedPerson.phone}</span>
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#5E8271] bg-[#EFF3EF] px-2.5 py-0.5 rounded-full">
                    Saved contact
                  </span>
                </div>
              )}

              {/* Recent memories with this person */}
              <div>
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#8A9089] block mb-2 font-display">
                  Recent Memories with {selectedPerson.name}
                </span>

                <div className="space-y-2">
                  {getMemoriesForPerson(selectedPerson.id).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EFEBE0]"
                    >
                      <div className="text-[13.5px] font-bold text-[#262B27] font-display">
                        {m.description}
                      </div>
                      <div className="text-[13px] text-[#6E756D] mt-0.5">
                        "{m.context}"
                      </div>
                      <div className="text-[11px] text-[#8A9089] mt-1 font-medium">
                        {m.day} at {m.time}
                      </div>
                    </div>
                  ))}
                  {getMemoriesForPerson(selectedPerson.id).length === 0 && (
                    <p className="text-[13px] text-[#8A9089] italic">
                      No memories recorded yet with {selectedPerson.name}.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#EFEBE0] grid grid-cols-2 gap-2.5">
              <button
                id="person-drawer-record-button"
                onClick={() => {
                  const p = selectedPerson;
                  setSelectedPerson(null);
                  onSelectForRecord(p);
                }}
                className="py-3.5 rounded-2xl font-bold text-[14px] font-display bg-[#5E8271] text-white shadow-xs active:scale-[0.98] transition flex items-center justify-center gap-1.5 hover:bg-[#4E6F5F]"
              >
                <MessageSquare size={16} />
                <span>Record conversation</span>
              </button>

              <button
                id="person-drawer-camera-button"
                onClick={() => {
                  const p = selectedPerson;
                  setSelectedPerson(null);
                  onSelectForCamera(p);
                }}
                className="py-3.5 rounded-2xl font-semibold text-[14px] font-display text-[#262B27] bg-[#F6F4EF] hover:bg-[#EFEBE0] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
              >
                <Camera size={16} />
                <span>Scan camera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal (Caregiver Mode friendly) */}
      {showAddModal && (
        <div
          id="add-person-modal-overlay"
          className="absolute inset-0 z-50 flex flex-col justify-end bg-[#262B27]/40 backdrop-blur-xs p-3 animate-fadeIn"
        >
          <div className="w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#EFEBE0] max-h-[90%] flex flex-col animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE0] mb-4">
              <div>
                <h3 className="text-[19px] font-bold text-[#262B27] font-display">
                  Register Familiar Person
                </h3>
                <p className="text-[12px] text-[#6E756D]">
                  REMI will recognize them visually and during speech.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F6F4EF] text-[#6E756D] hover:bg-[#EFEBE0] active:scale-95 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPerson} className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1 font-display">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav, Priya, Dr. Raj"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 bg-[#FAF8F5] border border-[#EFEBE0] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1 font-display">
                  Relationship *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grandson, Daughter, Doctor, Neighbor"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 bg-[#FAF8F5] border border-[#EFEBE0] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1 font-display">
                  Important Information
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Visits Sundays, brings muffins, studying college..."
                  value={importantInfo}
                  onChange={(e) => setImportantInfo(e.target.value)}
                  className="w-full rounded-2xl p-3 bg-[#FAF8F5] border border-[#EFEBE0] text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#5E8271]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#6E756D] block mb-1 font-display">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === c ? "scale-115 ring-3 ring-[#262B27]/20 ring-offset-2" : "opacity-80"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-[16px] font-display bg-[#5E8271] text-white shadow-md active:scale-[0.98] transition hover:bg-[#4E6F5F]"
                >
                  Save Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
