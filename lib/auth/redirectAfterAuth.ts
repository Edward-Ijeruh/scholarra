import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";

export const redirectAfterAuth = async (
  user: User,
  router: ReturnType<typeof useRouter>,
) => {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    router.replace("/profile/edit");
  } else {
    const data = snapshot.data();
    const isProfileComplete =
      data.name && data.fieldOfStudy?.length > 0 && data.location?.length > 0;

    if (!isProfileComplete) {
      router.replace("/profile/edit");
    } else {
      router.replace("/dashboard");
    }
  }
};
