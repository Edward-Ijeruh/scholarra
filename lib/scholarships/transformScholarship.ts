import { FirestoreScholarship, Scholarship } from "@/types/scholarship";

export function transformScholarship(data: FirestoreScholarship): Scholarship {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    eligibility: data.eligibility,
    fieldOfStudy: data.fieldOfStudy,
    location: data.location,
    degreeLevel: data.degreeLevel,
    fundingType: data.fundingType,
    sourceURL: data.sourceURL,
    tags: data.tags,
    isActive: data.isActive,
    createdBy: data.createdBy,
    popularityScore: data.popularityScore,
    deadline: data.deadline.toDate(),
    applicationOpen: data.applicationOpen
      ? data.applicationOpen.toDate()
      : null,
    createdAt: data.createdAt.toDate(),
  };
}
