"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Info, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/lib/auth/auth";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";

const forgotSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotValues) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      toast.success("Reset link sent! Check your email.");
      setCooldown(60);
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cooldown countdown
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-[#8f6cd0] hover:underline cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to login
      </button>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email address"
          {...register("email")}
          className="w-full rounded-md border border-[#d9d4e2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8f6cd0]"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || cooldown > 0}
        className="flex w-full items-center justify-center rounded-md bg-[#8f6cd0] py-3 text-sm font-medium text-white disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed "
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : cooldown > 0 ? (
          `Resend in ${cooldown}s`
        ) : (
          "Send reset link"
        )}
      </button>

      {/* Info */}
      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <Info size={14} />
        <span>You’ll receive a reset link if the email exists.</span>
      </p>
    </form>
  );
}
