import { Timestamp } from "firebase/firestore";

// User profile type
export interface UserProfile {
  name: string;
  email: string;
  fieldOfStudy: string[];
  location: string[];
  notificationPrefs: {
    email: boolean;
  };
  role: "user" | "admin";
  createdAt: Timestamp;
}
