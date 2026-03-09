import { Scholarship } from "@/types/scholarship";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Timestamp } from "firebase/firestore";
import clsx from "clsx";

export default function DeadlineItem({
  scholarship,
}: {
  scholarship: Scholarship;
}) {
  const deadlineDate =
    scholarship.deadline instanceof Timestamp
      ? scholarship.deadline.toDate()
      : new Date(scholarship.deadline);

  const deadline = getDeadlineInfo(deadlineDate);

  return (
    <div className="group flex items-center justify-between gap-4 bg-white border border-[#e6e2f0] rounded-xl p-4 hover:shadow-sm transition">
      {/* Left */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {scholarship.title}
        </p>

        <p
          className={clsx(
            "text-xs mt-1",
            deadline.urgency === "urgent" && "text-red-500 font-medium",
            deadline.urgency === "closed" && "text-gray-400",
            deadline.urgency === "normal" && "text-gray-500",
          )}
        >
          {deadline.label}
        </p>
      </div>

      {/* Right */}
      {deadline.urgency !== "normal" && (
        <span
          className={clsx(
            "shrink-0 text-xs font-medium px-2.5 py-1 rounded-full",
            deadline.urgency === "urgent" && "bg-red-50 text-red-600",
            deadline.urgency === "closed" && "bg-gray-100 text-gray-500",
          )}
        >
          {deadline.urgency === "urgent" && "Urgent"}
          {deadline.urgency === "closed" && "Closed"}
        </span>
      )}
    </div>
  );
}
