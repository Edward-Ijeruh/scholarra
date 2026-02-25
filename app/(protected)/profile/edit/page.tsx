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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen mx-auto max-w-6xl p-6 md:p-8 rounded-xl bg-white"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-[#8f6cd0] hover:underline cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to profile
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Keep your information up to date so we can personalise your
          experience.
        </p>
      </div>

      {/* Name */}
      <section className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-800">Name</label>
        <input
          {...register("name")}
          placeholder="Your name"
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-[#8f6cd0] focus:outline-none"
        />
      </section>

      {/* Email (read-only) */}
      <section className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-800">Email</label>
        <input
          value={user.email ?? ""}
          disabled
          className="w-full cursor-not-allowed rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
        />
      </section>

      {/* Field of study */}
      <section className="space-y-3 mb-6">
        <h2 className="text-sm font-medium text-gray-800">Field of study</h2>
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
      </section>

      {/* Location */}
      <section className="space-y-3 mb-6">
        <h2 className="text-sm font-medium text-gray-800">
          Preferred locations
        </h2>
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
      </section>

      {/* Notifications */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-medium text-gray-800">
          Notification preferences
        </h2>

        <Controller
          name="notificationPrefs"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={field.value.email}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      email: e.target.checked,
                    })
                  }
                  className="cursor-pointer accent-[#8f6cd0]"
                />
                Email notifications
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={field.value.push}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      push: e.target.checked,
                    })
                  }
                  className="cursor-pointer accent-[#8f6cd0]"
                />
                Push notifications
              </label>
            </div>
          )}
        />
      </section>

      {/* Save */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center rounded-md bg-[#8f6cd0] py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}
