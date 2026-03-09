import { adminDb } from "../lib/firebase/firebaseAdmin.ts";
import { Timestamp } from "firebase-admin/firestore";

async function seedScholarships() {
  const scholarships = [
    {
      id: "mastercard-foundation-africa",
      title: "Mastercard Foundation Scholars Program",
      description:
        "The Mastercard Foundation Scholars Program provides full scholarships to academically talented young people from Africa with demonstrated leadership potential.",
      eligibility:
        "African citizens with strong academic records, leadership potential, and financial need.",
      fieldOfStudy: ["Computer Science", "Engineering", "Business", "Health"],
      location: ["Africa"],
      degreeLevel: ["Undergraduate", "Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-03-15")),
      applicationOpen: Timestamp.fromDate(new Date("2025-10-01")),
      sourceURL: "https://mastercardfdn.org/scholars/",
      tags: ["Africa", "Fully Funded", "Leadership"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 95,
    },

    {
      id: "chevening-worldwide",
      title: "Chevening Scholarships",
      description:
        "Chevening is the UK government’s global scholarship programme for future leaders to study a one-year master’s degree in the UK.",
      eligibility:
        "Citizens of Chevening-eligible countries with at least two years of work experience.",
      fieldOfStudy: ["Any"],
      location: ["Nigeria", "Ghana", "Kenya", "South Africa", "Worldwide"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2025-11-07")),
      applicationOpen: Timestamp.fromDate(new Date("2025-08-01")),
      sourceURL: "https://www.chevening.org/",
      tags: ["UK", "Masters", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 98,
    },

    {
      id: "commonwealth-shared",
      title: "Commonwealth Shared Scholarship",
      description:
        "Fully funded scholarships for students from developing Commonwealth countries to study selected master’s courses in the UK.",
      eligibility:
        "Citizens of eligible Commonwealth countries with financial need.",
      fieldOfStudy: [
        "Development Studies",
        "Engineering",
        "Health",
        "Technology",
      ],
      location: ["Africa"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-01-10")),
      applicationOpen: Timestamp.fromDate(new Date("2025-09-15")),
      sourceURL: "https://cscuk.fcdo.gov.uk/",
      tags: ["Commonwealth", "UK", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 85,
    },

    {
      id: "daad-epos",
      title: "DAAD EPOS Scholarship",
      description:
        "DAAD EPOS offers postgraduate scholarships for professionals from developing countries to study in Germany.",
      eligibility:
        "Graduates from developing countries with at least two years of work experience.",
      fieldOfStudy: ["Engineering", "Economics", "Environmental Science"],
      location: ["Africa", "Worldwide"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2025-10-31")),
      applicationOpen: Timestamp.fromDate(new Date("2025-06-01")),
      sourceURL: "https://www.daad.de/",
      tags: ["Germany", "Masters", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 88,
    },

    {
      id: "kcb-foundation-kenya",
      title: "KCB Foundation Scholarship Programme",
      description:
        "The KCB Foundation Scholarship supports academically gifted but financially disadvantaged Kenyan students.",
      eligibility:
        "Kenyan students from low-income backgrounds with excellent academic performance.",
      fieldOfStudy: ["Any"],
      location: ["Kenya"],
      degreeLevel: ["Undergraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-02-28")),
      applicationOpen: Timestamp.fromDate(new Date("2025-12-01")),
      sourceURL: "https://kcbgroup.com/foundation/",
      tags: ["Kenya", "Undergraduate", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 70,
    },

    {
      id: "mtn-foundation-scholarship",
      title: "MTN Foundation Scholarship",
      description:
        "MTN Foundation Scholarship provides financial support to outstanding students in Nigerian and Ghanaian public institutions.",
      eligibility:
        "Undergraduates in public universities with strong academic performance.",
      fieldOfStudy: ["Science", "Technology", "Engineering"],
      location: ["Nigeria", "Ghana"],
      degreeLevel: ["Undergraduate"],
      fundingType: "partial",
      deadline: Timestamp.fromDate(new Date("2026-01-31")),
      applicationOpen: Timestamp.fromDate(new Date("2025-09-01")),
      sourceURL: "https://www.mtnonline.com/foundation/",
      tags: ["Nigeria", "Ghana", "STEM"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 75,
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
