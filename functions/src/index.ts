import { onSchedule } from "firebase-functions/v2/scheduler";
import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export const deactivateExpiredScholarships = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "Africa/Lagos",
  },
  async () => {
    const now = Timestamp.now();

    const snap = await adminDb
      .collection("scholarships")
      .where("isActive", "==", true)
      .get();

    const batch = adminDb.batch();

    snap.docs.forEach((doc) => {
      const deadline = doc.get("deadline") as FirebaseFirestore.Timestamp;

      if (deadline.toMillis() < now.toMillis()) {
        batch.update(doc.ref, { isActive: false });
      }
    });

    await batch.commit();
    console.log("Expired scholarships deactivated");
  },
);
