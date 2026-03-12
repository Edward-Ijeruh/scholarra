"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Scholarship } from "@/types/scholarship";
import { auth } from "@/lib/firebase/firebase";
import { toast } from "react-toastify";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { transformScholarship } from "@/lib/scholarships/transformScholarship";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function ScholarshipDetailsPage() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      const ref = doc(db, "scholarships", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const rawData = {
          id: snap.id,
          ...snap.data(),
        };

        const transformed = transformScholarship(rawData as any);
        setScholarship(transformed);

        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const saved = userSnap.data().savedScholarships || [];
            const applied = userSnap.data().appliedScholarships || [];

            const alreadyApplied = applied.some(
              (a: { id: string }) => a.id === snap.id,
            );

            if (alreadyApplied) {
              setHasApplied(true);
            }

            if (saved.includes(snap.id)) {
              setIsSaved(true);
            }
          }
        }
      }

      setLoading(false);
    };

    fetchScholarship();
  }, [id]);

  const deadlineDate = useMemo(() => {
    if (!scholarship) return null;
    return scholarship.deadline;
  }, [scholarship]);

  const deadlineInfo = useMemo(() => {
    if (!deadlineDate) return null;
    return getDeadlineInfo(deadlineDate);
  }, [deadlineDate]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/scholarships");
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !scholarship) {
        toast.error("You must be logged in");
        return;
      }

      setSaving(true);

      const userRef = doc(db, "users", user.uid);

      if (isSaved) {
        await updateDoc(userRef, {
          savedScholarships: arrayRemove(scholarship.id),
        });

        setIsSaved(false);
        toast.success("Removed from saved");
      } else {
        await updateDoc(userRef, {
          savedScholarships: arrayUnion(scholarship.id),
        });

        setIsSaved(true);
        toast.success("Scholarship saved");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update saved scholarships");
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !scholarship) {
        toast.error("You must be logged in");
        return;
      }

      setApplying(true);

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        appliedScholarships: arrayUnion({
          id: scholarship.id,
          appliedAt: Timestamp.now(),
        }),
      });

      window.open(scholarship.sourceURL, "_blank");
      setHasApplied(true);

      toast.success("Application tracked");
    } catch (error) {
      console.error(error);
      toast.error("Failed to track application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 space-y-8">
          {/* Back button */}
          <div className="h-4 w-16 bg-gray-200 rounded"></div>

          {/* Header */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>

            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>

              <div className="hidden sm:block h-4 w-px bg-gray-200"></div>

              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-20 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Overview card */}
          <div className="bg-white border border-[#e6e2f0] rounded-xl p-6 space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Eligibility card */}
          <div className="bg-white border border-[#e6e2f0] rounded-xl p-6 space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Details grid */}
          <div className="bg-white border border-[#e6e2f0] rounded-xl p-6 space-y-4">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="sticky top-24 bg-white border border-[#e6e2f0] rounded-xl p-6 space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </aside>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <p className="flex items-center justify-center pt-10 text-gray-500">
        Scholarship not found.
      </p>
    );
  }

  if (!deadlineInfo) {
    return (
      <p className="flex items-center justify-center pt-10 text-gray-500">
        Deadline info unavailable.
      </p>
    );
  }

  const deadlineClasses = clsx(
    "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full",
    deadlineInfo?.urgency === "urgent" && "bg-red-50 text-red-600",
    deadlineInfo?.urgency === "normal" && "bg-gray-100 text-gray-600",
    deadlineInfo?.urgency === "closed" && "bg-gray-200 text-gray-500",
  );

  const isClosed = deadlineInfo?.urgency === "closed";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-sm text-[#8f6cd0] hover:underline cursor-pointer w-fit"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            {scholarship.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Deadline */}
            <span className={deadlineClasses}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {deadlineInfo.label}
            </span>

            {/* Divider */}
            <span className="hidden sm:inline-block h-4 w-px bg-gray-200" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {scholarship.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-[#e6e2f0] text-gray-700 bg-white hover:bg-[#f9f7fd] transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Description */}
        <section className="bg-white border border-[#e6e2f0] rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-3">Overview</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {scholarship.description}
          </p>
        </section>

        {/* Eligibility */}
        <section className="bg-white border border-[#e6e2f0] rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-3">Eligibility</h2>
          <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
        </section>

        {/* Details grid */}
        <section className="bg-white border border-[#e6e2f0] rounded-xl p-6">
          <h2 className="font-medium text-gray-900 mb-4">
            Scholarship Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail
              label="Field of study"
              value={scholarship.fieldOfStudy.join(", ")}
            />
            <Detail
              label="Degree level"
              value={scholarship.degreeLevel.join(", ")}
            />
            <Detail label="Location" value={scholarship.location.join(", ")} />
            <Detail
              label="Funding"
              value={
                scholarship.fundingType === "full"
                  ? "Fully funded"
                  : "Partially funded"
              }
            />
            <Detail
              label="Application opens"
              value={
                scholarship.applicationOpen
                  ? scholarship.applicationOpen.toLocaleDateString()
                  : "—"
              }
            />

            <Detail
              label="Deadline"
              value={deadlineDate ? deadlineDate.toLocaleDateString() : "—"}
            />
          </div>
        </section>
      </div>

      {/* Action sidebar */}
      <aside className="space-y-4">
        <div className="sticky top-24 bg-white border border-[#e6e2f0] rounded-xl p-6 space-y-4">
          {hasApplied && (
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-green-600 text-xs font-bold">
                ✓
              </span>

              <div className="text-sm">
                <p className="font-medium text-green-700">
                  Track your Application
                </p>
                <p className="text-green-600 text-xs">
                  You applied for this scholarship.
                </p>
              </div>
            </div>
          )}
          {!hasApplied && (
            <button
              onClick={handleApply}
              disabled={isClosed || applying}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer ${
                isClosed
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#7c5bc6] text-white hover:bg-[#8f6cd0]"
              }`}
            >
              {applying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply on official site"
              )}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition cursor-pointer ${
              saving
                ? "bg-gray-100 text-gray-400"
                : isSaved
                  ? "bg-[#f3effa] border-[#8f6cd0] text-[#8f6cd0]"
                  : "border-[#8f6cd0] text-[#8f6cd0] hover:bg-[#f3effa]"
            }`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              "Saved"
            ) : (
              "Save for later"
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}
