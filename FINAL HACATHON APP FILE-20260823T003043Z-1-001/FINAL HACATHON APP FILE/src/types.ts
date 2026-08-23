export interface Person {
  id: string;
  name: string;
  relationship: string;
  lastInteraction: string;
  avatarColor: string;
  photoUrl?: string;
  initial: string;
  importantInfo: string;
  sampleLine: string;
  expectedEvent: string;
  expectedWhen: string;
  phone?: string;
  tags?: string[];
}

export interface MemoryItem {
  id: string;
  personId: string;
  personName: string;
  relationship: string;
  day: string; // "Today" | "Yesterday" | "Earlier" | date string
  time: string;
  timestamp: number;
  description: string;
  context: string;
  whenOccurring?: string;
  importance: "high" | "medium" | "low";
  source: "conversation" | "observation" | "caregiver";
  avatarColor: string;
  photoUrl?: string;
}

export interface CaregiverSettings {
  inactivityThresholdMinutes: number;
  memoryCaptureMode: "meaningful" | "all" | "manual";
  memoryRetentionDays: "30 days" | "90 days" | "Forever";
  patientName: string;
  audioFeedbackEnabled: boolean;
  quietHours: boolean;
}

export type ScreenType = "home" | "memories" | "people" | "caregiver";
export type SubScreenType = "camera" | "record" | null;

export interface StructuredMemoryDraft {
  person: string;
  relationship: string;
  whatHappened: string;
  when: string;
  contextNote?: string;
  isAiGenerated?: boolean;
}
