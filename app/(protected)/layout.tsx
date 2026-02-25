"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth/auth";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <>
      <Topbar
        user={user}
        isMenuOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen((v) => !v)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={async () => {
          await logout();
          router.replace("/auth");
        }}
      />

      <main className="pt-[70px] md:pl-[280px] bg-[#f4f0fb] min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </>
  );
}
