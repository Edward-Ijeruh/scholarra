import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "../firebase/firebase";
import { UserProfile } from "@/types/user";

export async function createUserProfile(user: User): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const profile: UserProfile = {
      name: user.displayName ?? "",
      email: user.email ?? "",
      fieldOfStudy: [],
      location: [],
      notificationPrefs: {
        email: true,
        push: false,
      },
      role: "user",
      createdAt: Timestamp.now(),
    };

    await setDoc(userRef, profile);
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
) {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) throw new Error("User profile not found");

  const currentData = snapshot.data() as UserProfile;
  const updatedData: Partial<UserProfile> = {
    ...currentData,
    ...data,
    notificationPrefs: {
      ...currentData.notificationPrefs,
      ...data.notificationPrefs,
    },
  };

  await updateDoc(userRef, updatedData);
}
