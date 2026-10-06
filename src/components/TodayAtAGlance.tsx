"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Heart,
  Activity,
  Droplet,
  Footprints,
  Moon,
  Dumbbell,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";
import { VitalCard } from "./VitalCard";

interface TodayAtAGlanceProps {
  onNavigate?: (tab: string) => void;
}

export function TodayAtAGlance({ onNavigate }: TodayAtAGlanceProps) {
  const {
    latestVital,
    todayActivity,
    latestSleep,
    waterIntakeTodayMl,
    personalGoals,
    healthScoreData,
    t,
  } = useHealth();

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  let greetingText = t.greetingMorning;
  if (currentHour >= 12 && currentHour < 17) {
    greetingText = t.greetingAfternoon;
  } else if (currentHour >= 17) {
    greetingText = t.greetingEvening;
  }

  const heartRate = latestVital ? latestVital.heartRate : 72;
  const spo2 = latestVital ? latestVital.spo2 : 98;
  const steps = todayActivity.steps || 6842;
  const stepTarget = personalGoals.dailySteps || 8000;
  const stepPercent = Math.min(100, Math.round((steps / stepTarget) * 100));

  // Water cups (approx 250ml per cup)
  const waterTargetMl = personalGoals.dailyWaterMl || 2000;
  const cupsLogged = Math.round(waterIntakeTodayMl / 250);
  const targetCups = Math.round(waterTargetMl / 250);
  const waterPercent = Math.min(100, Math.round((waterIntakeTodayMl / waterTargetMl) * 100));

  const sleepHours = latestSleep ? Math.floor(latestSleep.totalHours) : 7;
  const sleepMinutes = latestSleep
    ? Math.round((latestSleep.totalHours - Math.floor(latestSleep.totalHours)) * 60)
    : 20;

  const workoutMinutes = todayActivity.activeMinutes || 30;
  const progressPercent = healthScoreData.overallScore || 84;

  // Alerts logic for vitals (Reading Alert feature)
  const isHrElevated = heartRate < 60 || heartRate > 100;
  const isSpo2Low = spo2 < 95;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/80 dark:border-sky-800/60 bg-gradient-to-br from-white via-sky-50/50 to-teal-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-sky-950/40 p-6 sm:p-7 shadow-xl shadow-sky-500/5 transition-all">
      {/* Background ambient decorative shapes */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-teal-400/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Greeting & Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50 mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>{t.todayAtGlance}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {greetingText}
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {t.todaySummarySubtitle}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-white/80 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-sky-200/60 dark:border-sky-700/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-teal-500 flex items-center justify-center text-white font-black text-base shadow-xs">
            ★
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.todaysProgress}
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white leading-none">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Vitals & Metrics Quick Row (Required items) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5 mt-6">
        {/* 1. Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.heartRate}
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Heart className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {heartRate}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 ml-1">BPM</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isHrElevated ? t.statusAttentionRequired : t.statusOptimal}</span>
          </div>
        </div>

        {/* 2. SpO2 */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.spo2}
            </span>
            <span className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {spo2}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 ml-1">%</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isSpo2Low ? t.statusAttentionRequired : t.statusOptimal}</span>
          </div>
        </div>

        {/* 3. Steps */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.steps}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {steps.toLocaleString()}
            </span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-slate-400 truncate">
            / {stepTarget.toLocaleString()} ({stepPercent}%)
          </div>
        </div>

        {/* 4. Water */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.water}
            </span>
            <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Droplet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {cupsLogged}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 ml-1">/ {targetCups} cups</span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-sky-600 dark:text-sky-400">
            {waterIntakeTodayMl} ml ({waterPercent}%)
          </div>
        </div>

        {/* 5. Sleep */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.sleepMetric}
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Moon className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {sleepHours}h {sleepMinutes}m
            </span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {t.statusOptimal} Rest
          </div>
        </div>

        {/* 6. Workout */}
        <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.workout}
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Dumbbell className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2.5">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {workoutMinutes}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 ml-1">min</span>
          </div>
          <div className="mt-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
            {todayActivity.caloriesBurned} kcal
          </div>
        </div>

        {/* 7. Score Ring Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-sky-100">
            <span>Score</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="my-1 text-2xl font-black leading-none">
            {healthScoreData.overallScore}
            <span className="text-xs font-normal text-sky-200">/100</span>
          </div>
          <div className="text-[10px] font-bold text-teal-100 uppercase tracking-wider">
            {healthScoreData.statusText}
          </div>
        </div>
      </div>
    </div>
  );
}
