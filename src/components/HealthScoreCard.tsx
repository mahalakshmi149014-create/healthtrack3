"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Heart,
  Activity,
  Flame,
  Moon,
  Droplet,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export function HealthScoreCard() {
  const { healthScoreData, profile } = useHealth();
  const {
    overallScore,
    cardioScore,
    activityScore,
    sleepScore,
    hydrationScore,
    statusText,
  } = healthScoreData;

  // SVG circular gauge calculation
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/70 dark:border-sky-900/40 bg-gradient-to-br from-white via-sky-50/40 to-teal-50/30 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-sky-950/30 backdrop-blur-xl p-6 sm:p-7 shadow-lg shadow-sky-500/5 transition-all duration-300">
      {/* Decorative ambient background flares */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-sky-400/20 to-teal-400/20 dark:from-sky-500/10 dark:to-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 dark:from-teal-500/10 dark:to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Score Circular Gauge + Headline */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full lg:w-auto">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90 filter drop-shadow-sm">
              {/* Outer faint track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-200/70 dark:text-slate-800"
                strokeWidth="11"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Circle with multi-stop gradient */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="url(#wellnessScoreGradient)"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="wellnessScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score in Center */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {overallScore}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                / 100
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50 mb-2.5 self-center sm:self-start shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>Wellness Index & Vitality</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {statusText}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              Composite score for <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.name}</span> based on cardiovascular stability, circadian sleep cycles, hydration rate, and step consistency.
            </p>
          </div>
        </div>

        {/* Right: Sub-score Breakdown Grid with Glassmorphism */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {/* Cardio */}
          <div className="group p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-rose-300 dark:hover:border-rose-500/40 transition-all shadow-xs hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[11px] uppercase tracking-wider">Cardio</span>
              <div className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-500">
                <Heart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {cardioScore}%
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${cardioScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="group p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-500/40 transition-all shadow-xs hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[11px] uppercase tracking-wider">Activity</span>
              <div className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-500">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {activityScore}%
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${activityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="group p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all shadow-xs hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[11px] uppercase tracking-wider">Sleep</span>
              <div className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500">
                <Moon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {sleepScore}%
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${sleepScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hydration */}
          <div className="group p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 backdrop-blur-md flex flex-col justify-between hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all shadow-xs hover:shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[11px] uppercase tracking-wider">Hydration</span>
              <div className="p-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-500">
                <Droplet className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {hydrationScore}%
              </span>
              <div className="w-full bg-slate-100 dark:bg-slate-700/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${hydrationScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
