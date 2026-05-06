"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  BookOpen,
  CalendarCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function PlaybookPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Save scroll position
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("scrollY", window.scrollY.toString());
    };
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);

  // Restore scroll position
  useEffect(() => {
    const saved = sessionStorage.getItem("scrollY");
    if (!saved) return;
    const y = parseInt(saved, 10);
    const restore = () => {
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    };
    const timeout = setTimeout(restore, 150);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/playbook/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      toast.success("Playbook sent! Check your email");

      setEmail("");

      setTimeout(() => {
        router.push(`/check-email`);
      }, 1200);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f0fb] text-gray-900 font-[Poppins] overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f6f2ff] py-12 md:py-24">
        <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          {/* Left side */}

          <div>
            <div className="inline-flex items-center gap-2 bg-[#efeaff] text-[#6f55b8] text-xs px-4 py-1.5 rounded-full font-medium">
              <BookOpen size={14} className="text-[#6f55b8]" />
              Scholarship Playbook
            </div>

            <h1 className="mt-6 text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Land Scholarships{" "}
              <span className="relative text-[#8f6cd0]">Without Guesswork</span>
            </h1>

            <p className="mt-6 text-gray-600 text-md max-w-xl">
              A clear, structured system to help you find, qualify, and win
              scholarships without wasting time or missing deadlines.
            </p>

            <div className="mt-10 bg-white border border-[#e6e2f0] rounded-xl p-4 shadow-sm max-w-md">
              <p className="text-sm text-gray-500 mb-3">
                Get the free 28-page playbook
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8f6cd0]/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-[#8f6cd0] text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                    </>
                  ) : (
                    "Get it"
                  )}
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center sm:text-left">
              No spam. Just practical strategies you can use immediately.
            </p>
          </div>

          {/* Right side */}

          <div className="relative">
            <div className="relative h-[380px] w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-[#ece7f5]">
              <Image
                src="/students-studying.jpg"
                alt="Students studying"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-1 md:-left-6 flex items-start gap-3 bg-white/90 backdrop-blur border border-[#e6e2f0] rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#efeaff] text-[#8f6cd0]">
                <CalendarCheck size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  30-day system
                </p>
                <p className="text-xs text-gray-500">Proven application flow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain section */}
      <section className="py-24 border-t border-[#e6e2f0] bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          {/* Left side (Image) */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-[#ece7f5]">
                <Image
                  src="/frustrated-student.jpg"
                  alt="Frustrated student"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/90 border border-[#e6e2f0] rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#efeaff] text-[#6f55b8]">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">The problem</p>
                    <p className="text-sm font-medium text-gray-900 mt-1 leading-snug">
                      Most students don’t lack potential.
                      <br />
                      They’re just following a broken process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#8f6cd0]/20 blur-3xl" />
            </div>
          </div>

          {/* Right side (Text) */}
          <div className="order-1 md:order-2">
            <div>
              <p className="text-sm font-medium text-[#8f6cd0]">
                The reality most students face
              </p>

              <h2 className="mt-4 text-3xl md:text-4xl font-semibold leading-tight text-gray-900">
                Scholarships aren’t hard.
                <br />
                <span className="text-gray-500 font-medium">
                  The process is just broken.
                </span>
              </h2>

              <p className="mt-6 text-gray-600 text-sm md:text-base max-w-md">
                Most students don’t fail because they’re not good enough. They
                fail because they’re navigating everything without structure.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  {
                    title: "No clear direction",
                    desc: "You spend hours searching, but still don’t know what’s actually worth applying for.",
                  },
                  {
                    title: "Random applications",
                    desc: "You apply to everything, even when it doesn’t fit, hoping something works.",
                  },
                  {
                    title: "Missed opportunities",
                    desc: "Deadlines sneak up, or applications get rushed at the last minute.",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efeaff] text-[#6f55b8] text-sm font-medium">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-[#f6f2ff] border-t border-[#e6e2f0]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full bg-[#efeaff] px-4 py-1.5 text-xs font-medium text-[#6f55b8]">
              The system
            </div>

            <h2 className="mt-5 text-3xl md:text-4xl font-semibold leading-tight">
              A calmer, smarter way to{" "}
              <span className="relative text-[#8f6cd0]">win scholarships</span>
            </h2>

            <p className="mt-4 text-gray-600 text-sm md:text-base">
              Instead of guessing what works, follow a simple system that helps
              you focus only on opportunities that actually matter.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Find with clarity",
                desc: "Stop scrolling endlessly. Focus only on verified, high-fit scholarships that match your goals.",
              },
              {
                title: "Filter with intention",
                desc: "Quickly eliminate low-fit opportunities so you don’t waste time on applications that won’t convert.",
              },
              {
                title: "Apply with structure",
                desc: "Use a repeatable process that keeps you consistent, organised, and ahead of deadlines.",
              },
            ].map(({ title, desc }, i) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-[#e6e2f0] bg-white p-6 transition hover:shadow-md hover:border-[#d8ccff]"
              >
                <span className="absolute -top-3 left-6 rounded-full bg-[#8f6cd0] px-3 py-1 text-xs font-medium text-white shadow-sm">
                  0{i + 1}
                </span>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#efeaff] text-[#6f55b8]">
                    <CheckCircle size={18} />
                  </div>

                  <h3 className="text-base font-medium text-gray-900">
                    {title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-10 items-center">
            {/* Left side */}

            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Built to <span className="relative text-[#8f6cd0]">remove</span>{" "}
                overwhelm
              </h3>

              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Most students feel stuck because every application feels like
                starting from scratch. This system gives you a clear structure,
                so each step becomes easier, faster, and more predictable.
              </p>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <p>• No more random applications</p>
                <p>• No more missed deadlines</p>
                <p>• No more second-guessing yourself</p>
              </div>
            </div>

            <div className="relative h-[320px] w-full rounded-2xl overflow-hidden shadow-sm ring-1 ring-[#ece7f5]">
              <Image
                src="/happy-student.jpg"
                alt="Confident student"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="relative py-24 border-t border-[#ece8f5] bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm tracking-widest uppercase text-[#8f6cd0]">
              Inside the Playbook
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              What you’ll learn
            </h2>
            <p className="mt-4 text-gray-500 text-base leading-relaxed">
              A structured system designed to help you move from confusion to
              clarity and from applying randomly to applying strategically.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-14 items-center">
            {/* Left side  */}

            <div>
              <ul className="space-y-5">
                {[
                  "Why most students lose opportunities before they even apply",
                  "A simple 3-step system to consistently find and win scholarships",
                  "How to position yourself strongly, even without perfect grades",
                  "CV and personal statement frameworks that actually stand out",
                  "A focused 30-day execution roadmap to get results fast",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-600">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7c5cff] shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side */}
            <div className="relative">
              <div className="relative w-full h-[340px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] border border-gray-100">
                <Image
                  src="/playbook-preview.png"
                  alt="Scholarship playbook preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 bg-[#0f1020] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/70">
            <BookOpen size={14} />
            Scholarship Playbook
          </div>

          <h2 className="mt-7 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Stop guessing.
            <span className="text-white/60"> Start applying with clarity.</span>
          </h2>

          <p className="mt-6 text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
            A simple system to help you find the right scholarships, stay
            organized, and apply without missing opportunities.
          </p>

          <div className="mt-12 max-w-md mx-auto text-left border border-white/15 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-white/50 mb-3">
              Get the free 28-page scholarship playbook
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#8f6cd0] text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                  </>
                ) : (
                  "Get it"
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40">
            No spam. Just practical guidance you can use immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
