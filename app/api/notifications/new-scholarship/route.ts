// import { adminDb } from "@/lib/firebase/firebaseAdmin";
// // import { notifyNewScholarship } from "@/lib/notifications/notifyNewScholarship";

// export async function POST(req: Request) {
//   try {
//     const { scholarship } = await req.json();

//     const usersSnap = await adminDb.collection("users").get();

//     const promises: Promise<any>[] = [];

//     usersSnap.forEach((doc) => {
//       const user = doc.data();
//       promises.push(notifyNewScholarship(user as any, scholarship));
//     });

//     await Promise.all(promises);

//     return Response.json({ success: true });
//   } catch (error) {
//     console.error("NEW SCHOLARSHIP NOTIFICATION ERROR:", error);
//     return Response.json({ error: "Server error" }, { status: 500 });
//   }
// }
