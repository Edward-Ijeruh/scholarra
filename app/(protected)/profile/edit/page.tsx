"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft } from "lucide-react";
import { auth, db } from "@/lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { updateUserProfile } from "@/lib/auth/userService";
import { UserProfile } from "@/types/user";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  fieldOfStudy: z.array(z.string()).min(1),
  location: z.array(z.string()).min(1),
  notificationPrefs: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const fields = [
  "Computer Science",
  "Engineering",
  "Mathematics",
  "Physics",
  "Biology",
  "Business",
  "Arts",
];

const locations = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Africa",
  "Worldwide",
];

export default function EditProfileForm() {
  const [user, loadingUser] = useAuthState(auth);
  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { handleSubmit, control, register, reset } = useForm<ProfileFormValues>(
    {
      resolver: zodResolver(profileSchema),
      defaultValues: initialData || {
        name: "",
        fieldOfStudy: [],
        location: [],
        notificationPrefs: { email: true, push: false },
      },
    },
  );

  const onBack = () => {
    router.push("/profile");
  };

  // Fetch user profile
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;

        setInitialData(data);

        reset({
          name: data.name ?? "",
          fieldOfStudy: data.fieldOfStudy ?? [],
          location: data.location ?? [],
          notificationPrefs: data.notificationPrefs ?? {
            email: true,
            push: false,
          },
        });
      } else {
        reset({
          name: "",
          fieldOfStudy: [],
          location: [],
          notificationPrefs: { email: true, push: false },
        });
      }
    };

    fetchData();
  }, [user, reset]);

  if (loadingUser || !user || !initialData)
    return (
      <p className="flex items-center justify-center pt-10 text-gray-500">
        Loading...
      </p>
    );

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true);
      await updateUserProfile(user.uid, data);
      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(
        `Failed to update profile: ${
          (error as Error).message || "Unknown error"
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  const PillGroup = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string[];
    onChange: (val: string[]) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((item) => {
        const active = value.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() =>
              active
                ? onChange(value.filter((v) => v !== item))
                : onChange([...value, item])
            }
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition ${
              active
                ? "bg-[#8f6cd0] text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-1 text-sm text-[#8f6cd0] hover:underline cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to profile
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500 max-w-xl">
            Manage your personal information and preferences.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Main Settings) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-2xl border border-[#ebe7f5] p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your basic details.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  Name
                </label>
                <input
                  {...register("name")}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                           focus:border-[#8f6cd0] focus:ring-2 focus:ring-[#8f6cd0]/20
                           outline-none transition"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  value={user.email ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200
                           bg-gray-100 px-4 py-3 text-sm text-gray-500"
                />
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl border border-[#ebe7f5] p-6 shadow-sm space-y-8">
              {/* Field of Study */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Field of Study
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select areas you're interested in.
                  </p>
                </div>

                <Controller
                  control={control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <PillGroup
                      options={fields}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Preferred Locations
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choose where you’d like to study.
                  </p>
                </div>

                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <PillGroup
                      options={locations}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="sticky top-24 bg-white rounded-2xl border border-[#ebe7f5] p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500">
                  Control how you receive updates.
                </p>
              </div>

              <Controller
                name="notificationPrefs"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {/* Email Toggle */}
                    <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <span className="text-sm text-gray-700">
                        Email notifications
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          field.onChange({
                            ...field.value,
                            email: !field.value.email,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                          field.value.email ? "bg-[#8f6cd0]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            field.value.email
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>

                    {/* Push Toggle */}
                    <label className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                      <span className="text-sm text-gray-700">
                        Push notifications
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          field.onChange({
                            ...field.value,
                            push: !field.value.push,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                          field.value.push ? "bg-[#8f6cd0]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            field.value.push ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                )}
              />

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#8f6cd0] py-3 text-sm
                         font-semibold text-white shadow-md transition-all
                         hover:opacity-90 transition cursor-pointer
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
