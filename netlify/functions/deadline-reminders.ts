import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { notifyDeadline } from "@/lib/notifications/notifyDeadline";
import { transformScholarship } from "@/lib/scholarships/transformScholarship";
import { FirestoreScholarship } from "@/types/scholarship";

export async function GET() {
  try {
    const usersSnap = await adminDb.collection("users").get();
    const scholarshipsSnap = await adminDb.collection("scholarships").get();

    const now = new Date();
    const promises: Promise<any>[] = [];

    scholarshipsSnap.forEach((schDoc) => {
      const raw = {
        id: schDoc.id,
        ...schDoc.data(),
      } as FirestoreScholarship;

      const scholarship = transformScholarship(raw);

      const deadline = scholarship.deadline;
      const diff = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      const daysLeft = Math.ceil(diff);

      if (daysLeft === 3 || daysLeft === 1) {
        usersSnap.forEach((userDoc) => {
          const user = userDoc.data();
          promises.push(notifyDeadline(user as any, scholarship, daysLeft));
        });
      }
    });

    await Promise.all(promises);

    return Response.json({ success: true });
  } catch (error) {
    console.error("DEADLINE NOTIFICATION ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
