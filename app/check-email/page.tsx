"use client";

import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function CheckEmailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f2ff] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-[#e6e2f0] text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#efeaff] text-[#8f6cd0]">
            <Mail size={22} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Check your email
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          We’ve sent your scholarship playbook to your email.
          <br />
          If you don’t see it, check your spam folder.
        </p>

        {/* Back button */}
        <button
          onClick={() => router.push("/playbook")}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-[#8f6cd0] hover:underline mx-auto cursor-pointer"
        >
          Back to playbook
        </button>
      </div>
    </div>
  );
}
