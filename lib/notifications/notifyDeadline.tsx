import { sendEmail } from "./sendEmail";
import DeadlineReminderEmail from "@/emails/DeadlineReminderEmail";
import { UserProfile } from "@/types/user";
import { Scholarship } from "@/types/scholarship";

export async function notifyDeadline(
  user: UserProfile,
  scholarship: Scholarship,
  daysLeft: number,
) {
  if (!user.notificationPrefs.email) return;

  return sendEmail({
    to: user.email,
    subject: `Deadline approaching: ${scholarship.title}`,
    react: (
      <DeadlineReminderEmail
        name={user.name}
        title={scholarship.title}
        daysLeft={daysLeft}
        url={scholarship.sourceURL}
      />
    ),
  });
}
