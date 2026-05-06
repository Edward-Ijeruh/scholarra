import { sendEmail } from "./sendEmail";
import SavedScholarshipEmail from "@/emails/SavedScholarshipEmail";
import { UserProfile } from "@/types/user";
import { Scholarship } from "@/types/scholarship";

export async function notifySaved(user: UserProfile, scholarship: Scholarship) {
  if (!user.notificationPrefs.email) return;

  return sendEmail({
    to: user.email,
    subject: "Scholarship saved 📌",
    react: <SavedScholarshipEmail name={user.name} title={scholarship.title} />,
  });
}
