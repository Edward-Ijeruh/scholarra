"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  GraduationCap,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Bell,
  FileText,
  LayoutGrid,
  UserPlus,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// Fade animations
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="font-[Poppins] bg-[#f4f0fb] text-gray-900">
      {/* Navbar*/}
      <header className="sticky top-0 z-50 border-b border-[#e6e2f0] bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Scholarra logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-semibold text-[#8f6cd0]">
              Scholarra
            </span>
          </Link>

          {/* Desktop navlinks */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-[#8f6cd0]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#8f6cd0]">
              How it works
            </a>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/auth"
            className="hidden md:inline-flex rounded-md bg-[#8f6cd0] px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get started
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-[#e6e2f0] shadow-sm transition-all duration-300 ease-out ${
            open
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-4"
          }`}
        >
          <nav className="flex flex-col gap-6 px-6 py-6 text-sm">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="hover:text-[#8f6cd0]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="hover:text-[#8f6cd0]"
            >
              How it works
            </a>

            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-[#8f6cd0] px-4 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f6f2ff] via-white to-white" />

        <div className="mx-auto max-w-7xl px-4 pt-10 md:pt-16 pb-24 grid gap-16 md:grid-cols-2 items-center">
          <div className="text-center md:text-left">
            {/* Trust badge */}
            <motion.div
              variants={fadeDown}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#e4dbff] px-4 py-1.5 text-xs font-medium text-[#5f45a8] mx-auto md:mx-0"
            >
              <GraduationCap size={14} className="text-[#6f55b8]" />
              Built for Nigerian students
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.6 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mx-auto md:mx-0"
            >
              Find scholarships that actually fit{" "}
              <span className="relative text-[#8f6cd0] inline-block">
                <span className="relative z-10">you</span>
                <span className="absolute right-0 bottom-0 h-2 w-[80%] bg-[#e6dbff] rounded" />
              </span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.6 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto md:mx-0"
            >
              Scholarra helps Nigerian students discover, track, and apply for
              scholarships{" "}
              <span className="font-medium text-gray-700">
                without the confusion
              </span>
              , spam, or missed deadlines.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.6 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-md bg-[#8f6cd0] px-7 py-3.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
              >
                Get started
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-md border border-[#d9d4e2] bg-white px-7 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign in
              </Link>
            </motion.div>
          </div>

          <div
            // variants={fadeLeft}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ amount: 0.4 }}
            className="relative"
          >
            <div className="relative h-[300px] sm:h-[360px] md:h-[420px] w-full rounded-2xl bg-white shadow-lg ring-1 ring-[#ece7f5] overflow-hidden">
              <Image
                src="/hero-students.jpg"
                alt="Students discovering scholarships with Scholarra"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feartures */}
      <section
        id="features"
        className="scroll-mt-14 border-t border-[#e6e2f0] bg-[#faf9fd] py-20"
      >
        <div className="mx-auto max-w-7xl px-4">
          {/* Section header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Built for students, not spreadsheets
            </h2>
            <p className="mt-4 text-gray-600 text-sm md:text-base">
              Everything you need to stay ahead of scholarship opportunities,
              organised, personalised, and stress free.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Personalised matches",
                desc: "Scholarships tailored to your field of study, location, and academic goals.",
              },
              {
                icon: CalendarCheck,
                title: "Deadline tracking",
                desc: "Automatic reminders so you never miss an important application date.",
              },
              {
                icon: ShieldCheck,
                title: "Verified opportunities",
                desc: "No scams or outdated links, only carefully vetted scholarships.",
              },
              {
                icon: Bell,
                title: "Smart notifications",
                desc: "Get alerts when new opportunities match your profile.",
              },
              {
                icon: FileText,
                title: "Clear requirements",
                desc: "Understand what you need before applying, without digging through PDFs.",
              },
              {
                icon: LayoutGrid,
                title: "Student-first design",
                desc: "A calm, focused interface built to reduce confusion and overwhelm.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#e6e2f0] bg-white p-6 transition hover:border-[#d8ccff] hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#efeaff] text-[#6f55b8]">
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-14 py-20 border-t border-[#e6e2f0]"
      >
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              How Scholarra works
            </h2>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              A simple, guided flow designed to help you find the right
              scholarships without stress or guesswork.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: UserPlus,
                title: "Create your profile",
                desc: "Share your field of study, preferred locations, and goals so we understand what fits you.",
              },
              {
                icon: Sparkles,
                title: "Get matched",
                desc: "We automatically surface scholarships that align with your profile and interests.",
              },
              {
                icon: CheckCircle,
                title: "Apply confidently",
                desc: "Track deadlines, review clear requirements, and apply without confusion.",
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={title}
                className="relative rounded-2xl border border-[#e6e2f0] bg-white p-6 text-center"
              >
                {/* Step number */}
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#efeaff] px-3 py-1 text-xs font-medium text-[#6f55b8]">
                  Step {index + 1}
                </span>

                {/* Icon */}
                <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8f6cd0] text-white">
                  <Icon size={22} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-base font-medium text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-[#8f6cd0] px-8 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Create your account
            </Link>
          </div>
        </div>
      </section>

      {/* CTA*/}
      <section className="relative overflow-hidden bg-[#8f6cd0] py-20 text-white">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          {/* Badge */}
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white/90">
            <GraduationCap size={14} className="text-white" />
            Built for Nigerian students
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Your future shouldn’t depend on luck
          </h2>

          {/* Supporting copy */}
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-white/90">
            Scholarra helps you discover real scholarships, track deadlines, and
            apply with confidence, all in one calm, organised place.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-medium text-[#8f6cd0] transition hover:bg-gray-100"
            >
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e6e2f0] bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10">
          {/* Top grid */}
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Scholarra logo"
                  width={32}
                  height={32}
                />
                <span className="text-lg font-semibold text-[#8f6cd0]">
                  Scholarra
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm text-gray-600">
                Scholarra helps Nigerian students discover real scholarship
                opportunities, track deadlines, and apply with confidence,
                without confusion or spam.
              </p>

              <p className="mt-4 text-xs text-gray-500">
                Built with students in mind
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-[#8f6cd0]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#8f6cd0]">
                    How it works
                  </a>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-[#8f6cd0]">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal / support */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-[#8f6cd0]">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#8f6cd0]">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#8f6cd0]">
                    Contact support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#e6e2f0] pt-6">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Scholarra. All rights reserved.
            </p>

            <p className="text-xs text-gray-500">Made for students • No spam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
