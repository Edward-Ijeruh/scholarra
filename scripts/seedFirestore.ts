import { adminDb } from "../lib/firebase/firebaseAdmin.ts";
import { Timestamp } from "firebase-admin/firestore";

const Netlify_url = process.env.NETLIFY_URL;

async function notifyNewScholarship(scholarship: any) {
  try {
    await fetch(`${Netlify_url}/.netlify/functions/new-scholarship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scholarshipId: scholarship.id,
      }),
    });
  } catch (err) {
    console.error("Failed to trigger email:", err);
  }
}

async function seedScholarships() {
  const scholarships = [
    {
      id: "chevening-scholarship-uk",
      title: "Chevening Scholarship (UK Government)",
      description:
        "Chevening Scholarships are fully funded awards for outstanding emerging leaders to pursue a one-year master’s degree in the UK.",
      eligibility:
        "Applicants from eligible countries with leadership potential, strong academic background, and at least two years of work experience.",
      fieldOfStudy: ["Any"],
      location: ["UK"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-11-05")),
      applicationOpen: Timestamp.fromDate(new Date("2026-08-01")),
      sourceURL: "https://www.chevening.org/",
      tags: ["UK", "Leadership", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 99,
    },

    {
      id: "daad-epos-scholarship",
      title: "DAAD EPOS Scholarship (Germany)",
      description:
        "The DAAD EPOS program provides fully funded scholarships for professionals from developing countries to pursue postgraduate degrees in Germany.",
      eligibility:
        "Graduates with at least two years of professional experience applying to development-related programs.",
      fieldOfStudy: ["Engineering", "Economics", "Public Policy"],
      location: ["Germany"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-10-31")),
      applicationOpen: Timestamp.fromDate(new Date("2026-08-01")),
      sourceURL: "https://www.daad.de/en/",
      tags: ["Germany", "Development", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 96,
    },

    {
      id: "fulbright-foreign-student-program",
      title: "Fulbright Foreign Student Program",
      description:
        "The Fulbright Program provides fully funded scholarships for international students to study in the United States.",
      eligibility:
        "International students with strong academic records and leadership potential applying for postgraduate study.",
      fieldOfStudy: ["Any"],
      location: ["USA"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-05-30")),
      applicationOpen: Timestamp.fromDate(new Date("2026-02-01")),
      sourceURL: "https://foreign.fulbrightonline.org/",
      tags: ["USA", "Prestigious", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 100,
    },

    {
      id: "commonwealth-shared-scholarship",
      title: "Commonwealth Shared Scholarship",
      description:
        "The Commonwealth Shared Scholarship offers full funding for students from developing countries to study in the UK.",
      eligibility:
        "Citizens of developing Commonwealth countries applying for eligible UK master's programs.",
      fieldOfStudy: ["Development", "Engineering", "Health"],
      location: ["UK"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-12-15")),
      applicationOpen: Timestamp.fromDate(new Date("2026-10-01")),
      sourceURL: "https://cscuk.fcdo.gov.uk/",
      tags: ["UK", "Commonwealth", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 94,
    },

    {
      id: "australia-awards-scholarship",
      title: "Australia Awards Scholarship",
      description:
        "Australia Awards Scholarships provide full funding for students from developing countries to study in Australia.",
      eligibility:
        "Citizens of eligible countries with leadership potential applying for development-related fields.",
      fieldOfStudy: ["Engineering", "Health", "Public Policy"],
      location: ["Australia"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-04-30")),
      applicationOpen: Timestamp.fromDate(new Date("2026-02-01")),
      sourceURL: "https://www.dfat.gov.au/",
      tags: ["Australia", "Government", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 97,
    },

    {
      id: "schwarzman-scholars",
      title: "Schwarzman Scholars Program",
      description:
        "Schwarzman Scholars is a fully funded master's program in China focused on leadership and global affairs.",
      eligibility:
        "Applicants worldwide with strong leadership potential and academic excellence.",
      fieldOfStudy: ["Public Policy", "Economics", "International Relations"],
      location: ["China"],
      degreeLevel: ["Postgraduate"],
      fundingType: "full",
      deadline: Timestamp.fromDate(new Date("2026-09-20")),
      applicationOpen: Timestamp.fromDate(new Date("2026-04-01")),
      sourceURL: "https://www.schwarzmanscholars.org/",
      tags: ["China", "Leadership", "Fully Funded"],
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: "adminUser123",
      popularityScore: 98,
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
