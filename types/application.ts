import { Timestamp } from "firebase/firestore";

// Status of a scholarship application
export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "interview"
  | "offer"
  | "rejected";

// Checklist item for tracking required tasks
export type ApplicationChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

// Activity timeline entry
export type ApplicationTimelineItem = {
  type: "created" | "status_change" | "note";
  message: string;
  createdAt: Timestamp;
};

// Firestore Application Document
export type Application = {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipTitle: string;
  scholarshipUrl: string;
  status: ApplicationStatus;
  appliedAt: Timestamp;
  updatedAt: Timestamp;
  notes: string;
  checklist: ApplicationChecklistItem[];
  timeline: ApplicationTimelineItem[];
};

// Firestore write type
export type ApplicationDocument = Omit<Application, "id">;
