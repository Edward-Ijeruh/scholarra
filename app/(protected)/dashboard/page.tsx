"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Bookmark, Clock, CheckCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import StatsCard from "@/components/dashboard/StatsCard";
import ScholarshipCard from "@/components/dashboard/ScholarshipCard";
import DeadlineItem from "@/components/dashboard/DeadlineItem";
import { getActiveScholarships } from "@/lib/scholarships/getScholarships";
import { getDeadlineInfo } from "@/lib/scholarships/deadline";
import { Scholarship } from "@/types/scholarship";

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
    <div className="space-y-10 max-w-6xl mx-auto pb-10">
      {/* Welcome Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#8f6cd0] to-[#6f4cc2] p-6 md:p-8 text-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-semibold">Welcome back 👋</h1>
        <p className="text-sm md:text-base opacity-90 mt-1">
          Discover scholarships tailored to your goals and stay ahead of
          upcoming deadlines.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Recommended"
          value={recommendedCount}
          icon={GraduationCap}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />

        <StatsCard
          title="Saved"
          value={savedCount}
          icon={Bookmark}
          iconColor="text-[#8f6cd0]"
          iconBg="bg-[#f0ebff]"
        />

        <StatsCard
          title="Upcoming Deadlines"
          value={upcomingDeadlinesCount}
          icon={Clock}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />

        <StatsCard
          title="Applications Sent"
          value={applicationsSent}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
      </section>

      {/* Main Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Scholarships */}
        <div className="lg:col-span-2 bg-white border border-[#eee] rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Recommended for you
            </h2>

            <span className="hidden md:block text-xs text-gray-500">
              Top matches based on your profile
            </span>
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-6">
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

          {!loading && personalizedScholarships.length === 0 && (
            <p className="text-sm text-gray-500">
              No scholarships available yet.
            </p>
          )}

          {!loading && (
            <>
              {/* Mobile scroll */}
              <div className="flex md:hidden gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {personalizedScholarships.slice(0, 5).map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="min-w-[280px] snap-start"
                  >
                    <ScholarshipCard scholarship={scholarship} />
                  </div>
                ))}
              </div>

              {/* Desktop list */}
              <div className="hidden md:block space-y-3">
                {personalizedScholarships.slice(0, 3).map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Deadlines */}
        <div className="bg-white border border-[#eee] rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming deadlines
          </h2>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 bg-white border border-[#e6e2f0] rounded-xl p-4 animate-pulse"
                >
                  {/* Left */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>

                  {/* Right badge */}
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
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
