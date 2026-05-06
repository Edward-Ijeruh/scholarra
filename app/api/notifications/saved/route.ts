import { adminDb } from "@/lib/firebase/firebaseAdmin";
import { notifySaved } from "@/lib/notifications/notifySaved";
import { transformScholarship } from "@/lib/scholarships/transformScholarship";
import { FirestoreScholarship } from "@/types/scholarship";

export async function POST(req: Request) {
  try {
    const { userId, scholarshipId } = await req.json();

    const userSnap = await adminDb.doc(`users/${userId}`).get();
    const scholarshipSnap = await adminDb
      .doc(`scholarships/${scholarshipId}`)
      .get();

    if (!userSnap.exists || !scholarshipSnap.exists) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const user = userSnap.data();

    const rawScholarship = {
      id: scholarshipSnap.id,
      ...scholarshipSnap.data(),
    } as FirestoreScholarship;

    const scholarship = transformScholarship(rawScholarship);

    await notifySaved(user as any, scholarship);

    return Response.json({ success: true });
  } catch (error) {
    console.error("SAVED NOTIFICATION ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
