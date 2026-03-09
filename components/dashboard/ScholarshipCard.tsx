import { useState } from "react";
import Link from "next/link";
import { Scholarship } from "@/types/scholarship";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Timestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function ScholarshipCard({
  scholarship,
  onUnsave,
}: {
  scholarship: Scholarship & { appliedAt?: Timestamp };
  onUnsave?: () => Promise<void>;
}) {
  const deadlineDate =
    scholarship.deadline instanceof Timestamp
      ? scholarship.deadline.toDate()
      : new Date(scholarship.deadline);

  const deadline = getDeadlineInfo(deadlineDate);
  const [unsaving, setUnsaving] = useState(false);

  const handleUnsave = async () => {
    try {
      setUnsaving(true);
      await onUnsave?.();
    } finally {
      setUnsaving(false);
    }
  };

  return (
    <div className="group bg-white border border-[#e6e2f0] rounded-xl p-5 transition hover:shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-medium text-gray-900 leading-snug">
          {scholarship.title}
        </h3>

        {scholarship.popularityScore && (
          <span className="shrink-0 text-xs font-medium bg-[#f4f0fb] text-[#8f6cd0] px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-500">
          {scholarship.tags.slice(0, 3).join(" · ")} ·{" "}
          {scholarship.location.join(", ")}
        </p>

        {scholarship.appliedAt && (
          <p className="text-xs text-gray-400">
            {formatAppliedDate(scholarship.appliedAt)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span
          className={clsx(
            "text-xs font-medium",
            deadline.urgency === "urgent" && "text-red-500",
            deadline.urgency === "normal" && "text-gray-500",
          )}
        >
          {deadline.label}
        </span>

        <div className="flex items-center gap-3">
          {onUnsave && (
            <button
              onClick={handleUnsave}
              disabled={unsaving}
              className="flex items-center justify-center min-w-[60px] text-xs font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {unsaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Unsave"
              )}
            </button>
          )}
          <Link
            href={`/scholarships/${scholarship.id}`}
            className="text-sm font-medium text-[#8f6cd0] hover:underline"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatAppliedDate(ts?: Timestamp) {
  if (!ts) return "";

  const date = ts.toDate();
  const diff = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff === 0) return "Applied today";
  if (diff === 1) return "Applied yesterday";

  return `Applied ${diff} days ago`;
}
