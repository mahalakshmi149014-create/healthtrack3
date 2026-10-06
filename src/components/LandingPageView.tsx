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
  Globe,
} from "lucide-react";
import { MedicalDisclaimerBadge } from "./MedicalDisclaimer";
import { SUPPORTED_LANGUAGES } from "@/data/translations";

export function LandingPageView() {
  const { loginDemo, language, setLanguage, t } = useHealth();
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

        <div className="flex items-center gap-3">
          {/* Language Selector in Navbar */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="dark:bg-slate-900 text-slate-800 dark:text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <MedicalDisclaimerBadge />
        </div>
      </header>

      {/* Main Hero & Login Split */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Col: Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200/50 dark:border-sky-800/50 text-sky-800 dark:text-sky-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>{t.appSubtitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Intelligent Health Monitoring,{" "}
            <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Simplified & Clinical-Grade.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            Track resting heart rate, oxygenation, daily steps, water intake, sleep patterns, and medications with interactive insights and multilingual accessibility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "Daily Health Index Score (0-100)",
              "Today at a Glance Smart Summary",
              "Hydration & Medicine Alarms",
              "Printable Medical Summary Reports",
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
                {t.demoStudent}
              </button>
              <button
                onClick={() => loginDemo("General User")}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer active:scale-98"
              >
                <Users className="w-4 h-4" />
                {t.demoGeneral}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Supabase Auth Form with Language Selection */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {t.login}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Secure Supabase Cloud Health Vault
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Language Selector in Login Form */}
            <div className="mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                {t.selectLanguage}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex.morgan@healthtrack.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer mt-2"
              >
                {t.login}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
