"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

type User = {
  uid: string;
  email?: string | null;
};

export default function Topbar({
  user,
  onMenuClick,
  isMenuOpen,
}: {
  user: User | null;
  onMenuClick: () => void;
  isMenuOpen: boolean;
}) {
  const [profileName, setProfileName] = useState<string | null>(null);

  // Fetch profile name
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setProfileName(data.name ?? null);
      }
    };

    fetchProfile();
  }, [user]);

  const initials =
    profileName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 z-40 w-full h-[70px] bg-white border-b border-[#e6e2f0] px-4 md:px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={22} className="text-gray-500" />
          ) : (
            <Menu size={22} className="text-gray-500" />
          )}
        </button>

        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Scholarra" width={28} height={28} />
          <span className="font-semibold text-[#8f6cd0] text-base">
            Scholarra
          </span>
        </Link>
      </div>

      {/* Center */}
      <div className="hidden md:flex max-w-md w-full mx-8 relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search scholarships, deadlines…"
          className="w-full h-9 pl-9 pr-3 border border-[#dcdcdc] rounded-md text-sm outline-none focus:border-[#8f6cd0]"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#f0ebff] hover:bg-[#e6ddff] transition cursor-pointer">
          <Bell size={18} className="text-[#8f6cd0]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#8f6cd0]" />
        </button>

        {/* Avatar  */}
        <Link
          href="/profile"
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f0fb] text-[#8f6cd0] text-sm font-semibold">
            {initials}
          </div>

          <span className="hidden md:block text-sm font-medium text-gray-600">
            {profileName || user?.email}
          </span>
        </Link>
      </div>
    </header>
  );
}
