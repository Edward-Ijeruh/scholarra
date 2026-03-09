import { Timestamp } from "firebase/firestore";

/** Firestore shape (DB) */
export interface FirestoreScholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  fieldOfStudy: string[];
  location: string[];
  degreeLevel: string[];
  fundingType: "full" | "partial";
  deadline: Timestamp;
  applicationOpen?: Timestamp | null;
  sourceURL: string;
  tags: string[];
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  popularityScore?: number;
}

/** UI / App shape (Frontend) */
export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  fieldOfStudy: string[];
  location: string[];
  degreeLevel: string[];
  fundingType: "full" | "partial";
  deadline: Date;
  applicationOpen?: Date | null;
  sourceURL: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  popularityScore?: number;
}
