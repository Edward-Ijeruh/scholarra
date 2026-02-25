"use client";

import { GraduationCap, Bookmark, Clock, CheckCircle } from "lucide-react";
import ProfileProgress from "@/components/dashboard/ProfileProgress";
import StatsCard from "@/components/dashboard/StatsCard";
import ScholarshipCard from "@/components/dashboard/ScholarshipCard";
import DeadlineItem from "@/components/dashboard/DeadlineItem";

export default function DashboardPage() {
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

      {/*Profile Progress */}
      <ProfileProgress percent={80} />

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Recommended" value={12} icon={GraduationCap} />
        <StatsCard title="Saved" value={5} icon={Bookmark} />
        <StatsCard title="Upcoming Deadlines" value={3} icon={Clock} />
        <StatsCard title="Applications Sent" value={2} icon={CheckCircle} />
      </section>

      {/* Main content*/}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scholarships */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Scholarships you may like
          </h2>

          <ScholarshipCard />
          <ScholarshipCard />
          <ScholarshipCard />
        </div>

        {/* Deadlines */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming deadlines
          </h2>

          <DeadlineItem />
          <DeadlineItem />
          <DeadlineItem />
        </div>
      </section>
    </div>
  );
}
