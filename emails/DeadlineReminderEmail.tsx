export default function DeadlineReminderEmail({
  name,
  title,
  daysLeft,
  url,
}: {
  name: string;
  title: string;
  daysLeft: number;
  url: string;
}) {
  return (
    <div>
      <p>Hello {name}, don't miss this! ⏳</p>
      <p>
        The deadline for <strong>{title}</strong> is in {daysLeft} day(s).
      </p>
      <a href={url}>Apply Now</a>

      <p>Opportunities don’t wait, take action now.</p>
    </div>
  );
}
