/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Person,
  MemoryItem,
  CaregiverSettings,
  ScreenType,
  SubScreenType,
  StructuredMemoryDraft,
} from "./types";
import {
  INITIAL_PEOPLE,
  INITIAL_MEMORIES,
  INITIAL_CAREGIVER_SETTINGS,
} from "./data/initialData";
import { BottomNav } from "./components/BottomNav";
import { InteractiveTour } from "./components/InteractiveTour";
import { PhoneLeftAlertModal } from "./components/PhoneLeftAlertModal";
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { CameraScreen } from "./components/screens/CameraScreen";
import { RecordScreen } from "./components/screens/RecordScreen";
import { MemoriesScreen } from "./components/screens/MemoriesScreen";
import { PeopleScreen } from "./components/screens/PeopleScreen";
import { CaregiverScreen } from "./components/screens/CaregiverScreen";
import { sound } from "./utils/audio";

export default function App() {
  // App state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem("remi_onboarded") === "true";
    } catch {
      return false;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>("home");
  const [subScreen, setSubScreen] = useState<SubScreenType>(null);
  const [activePersonForFlow, setActivePersonForFlow] = useState<Person | null>(null);

  // Core Data
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem("remi_people");
      return saved ? JSON.parse(saved) : INITIAL_PEOPLE;
    } catch {
      return INITIAL_PEOPLE;
    }
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("remi_memories");
      return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [settings, setSettings] = useState<CaregiverSettings>(() => {
    try {
      const saved = localStorage.getItem("remi_settings");
      return saved ? JSON.parse(saved) : INITIAL_CAREGIVER_SETTINGS;
    } catch {
      return INITIAL_CAREGIVER_SETTINGS;
    }
  });

  // Modal / Alert triggers
  const [showPhoneLeftAlert, setShowPhoneLeftAlert] = useState<boolean>(false);
  const [reconnectPerson, setReconnectPerson] = useState<Person | null>(null);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("remi_people", JSON.stringify(people));
    } catch {}
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem("remi_memories", JSON.stringify(memories));
    } catch {}
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem("remi_settings", JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("remi_onboarded", String(hasCompletedOnboarding));
    } catch {}
  }, [hasCompletedOnboarding]);

  // Gentle Reconnection Trigger on Home
  const reconnectScheduledRef = useRef(false);
  useEffect(() => {
    if (hasCompletedOnboarding && currentScreen === "home" && !reconnectScheduledRef.current) {
      reconnectScheduledRef.current = true;
      const t = setTimeout(() => {
        const aarav = people.find((p) => p.id === "aarav") || people[0];
        if (aarav) {
          setReconnectPerson(aarav);
          sound.playGentleChime("reconnect");
        }
      }, 4200);
      return () => clearTimeout(t);
    }
  }, [hasCompletedOnboarding, currentScreen, people]);

  // Dynamic greeting based on user time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 17) return "Good afternoon.";
    return "Good evening.";
  };

  // Handlers
  const handleStartOnboarding = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen("home");
    setDemoStep(1);
    sound.playGentleChime("reconnect");
  };

  const handleCaregiverSetupOnboarding = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen("caregiver");
    sound.playGentleChime("reconnect");
  };

  const handleOpenCamera = (personTarget?: Person) => {
    setActivePersonForFlow(personTarget || people[0] || null);
    setSubScreen("camera");
    setDemoStep(2);
  };

  const handlePersonRecognized = (person: Person, action: "view" | "record") => {
    setActivePersonForFlow(person);
    if (action === "record") {
      setSubScreen("record");
      setDemoStep(3);
    } else {
      setSubScreen(null);
      setCurrentScreen("people");
    }
  };

  const handleSaveMemoryFromRecord = (draft: StructuredMemoryDraft) => {
    const newMemoryItem: MemoryItem = {
      id: `mem_${Date.now()}`,
      personId: activePersonForFlow?.id || "aarav",
      personName: draft.person,
      relationship: draft.relationship,
      day: "Today",
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      timestamp: Date.now(),
      description: `${draft.person} shared a meaningful update.`,
      context: draft.whatHappened,
      whenOccurring: draft.when,
      importance: "high",
      source: "conversation",
      avatarColor: activePersonForFlow?.avatarColor || "#5E8271",
      photoUrl: activePersonForFlow?.photoUrl,
    };

    setMemories((prev) => [newMemoryItem, ...prev]);
    sound.playGentleChime("saved");

    // Close record subscreen and navigate to memories
    setSubScreen(null);
    setActivePersonForFlow(null);
    setCurrentScreen("memories");
    setDemoStep(5);
  };

  const handleAddPerson = (newPerson: Person) => {
    setPeople((prev) => [newPerson, ...prev]);
  };

  const handleResetDemoData = () => {
    setPeople(INITIAL_PEOPLE);
    setMemories(INITIAL_MEMORIES);
    setSettings(INITIAL_CAREGIVER_SETTINGS);
    sound.playGentleChime("saved");
  };

  // Demo step jumping for fast interactive tour
  const handleDemoStepClick = (index: number) => {
    setDemoStep(index);
    switch (index) {
      case 0: // Step 1: Welcome
        setHasCompletedOnboarding(false);
        setSubScreen(null);
        break;
      case 1: // Step 2: People
        setHasCompletedOnboarding(true);
        setSubScreen(null);
        setCurrentScreen("people");
        break;
      case 2: // Step 3: Camera
        setHasCompletedOnboarding(true);
        setActivePersonForFlow(people.find((p) => p.id === "aarav") || people[0]);
        setSubScreen("camera");
        break;
      case 3: // Step 4: Record
        setHasCompletedOnboarding(true);
        setActivePersonForFlow(people.find((p) => p.id === "aarav") || people[0]);
        setSubScreen("record");
        break;
      case 4: // Step 5: AI memory draft review
        setHasCompletedOnboarding(true);
        setActivePersonForFlow(people.find((p) => p.id === "aarav") || people[0]);
        setSubScreen("record");
        break;
      case 5: // Step 6: Memories timeline
        setHasCompletedOnboarding(true);
        setSubScreen(null);
        setCurrentScreen("memories");
        break;
      case 6: // Step 7: Phone left behind alert
        setHasCompletedOnboarding(true);
        setSubScreen(null);
        setCurrentScreen("home");
        setShowPhoneLeftAlert(true);
        break;
      case 7: // Step 8: Reconnection notification
        setHasCompletedOnboarding(true);
        setSubScreen(null);
        setCurrentScreen("home");
        setReconnectPerson(people.find((p) => p.id === "aarav") || people[0]);
        sound.playGentleChime("reconnect");
        break;
      default:
        break;
    }
  };

  // Select which screen to render inside the mobile viewport
  const renderScreenContent = () => {
    if (!hasCompletedOnboarding) {
      return (
        <OnboardingScreen
          onGetStarted={handleStartOnboarding}
          onCaregiverSetup={handleCaregiverSetupOnboarding}
        />
      );
    }

    if (subScreen === "camera") {
      return (
        <CameraScreen
          people={people}
          initialSelectedPerson={activePersonForFlow}
          onBack={() => {
            setSubScreen(null);
            setActivePersonForFlow(null);
          }}
          onPersonRecognized={handlePersonRecognized}
        />
      );
    }

    if (subScreen === "record" && activePersonForFlow) {
      return (
        <RecordScreen
          person={activePersonForFlow}
          onBack={() => {
            setSubScreen(null);
            setActivePersonForFlow(null);
          }}
          onSaveMemory={handleSaveMemoryFromRecord}
        />
      );
    }

    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            people={people}
            memories={memories}
            patientName={settings.patientName}
            greeting={getGreeting()}
            onOpenCamera={() => handleOpenCamera()}
            onNavigate={(screen) => setCurrentScreen(screen)}
            reconnectPerson={reconnectPerson}
            onDismissReconnect={() => setReconnectPerson(null)}
            onSelectPerson={(person) => {
              setActivePersonForFlow(person);
              setCurrentScreen("people");
            }}
          />
        );
      case "memories":
        return (
          <MemoriesScreen
            memories={memories}
            people={people}
            onSelectPerson={(person) => {
              setActivePersonForFlow(person);
              setCurrentScreen("people");
            }}
          />
        );
      case "people":
        return (
          <PeopleScreen
            people={people}
            memories={memories}
            onAddPerson={handleAddPerson}
            onSelectForCamera={(person) => handleOpenCamera(person)}
            onSelectForRecord={(person) => {
              setActivePersonForFlow(person);
              setSubScreen("record");
            }}
            onViewMemories={() => setCurrentScreen("memories")}
          />
        );
      case "caregiver":
        return (
          <CaregiverScreen
            settings={settings}
            onUpdateSettings={setSettings}
            peopleCount={people.length}
            memoriesCount={memories.length}
            onTriggerPhoneAlert={() => {
              setCurrentScreen("home");
              setSubScreen(null);
              setShowPhoneLeftAlert(true);
            }}
            onClearAllMemories={() => setMemories([])}
            onResetDemoData={handleResetDemoData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="remi-app-root"
      className="w-full min-h-screen flex flex-col items-center justify-center bg-[#EDEAE2] text-[#262B27] p-0 sm:p-4 selection:bg-[#5E8271]/20 font-sans"
    >
      {/* Top Interactive Demo Stepper Guide */}
      <div className="w-full max-w-[420px] shadow-sm rounded-t-3xl overflow-hidden">
        <InteractiveTour
          currentStep={demoStep}
          onStepClick={handleDemoStepClick}
          onReset={() => handleDemoStepClick(0)}
        />
      </div>

      {/* Main Mobile App Frame */}
      <main
        id="remi-mobile-container"
        className="w-full max-w-[420px] h-[100dvh] sm:h-[840px] bg-[#F6F4EF] rounded-none sm:rounded-b-3xl sm:rounded-t-none shadow-2xl flex flex-col overflow-hidden relative border-0 sm:border-x-8 sm:border-b-8 sm:border-[#262B27]"
      >
        {/* Dynamic Screen Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {renderScreenContent()}

          {/* Global Phone Left Behind Alert Modal */}
          {showPhoneLeftAlert && (
            <PhoneLeftAlertModal
              inactivityMinutes={settings.inactivityThresholdMinutes}
              onClose={() => setShowPhoneLeftAlert(false)}
            />
          )}
        </div>

        {/* Global Bottom Navigation (visible when onboarded and not in camera/recording) */}
        {hasCompletedOnboarding && !subScreen && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              if (screen === "people") setDemoStep(1);
              if (screen === "memories") setDemoStep(5);
              if (screen === "caregiver") setDemoStep(6);
            }}
          />
        )}
      </main>
    </div>
  );
}
