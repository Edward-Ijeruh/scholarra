"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import ScholarshipCard from "@/components/dashboard/ScholarshipCard";
import CustomSelect from "@/components/ui/CustomSelect";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { transformScholarship } from "@/lib/scholarships/transformScholarship";
import { Scholarship } from "@/types/scholarship";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

type AppliedScholarship = {
  id: string;
  appliedAt?: Timestamp;
};

export default function ApplicationsPage() {
  const [scholarships, setScholarships] = useState<
    (Scholarship & { appliedAt?: Timestamp })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [field, setField] = useState("all");
  const [urgency, setUrgency] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const applied: AppliedScholarship[] =
        userSnap.data().appliedScholarships || [];

      if (applied.length === 0) {
        setLoading(false);
        return;
      }

      const results: (Scholarship & { appliedAt?: Timestamp })[] = [];

      for (const item of applied) {
        if (!item?.id) continue;

        const ref = doc(db, "scholarships", item.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const raw = {
            id: snap.id,
            ...snap.data(),
          };

          const transformed = transformScholarship(raw as any);

          results.push({
            ...transformed,
            appliedAt: item.appliedAt,
          });
        }
      }

      setScholarships(results);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const handleRemoveApplication = async (scholarshipId: string) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);
      const applied = userSnap.data()?.appliedScholarships || [];

      const toRemove = applied.find(
        (a: AppliedScholarship) => a.id === scholarshipId,
      );

      if (!toRemove) return;

      await updateDoc(userRef, {
        appliedScholarships: arrayRemove(toRemove),
      });

      setScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));

      toast.success("Application removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove application");
    }
  };

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
      );
  }, [scholarships, search, field, urgency]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Applications
        </h1>
        <p className="text-sm text-gray-500">
          Scholarships you have applied for.
        </p>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-[#e6e2f0] rounded-xl p-4">
        <input
          type="text"
          placeholder="Search applications…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#8f6cd0]"
        />

        <CustomSelect
          value={field}
          options={fieldOptions}
          onChange={setField}
        />

        <CustomSelect
          value={urgency}
          options={urgencyOptions}
          onChange={setUrgency}
        />

        <div className="flex items-center text-sm text-gray-500">
          {visibleScholarships.length} results
        </div>
      </div>

      {loading && (
        <p className="flex items-center justify-center pt-4 text-gray-500">
          Loading…
        </p>
      )}

      {!loading && scholarships.length === 0 && (
        <div className="border border-dashed rounded-xl p-10 text-center text-sm text-gray-500">
          You haven't applied to any scholarships yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleScholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
}
