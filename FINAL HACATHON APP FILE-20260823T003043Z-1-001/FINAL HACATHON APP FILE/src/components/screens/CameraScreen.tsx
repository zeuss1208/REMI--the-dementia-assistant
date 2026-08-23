import React, { useState, useEffect, useRef } from "react";
import { Camera, X, RefreshCw, Volume2, Sparkles, MessageSquare, Clock, UserCheck } from "lucide-react";
import { Person } from "../../types";
import { Avatar } from "../Avatar";
import { TopBar } from "../TopBar";
import { sound } from "../../utils/audio";

interface CameraScreenProps {
  people: Person[];
  onBack: () => void;
  onPersonRecognized: (person: Person, action: "view" | "record") => void;
  initialSelectedPerson?: Person | null;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  people,
  onBack,
  onPersonRecognized,
  initialSelectedPerson,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(
    initialSelectedPerson || null
  );
  const [scanConfidence, setScanConfidence] = useState(0);

  // Initialize camera or realistic simulated video
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.log("Real camera stream not permitted, utilizing simulated camera view:", err);
        setCameraActive(false);
      }
    }

    setupCamera();

    // Auto-detect a person after a brief calm scanning phase (default to Aarav for demo step 3)
    const scanTimer = setTimeout(() => {
      const target = initialSelectedPerson || people[0] || null;
      if (target) {
        setRecognizedPerson(target);
        setIsScanning(false);
        setScanConfidence(98);
        sound.playGentleChime("recognition");
        sound.speakGentle(`${target.name}. Your ${target.relationship.toLowerCase()}.`);
      }
    }, 1400);

    return () => {
      clearTimeout(scanTimer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initialSelectedPerson, people]);

  const handleManualPick = (person: Person) => {
    setIsScanning(true);
    setRecognizedPerson(null);
    setTimeout(() => {
      setRecognizedPerson(person);
      setIsScanning(false);
      setScanConfidence(99);
      sound.playGentleChime("recognition");
      sound.speakGentle(`${person.name}. Your ${person.relationship.toLowerCase()}.`);
    }, 600);
  };

  const handleRescan = () => {
    setIsScanning(true);
    setRecognizedPerson(null);
    setTimeout(() => {
      const randomPerson = people[Math.floor(Math.random() * people.length)];
      setRecognizedPerson(randomPerson);
      setIsScanning(false);
      sound.playGentleChime("recognition");
    }, 1200);
  };

  return (
    <div
      id="remi-camera-screen"
      className="flex flex-col h-full bg-[#1B1F1C] text-white select-none relative"
    >
      <TopBar
        title="Person Recognition"
        subtitle="REMI Visual Memory Layer"
        onBack={onBack}
        rightElement={
          <button
            onClick={handleRescan}
            title="Scan again"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 transition"
          >
            <RefreshCw size={17} className={isScanning ? "animate-spin" : ""} />
          </button>
        }
      />

      {/* Main Viewport */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center mx-4 my-2 rounded-3xl bg-[#0F1310] border border-white/10 shadow-inner">
        {/* Real Video element if active */}
        {cameraActive && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          />
        )}

        {/* Ambient Simulated Backdrop if camera is off or loading */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1E2520] to-[#121613]">
            {recognizedPerson ? (
              <div className="relative mb-6">
                <Avatar
                  photoUrl={recognizedPerson.photoUrl}
                  initial={recognizedPerson.initial}
                  color={recognizedPerson.avatarColor}
                  size={120}
                  ring
                />
                <span className="absolute -bottom-2 right-2 bg-[#5E8271] text-white p-2 rounded-full shadow-md">
                  <UserCheck size={18} />
                </span>
              </div>
            ) : (
              <div className="relative mb-6">
                <span className="absolute -inset-4 rounded-full breathe bg-[#5E8271]/20" />
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Camera size={44} className="text-white/80" />
                </div>
              </div>
            )}

            <p className="text-[16px] text-[#C7CCC5] font-medium max-w-[260px] leading-relaxed">
              {isScanning
                ? "REMI is observing quietly... identifying facial context."
                : "Person identified successfully."}
            </p>
          </div>
        )}

        {/* Scanning Visor & Radar Overlay */}
        <div className="absolute inset-8 rounded-2xl border-2 border-white/20 pointer-events-none flex flex-col justify-between p-4">
          <div className="flex justify-between">
            <span className="w-6 h-6 border-t-2 border-l-2 border-[#5E8271]" />
            <span className="w-6 h-6 border-t-2 border-r-2 border-[#5E8271]" />
          </div>

          {isScanning && (
            <div className="w-full h-0.5 bg-[#5E8271] shadow-[0_0_12px_#5E8271] radar-scan" />
          )}

          <div className="flex justify-between">
            <span className="w-6 h-6 border-b-2 border-l-2 border-[#5E8271]" />
            <span className="w-6 h-6 border-b-2 border-r-2 border-[#5E8271]" />
          </div>
        </div>

        {/* Quick Demo Person Picker Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-center gap-1.5 p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/15 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-bold text-white/70 px-2 font-display">
            Quick Match:
          </span>
          {people.map((p) => (
            <button
              key={p.id}
              onClick={() => handleManualPick(p)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all shrink-0 ${
                recognizedPerson?.id === p.id
                  ? "bg-[#5E8271] text-white shadow-xs"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Detected Person Identification Card (Bottom Drawer) */}
        {recognizedPerson && (
          <div
            id="person-recognition-card"
            className="absolute inset-x-0 bottom-0 bg-white text-[#262B27] rounded-t-[32px] p-6 shadow-2xl animate-slideUp z-30 border-t border-[#EFEBE0]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF3EF] text-[#43604F] text-[12px] font-bold">
                <Sparkles size={13} className="text-[#5E8271]" />
                <span>Identified ({scanConfidence || 98}% match)</span>
              </div>

              <button
                onClick={() => setRecognizedPerson(null)}
                aria-label="Close card"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F6F4EF] hover:bg-[#EFEBE0] text-[#6E756D] active:scale-95 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-5">
              <Avatar
                photoUrl={recognizedPerson.photoUrl}
                initial={recognizedPerson.initial}
                color={recognizedPerson.avatarColor}
                size={66}
                ring
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[22px] font-extrabold text-[#262B27] font-display">
                    {recognizedPerson.name}
                  </h2>
                  <button
                    onClick={() =>
                      sound.speakGentle(
                        `${recognizedPerson.name}, your ${recognizedPerson.relationship.toLowerCase()}. Last seen ${recognizedPerson.lastInteraction.toLowerCase()}.`
                      )
                    }
                    title="Speak details"
                    className="p-1 rounded-full text-[#8A9089] hover:text-[#5E8271]"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                <div className="text-[15px] font-bold text-[#5E8271] font-display">
                  Your {recognizedPerson.relationship.toLowerCase()}
                </div>

                <div className="text-[13px] text-[#8A9089] mt-0.5 font-medium">
                  Last seen {recognizedPerson.lastInteraction.toLowerCase()}
                </div>
              </div>
            </div>

            {/* Context Note */}
            <p className="text-[14px] text-[#6E756D] bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFEBE0] mb-5 leading-relaxed">
              {recognizedPerson.importantInfo}
            </p>

            {/* Action Buttons (Record conversation & View memories) */}
            <div className="space-y-2.5">
              <button
                id="camera-start-conversation-button"
                onClick={() => onPersonRecognized(recognizedPerson, "record")}
                className="w-full py-4 rounded-2xl font-bold text-[16px] font-display bg-[#5E8271] text-white shadow-sm active:scale-[0.98] transition-all hover:bg-[#4E6F5F] flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                <span>Start conversation memory</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="camera-view-memories-button"
                  onClick={() => onPersonRecognized(recognizedPerson, "view")}
                  className="py-3 rounded-2xl font-semibold text-[14px] font-display text-[#43604F] bg-[#F6F4EF] hover:bg-[#EFEBE0] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                >
                  <Clock size={16} />
                  <span>View memories</span>
                </button>

                <button
                  onClick={onBack}
                  className="py-3 rounded-2xl font-semibold text-[14px] font-display text-[#6E756D] bg-[#F6F4EF] hover:bg-[#EFEBE0] active:scale-[0.98] transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
