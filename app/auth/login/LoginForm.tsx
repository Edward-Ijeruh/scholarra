"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Info } from "lucide-react";
import { authSchema, AuthFormValues } from "@/lib/validators/auth";
import ForgotPasswordForm from "../forgot-password/ForgotPasswordForm";
import { login } from "@/lib/auth/auth";
import { loginWithGoogle } from "@/lib/auth/auth";
import { createUserProfile } from "@/lib/auth/userService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { redirectAfterAuth } from "@/lib/auth/redirectAfterAuth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "forgot">("login");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      setLoading(true);
      const cred = await login(data.email, data.password);
      toast.success("Logged in successfully");
      await redirectAfterAuth(cred.user, router);
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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const cred = await loginWithGoogle();
      await createUserProfile(cred.user);
      toast.success("Signed in with Google");
      await redirectAfterAuth(cred.user, router);
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(error.message);
      } else {
        toast.error("Google sign-in failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  if (view === "forgot") {
    return <ForgotPasswordForm onBack={() => setView("login")} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-[#dadce0] bg-white py-3 text-sm font-medium text-[#3c4043] hover:bg-[#f8f9fa] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        <img src="/google-logo.png" alt="Google logo" className="h-5 w-5" />
        Continue with Google
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e6e2f0]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-400">or</span>
        </div>
      </div>

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

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
          className="w-full rounded-md border border-[#d9d4e2] px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#8f6cd0]"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => setView("forgot")}
          className="text-sm text-[#8f6cd0] hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-md bg-[#8f6cd0] py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : "Login"}
      </button>

      {/* Info tip */}
      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
        <Info size={14} />
        <span>Use the toggle above to switch to signup tab.</span>
      </p>
    </form>
  );
}
