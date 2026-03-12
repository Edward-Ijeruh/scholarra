import { adminDb } from "../lib/firebase/firebaseAdmin.ts";
import { Timestamp } from "firebase-admin/firestore";

async function seedScholarships() {
  const scholarships = [
    {
      id: "google-generation-scholarship-emea",
      title: "Generation Google Scholarship (EMEA)",
      description:
        "Google's Generation Scholarship supports students pursuing degrees in computer science and related fields across Europe, the Middle East, and Africa.",
      eligibility:
        "Students studying Computer Science or related fields with strong academic performance and leadership potential.",
      fieldOfStudy: ["Computer Science", "Engineering"],
      location: ["Africa", "Worldwide"],
      degreeLevel: ["Undergraduate", "Postgraduate"],
      fundingType: "partial",
      deadline: Timestamp.fromDate(new Date("2026-04-23")),
      applicationOpen: Timestamp.fromDate(new Date("2026-02-01")),
      sourceURL: "https://buildyourfuture.withgoogle.com/scholarships",
      tags: ["Tech", "Google", "STEM"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 90,
    },

    {
      id: "gates-cambridge-scholarship",
      title: "Gates Cambridge Scholarship",
      description:
        "The Gates Cambridge Scholarship provides full funding for outstanding international students to pursue postgraduate study at the University of Cambridge.",
      eligibility:
        "International applicants with outstanding academic achievement and leadership potential applying to Cambridge postgraduate programs.",
      fieldOfStudy: ["Any"],
      location: ["Worldwide"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-10-15")),
      applicationOpen: Timestamp.fromDate(new Date("2026-09-01")),
      sourceURL: "https://www.gatescambridge.org/",
      tags: ["UK", "Cambridge", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 98,
    },

    {
      id: "erasmus-mundus-joint-masters",
      title: "Erasmus Mundus Joint Masters Scholarship",
      description:
        "The Erasmus Mundus Joint Masters program offers fully funded scholarships for international students to study in multiple European universities.",
      eligibility:
        "Students worldwide with a bachelor’s degree applying for Erasmus Mundus master’s programs.",
      fieldOfStudy: [
        "Engineering",
        "Computer Science",
        "Environmental Science",
      ],
      location: ["Worldwide"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-12-31")),
      applicationOpen: Timestamp.fromDate(new Date("2026-09-01")),
      sourceURL: "https://erasmus-plus.ec.europa.eu/",
      tags: ["Europe", "Masters", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 97,
    },

    {
      id: "afdb-japan-africa-dream",
      title: "Japan Africa Dream Scholarship (JADS)",
      description:
        "The Japan Africa Dream Scholarship provides funding for African students pursuing postgraduate study in development-related fields.",
      eligibility:
        "Citizens of African countries with professional experience applying for development-related master's programs.",
      fieldOfStudy: ["Engineering", "Development Studies", "Economics"],
      location: ["Africa", "Worldwide"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-06-30")),
      applicationOpen: Timestamp.fromDate(new Date("2026-03-01")),
      sourceURL: "https://www.afdb.org/",
      tags: ["Africa", "Development", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 85,
    },

    {
      id: "mtn-foundation-scholarship-2026",
      title: "MTN Foundation Scholarship Scheme",
      description:
        "MTN Foundation offers scholarships to high-performing STEM students in Nigerian public universities.",
      eligibility:
        "Undergraduate students in Nigerian universities studying STEM courses with strong academic records.",
      fieldOfStudy: ["Engineering", "Computer Science", "Science"],
      location: ["Nigeria"],
      degreeLevel: ["Undergraduate"],
      fundingType: "partial",
      deadline: Timestamp.fromDate(new Date("2026-07-15")),
      applicationOpen: Timestamp.fromDate(new Date("2026-05-01")),
      sourceURL: "https://www.mtnonline.com/foundation/",
      tags: ["Nigeria", "STEM"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 80,
    },

    {
      id: "mastercard-foundation-scholars-africa",
      title: "Mastercard Foundation Scholars Program",
      description:
        "The Mastercard Foundation Scholars Program provides full scholarships for African students with leadership potential and financial need.",
      eligibility:
        "African students with strong academic results, leadership potential, and financial need.",
      fieldOfStudy: ["Computer Science", "Engineering", "Business", "Health"],
      location: ["Africa"],
      degreeLevel: ["Undergraduate", "Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-11-30")),
      applicationOpen: Timestamp.fromDate(new Date("2026-08-01")),
      sourceURL: "https://mastercardfdn.org/scholars/",
      tags: ["Africa", "Leadership", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 95,
    },
  ];

  for (const scholarship of scholarships) {
    await adminDb
      .collection("scholarships")
      .doc(scholarship.id)
      .set(scholarship);
    console.log("Scholarship seeded:", scholarship.id);
  }
}

// Run all
async function seedAll() {
  await seedScholarships();
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
