import { adminDb } from "../../lib/firebase/firebaseAdmin";
import { sendEmail } from "../../lib/notifications/sendEmail";
import { WeeklyScholarshipsEmail } from "../../emails/WeeklyScholarshipsEmail";
import { transformScholarship } from "../../lib/scholarships/transformScholarship";
import { success } from "zod";

export default async () => {
  try {
    const usersSnap = await adminDb.collection("users").get();

    const scholarshipsSnap = await adminDb
      .collection("scholarships")
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const scholarships = scholarshipsSnap.docs.map((doc) =>
      transformScholarship({
        id: doc.id,
        ...doc.data(),
      } as any),
    );

    const promises: Promise<any>[] = [];

    usersSnap.forEach((userDoc) => {
      const user = userDoc.data();

      if (!user.notificationPrefs?.email) return;

      promises.push(
        sendEmail({
          to: user.email,
          subject: "5 Scholarships You Should Apply For This Week",
          react: WeeklyScholarshipsEmail({
            name: user.name,
            scholarships,
          }),
        }),
      );
    });

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Weekly email error:", error);

    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
