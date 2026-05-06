import { sendEmail } from "./sendEmail";
import AppliedScholarshipEmail from "@/emails/AppliedScholarshipEmail";
import { UserProfile } from "@/types/user";
import { Scholarship } from "@/types/scholarship";

export async function notifyApplied(
  user: UserProfile,
  scholarship: Scholarship,
) {
  if (!user.notificationPrefs.email) return;

  return sendEmail({
    to: user.email,
    subject: "Application started 🚀",
    react: (
      <AppliedScholarshipEmail name={user.name} title={scholarship.title} />
    ),
  });
}
