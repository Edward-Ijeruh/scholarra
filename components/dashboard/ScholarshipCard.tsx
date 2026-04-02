import { useState } from "react";
import Link from "next/link";
import { Scholarship } from "@/types/scholarship";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Timestamp } from "firebase/firestore";
import {
  Loader2,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  BookmarkX,
} from "lucide-react";
import clsx from "clsx";

export default function ScholarshipCard({
  scholarship,
  onUnsave,
  applicationId,
}: {
  scholarship: Scholarship & { appliedAt?: Timestamp };
  onUnsave?: () => Promise<void>;
  applicationId?: string;
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
    <div className="group bg-white border border-[#e6e2f0] rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-[2px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 leading-snug text-sm md:text-base group-hover:text-[#8f6cd0] transition">
          {scholarship.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {scholarship.popularityScore && (
            <span className="text-xs font-medium bg-[#f4f0fb] text-[#8f6cd0] px-2 py-1 rounded-full">
              🔥 Popular
            </span>
          )}
        </div>
      </div>

      {/* Meta info */}
      <div className="mt-3 space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Tag size={14} />
          <span className="truncate">
            {scholarship.tags.slice(0, 3).join(" · ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>{scholarship.location.join(", ")}</span>
        </div>

        {scholarship.appliedAt && (
          <p className="text-xs text-green-600 font-medium">
            {formatAppliedDate(scholarship.appliedAt)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        {/* Deadline badge */}
        <span
          className={clsx(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
            deadline.urgency === "urgent" && "bg-red-50 text-red-600",
            deadline.urgency === "normal" && "bg-gray-100 text-gray-600",
          )}
        >
          <Clock size={13} />
          {deadline.label}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onUnsave && (
            <button
              onClick={handleUnsave}
              disabled={unsaving}
              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {unsaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <BookmarkX size={14} />
                  Unsave
                </>
              )}
            </button>
          )}

          <Link
            href={`/scholarships/${scholarship.id}`}
            scroll={false}
            className="flex items-center gap-1 text-sm font-medium text-[#8f6cd0] hover:underline transition"
          >
            View
            <ArrowRight size={15} />
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
