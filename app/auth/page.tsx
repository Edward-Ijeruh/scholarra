"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./login/LoginForm";
import SignupForm from "./signup/SignupForm";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  // Redirect users
  // useEffect(() => {
  //   console.log("Auth state:", { user, loading });
  //   if (!loading && user) {
  //     router.replace("/dashboard");
  //   }
  // }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f0fb] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Welcome back, Scholar
          </h1>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            Join other students finding their future in Nigeria
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center border-b border-[#d9d4e2] mb-6">
          <button
            onClick={() => setMode("login")}
            className={`py-3 text-sm font-medium transition-colors w-50 cursor-pointer hover:bg-purple-50 ${
              mode === "login"
                ? "text-[#8f6cd0] border-b-2 border-[#8f6cd0]"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`py-3 text-sm font-medium transition-colors w-50 cursor-pointer hover:bg-purple-50 ${
              mode === "signup"
                ? "text-[#8f6cd0] border-b-2 border-[#8f6cd0]"
                : "text-gray-500"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        <div>{mode === "login" ? <LoginForm /> : <SignupForm />}</div>
      </div>
    </div>
  );
}
