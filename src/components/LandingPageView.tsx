"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  UserCheck,
  ArrowRight,
  Sparkles,
  Lock,
  GraduationCap,
  Users,
  CheckCircle2,
  TrendingUp,
  Moon,
  Droplet,
} from "lucide-react";
import { MedicalDisclaimerBadge } from "./MedicalDisclaimer";

export function LandingPageView() {
  const { loginDemo } = useHealth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginDemo("Student");
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#090d16] overflow-hidden flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-400/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Top Navbar */}
      <header className="relative z-20 px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
            Health<span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">Track</span>
          </span>
        </div>
        <MedicalDisclaimerBadge />
      </header>

      {/* Main Hero & Login Split */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Col: Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200/50 dark:border-sky-800/50 text-sky-800 dark:text-sky-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>Digital Health Intelligence for Students & Everyday Wellness</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Intelligent Health Monitoring,{" "}
            <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Simplified & Clinical-Grade.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            Track resting heart rate, blood pressure stages, oxygenation, circadian sleep cycles, workouts, and medications in one centralized, high-fidelity dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "Real-time Daily Health Index Score",
              "AHA Blood Pressure Categorization",
              "Hydration & Medication Alarms",
              "Printable Summaries for Medical Visits",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Quick Demo Login CTA Box */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-3.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Instant One-Click Demo Access
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => loginDemo("Student")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-sky-600/25 transition-all cursor-pointer active:scale-98"
              >
                <GraduationCap className="w-4 h-4" />
                Explore as Student (Alex)
              </button>
              <button
                onClick={() => loginDemo("General User")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-2xl border border-slate-700/60 transition-all cursor-pointer active:scale-98"
              >
                <Users className="w-4 h-4" />
                Explore as General User
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Standard Sign In Form with Glassmorphism */}
        <div className="lg:col-span-5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to Your Portal
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Access encrypted clinical telemetry & care reminders
            </p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-sky-600/25 transition-all cursor-pointer active:scale-98 mt-2"
            >
              Sign In to HealthTrack
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-[11px] font-medium text-slate-400">
              HIPAA-aligned data sandbox • 256-bit client encryption
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          © 2026 HealthTrack Platform. Built for wellness education and self-monitoring.
          Sample data is for demonstrative purposes and does not substitute professional medical diagnosis.
        </p>
      </footer>
    </div>
  );
}
