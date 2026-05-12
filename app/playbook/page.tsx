"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CheckCircle, BookOpen, Loader2, Menu, X } from "lucide-react";
import Link from "next/link";

export default function PlaybookPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

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

  // Navbar navigation
  useEffect(() => {
    const sections = ["hero", "pain", "solution", "preview", "cta"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);

        if (
          el &&
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async () => {
    const { name, email, phone } = formData;

    if (!name || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/playbook/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      toast.success("Playbook sent successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      setTimeout(() => {
        router.push("/check-email");
      }, 1200);
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4f0fb] text-gray-900 font-[Poppins] overflow-x-hidden scroll-smooth">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-6xl mx-auto relative">
          <div className="relative z-50 flex items-center justify-between rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-5 py-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 transition hover:opacity-80"
            >
              <Image src="/logo.png" alt="Scholarra" width={32} height={32} />

              <span className="text-lg font-semibold text-[#8f6cd0]">
                Scholarra
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { id: "hero", label: "Home" },
                { id: "pain", label: "Problem" },
                { id: "solution", label: "Solution" },
                { id: "preview", label: "Preview" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? "text-[#8f6cd0] relative after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-[#8f6cd0]"
                      : "text-gray-600 hover:text-[#8f6cd0]"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#cta"
                className="rounded-xl bg-[#8f6cd0] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#8f6cd0]/20"
              >
                Get Playbook
              </a>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-[#ece7f5] bg-white text-gray-700 transition hover:bg-[#f6f2ff]"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
              mobileMenu
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenu(false)}
              className={`absolute inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 ${
                mobileMenu ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Floating dropdown */}
            <div className="absolute top-24 left-4 right-4">
              <div
                className={`rounded-[28px] border border-white/40 bg-white/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 ${
                  mobileMenu
                    ? "translate-y-0 opacity-100 scale-100"
                    : "-translate-y-4 opacity-0 scale-[0.98]"
                }`}
              >
                <nav className="flex flex-col p-3 gap-1">
                  {[
                    { id: "hero", label: "Home" },
                    { id: "pain", label: "Problem" },
                    { id: "solution", label: "Solution" },
                    { id: "preview", label: "Preview" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileMenu(false)}
                      className={`relative rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300 ${
                        activeSection === item.id
                          ? "border-l-[5px] border-[#8f6cd0] bg-[#faf7ff] text-[#8f6cd0] pl-3"
                          : "border-l-[5px] border-transparent text-gray-700 hover:bg-[#f7f4ff] hover:text-[#8f6cd0]"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}

                  <a
                    href="#cta"
                    onClick={() => setMobileMenu(false)}
                    className="mt-3 rounded-2xl bg-[#8f6cd0] px-4 py-4 text-center text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#8f6cd0]/20"
                  >
                    Get Playbook
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="hero"
        className="relative min-h-[92vh] overflow-hidden pt-36 pb-20 flex items-center"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/students-studying.jpg"
            alt="Students studying"
            fill
            priority
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,10,24,0.78),rgba(12,10,24,0.82))]" />

          {/* Glow */}
          <div className="absolute top-20 left-10 h-56 w-56 rounded-full bg-[#8f6cd0]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#8f6cd0]/10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
          <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white/90 shadow-lg">
              <BookOpen size={14} className="text-[#c7b3ff]" />
              Scholarship Playbook
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-white">
              Land Scholarships
              <br />
              <span className="text-[#cdbdff]">Without the confusion.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 sm:mt-7 text-sm sm:text-base md:text-lg leading-relaxed text-white/70 max-w-xl mx-auto md:mx-0">
              A practical scholarship system designed to help students find
              better opportunities, stay organized, and apply with clarity
              instead of guesswork.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-2xl bg-[#8f6cd0] px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#7d5ec7] hover:shadow-[0_20px_40px_rgba(143,108,208,0.35)] w-full sm:w-auto"
              >
                Get the Free Playbook
              </a>

              <a
                href="#preview"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-white/15 w-full sm:w-auto"
              >
                Preview Inside
              </a>
            </div>

            {/* Stats */}
            {/* <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center md:text-left">
              {[
                {
                  title: "Structured System",
                  desc: "A step-by-step scholarship workflow",
                },
                {
                  title: "Focused Applications",
                  desc: "Apply smarter instead of applying everywhere",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
                >
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f4f0fb] to-transparent" />
      </section>

      {/* Pain section */}
      <section
        id="pain"
        className="relative py-24 bg-white border-t border-[#f1edf7] scroll-mt-8 overflow-hidden"
      >
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Top content */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ece4ff] bg-[#faf8ff] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8f6cd0]">
              The Problem
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.08] text-[#111827]">
              Most <span className="text-[#8f6cd0]">students</span> are not
              failing because they are unqualified.
            </h2>

            <p className="mt-5 text-sm md:text-md leading-relaxed text-gray-600">
              They are overwhelmed by a process that feels scattered, unclear,
              and difficult to manage consistently.
            </p>
          </div>

          {/* Main content */}
          <div className="mt-20 grid lg:grid-cols-2 gap-14 items-center">
            {/* Left image */}
            <div className="relative">
              <div className="relative h-[500px] overflow-hidden rounded-[32px] border border-[#ece7f5] shadow-[0_30px_80px_-35px_rgba(15,16,32,0.18)]">
                <Image
                  src="/frustrated-student.jpg"
                  alt="Frustrated student"
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1020]/70 via-[#0f1020]/10 to-transparent" />

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
                    <p className="text-sm md:text-[15px] leading-relaxed text-white/90">
                      Students often waste time applying randomly instead of
                      following a structured process designed to maximise strong
                      opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div>
              <div className="space-y-4">
                {[
                  {
                    title: "No clear direction",
                    desc: "Students spend hours searching without knowing which opportunities are genuinely worth pursuing.",
                  },
                  {
                    title: "Scattered applications",
                    desc: "Applications become random and difficult to manage without a focused strategy.",
                  },
                  {
                    title: "Missed opportunities",
                    desc: "Important deadlines and strong opportunities slip away because there is no organised system.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="group rounded-[28px] border border-[#ece7f5] bg-[#fcfbff] p-6 transition-all duration-300 hover:border-[#ddd2ff] hover:shadow-[0_20px_50px_-30px_rgba(143,108,208,0.3)]"
                  >
                    <div className="flex gap-4">
                      {/* Number */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eeff] text-sm font-semibold text-[#8f6cd0]">
                        0{index + 1}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="text-[17px] font-semibold tracking-tight text-[#111827]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className="mt-6 border-l-4 border-[#8f6cd0] pl-5">
                <p className="text-[15px] leading-relaxed text-gray-700">
                  The issue is rarely potential.
                  <span className="font-medium text-[#111827]">
                    {" "}
                    It is usually a lack of clarity, structure, and consistency.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section
        id="solution"
        className="py-24 bg-[#f6f2ff] border-t border-[#e6e2f0] scroll-mt-8"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7defd] bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8f6cd0]">
              The system
            </div>

            <h2 className="mt-5 text-3xl md:text-4xl font-semibold leading-tight">
              A calmer, smarter way to{" "}
              <span className="relative text-[#8f6cd0]">win scholarships</span>
            </h2>

            <p className="mt-4 text-gray-600 text-sm md:text-md">
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
      <section
        id="preview"
        className="relative py-24 bg-[#fcfbff] border-t border-[#f1edf7] scroll-mt-8 overflow-hidden"
      >
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Top content */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ece4ff] bg-[#faf8ff] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8f6cd0]">
              Inside the Playbook
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.08] text-[#111827]">
              A practical system to help you apply with
              <span className="text-[#8f6cd0]"> clarity and confidence.</span>
            </h2>

            <p className="mt-5 text-sm md:text-md leading-relaxed text-gray-600">
              Everything inside the playbook is designed to simplify the
              scholarship process and help you focus on opportunities that
              actually matter.
            </p>
          </div>

          {/* Main content */}
          <div className="mt-20 grid lg:grid-cols-2 gap-14 items-center">
            {/* Left side */}
            <div className="relative">
              <div className="relative h-[500px] overflow-hidden rounded-[32px] border border-[#ece7f5] shadow-[0_30px_80px_-35px_rgba(15,16,32,0.18)]">
                <Image
                  src="/playbook-preview.png"
                  alt="Scholarship playbook preview"
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1020]/70 via-[#0f1020]/10 to-transparent" />

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5">
                    <p className="text-sm md:text-[15px] leading-relaxed text-white/90">
                      The playbook gives students a calmer and more organised
                      way to approach scholarships without relying on guesswork
                      or random applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div>
              <div className="space-y-4">
                {[
                  {
                    title: "Why most students struggle early",
                    desc: "Understand the hidden mistakes that cause students to waste time before they even submit applications.",
                  },
                  {
                    title: "A focused scholarship workflow",
                    desc: "Learn a simple framework to identify, organise, and apply to stronger opportunities consistently.",
                  },
                  {
                    title: "Better positioning strategies",
                    desc: "Discover how to stand out with stronger applications, even without perfect grades or achievements.",
                  },
                  {
                    title: "CV and essay frameworks",
                    desc: "Use practical structures designed to make your applications feel clearer and more compelling.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="group rounded-[28px] border border-[#ece7f5] bg-white p-6 transition-all duration-300 hover:border-[#ddd2ff] hover:shadow-[0_20px_50px_-30px_rgba(143,108,208,0.3)]"
                  >
                    <div className="flex gap-4">
                      {/* Number */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eeff] text-sm font-semibold text-[#8f6cd0]">
                        0{index + 1}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="text-[17px] font-semibold tracking-tight text-[#111827]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className="mt-6 border-l-4 border-[#8f6cd0] pl-5">
                <p className="text-[15px] leading-relaxed text-gray-700">
                  The goal is not to apply everywhere.
                  <span className="font-medium text-[#111827]">
                    {" "}
                    The goal is to apply strategically with structure, focus,
                    and consistency.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="relative py-24 bg-[#f6f2ff] border-t border-[#ece7f5] scroll-mt-8 overflow-hidden"
      >
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_480px] gap-14 items-center">
            {/* Left content */}
            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7defd] bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#8f6cd0]">
                <BookOpen size={14} />
                Scholarship Playbook
              </div>

              <h2 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.08] text-[#111827]">
                Start applying with
                <span className="text-[#8f6cd0]">
                  {" "}
                  more clarity and structure.
                </span>
              </h2>

              <p className="mt-6 text-sm md:text-base leading-relaxed text-gray-600 max-w-xl mx-auto lg:mx-0">
                Get the free scholarship playbook designed to help students stay
                organised, avoid common mistakes, and approach applications with
                more confidence.
              </p>

              {/* Features */}
              <div className="mt-8 space-y-4 flex flex-col items-center lg:items-start">
                {[
                  "Simple scholarship application framework",
                  "Focused 30-day action roadmap",
                  "Practical CV & essay guidance",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ece4ff] text-[#8f6cd0]">
                      <CheckCircle size={14} />
                    </div>

                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="relative">
              <div className="rounded-[32px] border border-[#ece7f5] bg-white p-7 md:p-8 shadow-[0_30px_80px_-35px_rgba(15,16,32,0.18)]">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-medium text-[#8f6cd0]">
                    Get the free playbook
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#111827]">
                    Join students applying smarter
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    Enter your details below and get instant access to the
                    scholarship playbook.
                  </p>
                </div>

                {/* Form */}
                <div className="mt-8 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e7e2f0] bg-[#fcfbff] px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#cdbdff] focus:ring-4 focus:ring-[#8f6cd0]/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e7e2f0] bg-[#fcfbff] px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#cdbdff] focus:ring-4 focus:ring-[#8f6cd0]/10"
                    />
                  </div>

                  {/* Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-2xl border border-[#e7e2f0] bg-[#fcfbff] px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#cdbdff] focus:ring-4 focus:ring-[#8f6cd0]/10"
                    />
                  </div>

                  {/* Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8f6cd0] px-6 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#7d5ec7] hover:shadow-[0_20px_40px_-20px_rgba(143,108,208,0.45)] disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                      </>
                    ) : (
                      "Get the Free Playbook"
                    )}
                  </button>
                </div>

                <p className="mt-5 text-center text-xs leading-relaxed text-gray-400">
                  No spam. Just practical scholarship guidance you can use
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0b0c18]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Scholarra" width={32} height={32} />

              <div>
                <p className="text-white font-semibold">Scholarra</p>
                <p className="text-xs text-white/40">
                  Helping students win scholarships with clarity
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: "hero", label: "Home" },
                { id: "pain", label: "Problem" },
                { id: "solution", label: "Solution" },
                { id: "preview", label: "Preview" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} Scholarra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
