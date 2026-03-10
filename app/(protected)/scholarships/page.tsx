"use client";

import { useEffect, useMemo, useState } from "react";
import ScholarshipCard from "@/components/dashboard/ScholarshipCard";
import CustomSelect from "@/components/ui/CustomSelect";
import { getActiveScholarships } from "@/lib/scholarships/getScholarships";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Scholarship } from "@/types/scholarship";
import { Timestamp } from "firebase/firestore";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [field, setField] = useState("all");
  const [urgency, setUrgency] = useState("all");

  useEffect(() => {
    getActiveScholarships().then((data) => {
      setScholarships(data);
      setLoading(false);
    });
  }, []);

  // derive filter options from real data
  const fieldOptions = useMemo(() => {
    const fields = new Set<string>();
    scholarships.forEach((s) => s.fieldOfStudy.forEach((f) => fields.add(f)));
    return [
      { label: "All fields", value: "all" },
      ...Array.from(fields).map((f) => ({ label: f, value: f })),
    ];
  }, [scholarships]);

  const urgencyOptions = [
    { label: "All deadlines", value: "all" },
    { label: "Urgent", value: "urgent" },
    { label: "Open", value: "normal" },
    { label: "Closed", value: "closed" },
  ];

  const visibleScholarships = useMemo(() => {
    return scholarships
      .map((s) => {
        const deadlineDate =
          s.deadline instanceof Timestamp
            ? s.deadline.toDate()
            : new Date(s.deadline);

        const deadlineInfo = getDeadlineInfo(deadlineDate);

        return { ...s, deadlineInfo };
      })
      .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => (field === "all" ? true : s.fieldOfStudy.includes(field)))
      .filter((s) =>
        urgency === "all" ? true : s.deadlineInfo.urgency === urgency,
      )
      .sort((a, b) => {
        const rank = (urgency: string) => {
          if (urgency === "urgent") return 0;
          if (urgency === "normal") return 1;
          if (urgency === "closed") return 2;
          return 3;
        };

        const urgencyDiff =
          rank(a.deadlineInfo.urgency) - rank(b.deadlineInfo.urgency);

        if (urgencyDiff !== 0) return urgencyDiff;

        return (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
      });
  }, [scholarships, search, field, urgency]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Scholarships</h1>
        <p className="text-sm text-gray-500">
          Explore popular and verified scholarships worldwide.
        </p>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#e6e2f0] rounded-xl p-4">
        <input
          type="text"
          placeholder="Search scholarships…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#8f6cd0]"
        />

        <CustomSelect
          value={field}
          options={fieldOptions}
          onChange={setField}
          placeholder="Field of study"
        />

        <CustomSelect
          value={urgency}
          options={urgencyOptions}
          onChange={setUrgency}
          placeholder="Deadline status"
        />

        <div className="flex items-center text-sm text-gray-500">
          {visibleScholarships.length} results
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e6e2f0] rounded-xl p-5 space-y-4 animate-pulse"
            >
              {/* Title */}
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && visibleScholarships.length === 0 && (
        <div className="border border-dashed rounded-xl p-8 text-center text-sm text-gray-500">
          No scholarships match your filters.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {visibleScholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
}
