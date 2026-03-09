export function getDeadlineInfo(deadline: Date | string) {
  const now = new Date();
  const end = typeof deadline === "string" ? new Date(deadline) : deadline;

  const diffMs = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0)
    return {
      label: "Deadline passed",
      daysLeft: 0,
      urgency: "closed" as const,
    };
  if (daysLeft <= 7)
    return {
      label: `Closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
      daysLeft,
      urgency: "urgent" as const,
    };
  return {
    label: `Closes in ${daysLeft} days`,
    daysLeft,
    urgency: "normal" as const,
  };
}
