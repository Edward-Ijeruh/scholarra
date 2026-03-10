"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "@/types/user";
import Link from "next/link";
import {
  User,
  Mail,
  GraduationCap,
  MapPin,
  Bell,
  Calendar,
  Pencil,
  LucideIcon,
} from "lucide-react";

export default function ProfilePage() {
  const [user, loadingUser] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Skeleton loader
  if (loadingUser || loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        {/* Header*/}
        <div className="rounded-xl bg-white p-6 border border-[#e6e2f0] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>

            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-56 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-[#e6e2f0] p-6 space-y-4"
            >
              {/* Title */}
              <div className="h-4 w-40 bg-gray-200 rounded"></div>

              {/* Rows */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="h-4 w-4 rounded bg-gray-200 mt-1"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header card */}
      <div className="rounded-xl bg-white p-6 border border-[#e6e2f0] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f0fb] text-[#8f6cd0] text-xl font-semibold">
            {initials}
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {profile.name || "Your profile"}
            </h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* Edit button */}
        <Link
          href="/profile/edit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#8f6cd0] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
        >
          <Pencil size={16} />
          Edit profile
        </Link>
      </div>

      {/* Details grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic info */}
        <Card title="Academic information">
          <InfoRow
            icon={GraduationCap}
            label="Field of study"
            value={
              profile.fieldOfStudy.length
                ? profile.fieldOfStudy.join(", ")
                : "Not specified"
            }
          />
          <InfoRow
            icon={MapPin}
            label="Preferred locations"
            value={
              profile.location.length
                ? profile.location.join(", ")
                : "Not specified"
            }
          />
        </Card>

        {/* Notifications */}
        <Card title="Notification preferences">
          <InfoRow
            icon={Bell}
            label="Email notifications"
            value={profile.notificationPrefs.email ? "Enabled" : "Disabled"}
          />
          <InfoRow
            icon={Bell}
            label="Push notifications"
            value={profile.notificationPrefs.push ? "Enabled" : "Disabled"}
          />
        </Card>

        {/* Account info */}
        <Card title="Account">
          <InfoRow icon={Mail} label="Email" value={profile.email} />
          <InfoRow
            icon={User}
            label="Role"
            value={profile.role === "admin" ? "Admin" : "Student"}
          />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={profile.createdAt?.toDate().toLocaleDateString()}
          />
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-[#e6e2f0] p-6">
      <h2 className="mb-4 text-sm font-semibold text-gray-800">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-[#8f6cd0] mt-0.5" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}
