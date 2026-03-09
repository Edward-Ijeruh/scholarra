"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Bookmark, Clock, CheckCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import StatsCard from "@/components/dashboard/StatsCard";
import ScholarshipCard from "@/components/dashboard/ScholarshipCard";
import DeadlineItem from "@/components/dashboard/DeadlineItem";
import { getActiveScholarships } from "@/lib/scholarships/getScholarships";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Scholarship } from "@/types/scholarship";
import { Timestamp } from "firebase/firestore";

export default function DashboardPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedCount, setSavedCount] = useState(0);
  const [applicationsSent, setApplicationsSent] = useState(0);

  const [userFields, setUserFields] = useState<string[]>([]);
  const [userLocations, setUserLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scholarshipsData = await getActiveScholarships();
        setScholarships(scholarshipsData);

        const user = auth.currentUser;

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            const saved = userData.savedScholarships || [];
            const applied = userData.appliedScholarships || [];

            setSavedCount(saved.filter(Boolean).length);
            setApplicationsSent(applied.filter(Boolean).length);

            setUserFields(userData.fieldOfStudy || []);
            setUserLocations(userData.location || []);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const openScholarships = scholarships.filter((s) => {
    const deadline =
      s.deadline instanceof Timestamp
        ? s.deadline.toDate()
        : new Date(s.deadline);

    return getDeadlineInfo(deadline).urgency !== "closed";
  });

  const personalizedScholarships = openScholarships
    .map((s) => {
      let score = s.popularityScore ?? 0;

      if (s.fieldOfStudy?.some((field) => userFields.includes(field))) {
        score += 50;
      }

      if (s.location?.some((loc) => userLocations.includes(loc))) {
        score += 30;
      }

      return { ...s, score };
    })
    .sort((a, b) => b.score - a.score);

  const recommendedCount = personalizedScholarships.length;

  const upcomingDeadlinesCount = scholarships.filter((s) => {
    const deadline =
      s.deadline instanceof Timestamp
        ? s.deadline.toDate()
        : new Date(s.deadline);

    return getDeadlineInfo(deadline).daysLeft > 0;
  }).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <section>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here’s what’s happening with your scholarships today.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Recommended"
          value={recommendedCount}
          icon={GraduationCap}
        />

        <StatsCard title="Saved" value={savedCount} icon={Bookmark} />

        <StatsCard
          title="Upcoming Deadlines"
          value={upcomingDeadlinesCount}
          icon={Clock}
        />

        <StatsCard
          title="Applications Sent"
          value={applicationsSent}
          icon={CheckCircle}
        />
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Scholarships */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Scholarships recommended for you
          </h2>

          {loading && (
            <p className="text-sm text-gray-500">Loading scholarships…</p>
          )}

          {!loading && personalizedScholarships.length === 0 && (
            <p className="text-sm text-gray-500">
              No scholarships available yet.
            </p>
          )}

          {!loading &&
            personalizedScholarships
              .slice(0, 3)
              .map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                />
              ))}
        </div>

        {/* Deadlines */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming deadlines
          </h2>

          {loading && (
            <p className="text-sm text-gray-500">Loading deadlines…</p>
          )}

          {!loading &&
            scholarships
              .filter((s) => {
                const deadline =
                  s.deadline instanceof Timestamp
                    ? s.deadline.toDate()
                    : new Date(s.deadline);

                return getDeadlineInfo(deadline).daysLeft > 0;
              })
              .slice(0, 3)
              .map((scholarship) => (
                <DeadlineItem key={scholarship.id} scholarship={scholarship} />
              ))}
        </div>
      </section>
    </div>
  );
}
