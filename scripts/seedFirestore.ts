import { adminDb } from "../lib/firebase/firebaseAdmin.ts";
import { Timestamp } from "firebase-admin/firestore";

// Users
async function createUser() {
  const userId = "adminUser123";
  await adminDb
    .collection("users")
    .doc(userId)
    .set({
      name: "Admin User",
      email: "admin@example.com",
      fieldOfStudy: ["Computer Science", "Mathematics"],
      location: "Nigeria",
      notificationPrefs: { email: true, push: true },
      role: "admin",
      createdAt: Timestamp.now(),
    });
  console.log("User created", userId);
}

// Scholarships
async function createScholarship() {
  const docRef = await adminDb.collection("scholarships").add({
    title: "Full Scholarship for Undergraduates",
    description: "Covers tuition, accommodation, and stipend for one year.",
    eligibility: "Undergraduates from African countries",
    fieldOfStudy: ["Computer Science", "Engineering"],
    location: ["Nigeria", "Africa"],
    deadline: Timestamp.fromDate(new Date("2026-03-31")),
    sourceURL: "https://example.com/scholarship",
    tags: ["full", "undergraduate", "STEM"],
    isActive: true,
    createdAt: Timestamp.now(),
    createdBy: "adminUser123",
  });
  console.log("Scholarship created", docRef.id);
  return docRef.id;
}

// Notifications
async function createNotification(scholarshipId: string) {
  const docRef = await adminDb.collection("notifications").add({
    userId: "adminUser123",
    scholarshipId,
    type: "deadline-reminder",
    isSent: false,
    sendAt: Timestamp.fromDate(new Date("2026-03-25")),
    createdAt: Timestamp.now(),
  });
  console.log("Notification created:", docRef.id);
}

// Run all
async function seedAll() {
  await createUser();
  const scholarshipId = await createScholarship();
  await createNotification(scholarshipId);
}

seedAll()
  .then(() => {
    console.log("Firestore seeded successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding Firestore:", err);
    process.exit(1);
  });
