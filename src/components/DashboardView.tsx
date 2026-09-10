"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Heart,
  Activity,
  Droplet,
  Thermometer,
  Footprints,
  Moon,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Pill,
  Sparkles,
  Droplets,
  Bot,
  Zap,
  Utensils,
  Brain,
} from "lucide-react";
import { VitalCard } from "./VitalCard";
import { HealthScoreCard } from "./HealthScoreCard";
import { WeeklyHealthChart } from "./WeeklyHealthChart";
import { getBpCategory } from "@/utils/healthCalc";
import { AddReadingModal } from "./AddReadingModal";

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const {
    latestVital,
    todayActivity,
    latestSleep,
    waterIntakeTodayMl,
    logWater,
    profile,
    reminders,
    markReminderTaken,
    meals,
    todayMood,
  } = useHealth();

  const [showReadingModal, setShowReadingModal] = useState(false);

  const bpStatus = latestVital
    ? getBpCategory(latestVital.systolicBp, latestVital.diastolicBp)
    : { category: "Pending" as const, badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", desc: "No readings logged yet" };

  // Status calculations for vitals
  const hrStatus: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.heartRate >= 60 && latestVital.heartRate <= 100
      ? { label: "Optimal", variant: "success" }
      : latestVital.heartRate < 60
      ? { label: "Bradycardia", variant: "info" }
      : { label: "Elevated", variant: "warning" }
    : { label: "No Data", variant: "info" };

  const spo2Status: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.spo2 >= 95
      ? { label: "Optimal", variant: "success" }
      : latestVital.spo2 >= 90
      ? { label: "Acceptable", variant: "warning" }
      : { label: "Hypoxia Risk", variant: "danger" }
    : { label: "No Data", variant: "info" };

  const tempStatus: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.temperature >= 97.5 && latestVital.temperature <= 99.0
      ? { label: "Normal", variant: "success" }
      : latestVital.temperature > 99.0
      ? { label: "Elevated", variant: "warning" }
      : { label: "Low", variant: "warning" }
    : { label: "No Data", variant: "info" };

  const stepPercent = Math.min(100, Math.round((todayActivity.steps / (profile.dailyStepGoal || 8000)) * 100));
  const waterPercent = Math.min(
    100,
    Math.round((waterIntakeTodayMl / (profile.dailyWaterGoalMl || 2500)) * 100)
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const activeReminders = reminders.filter((r) => r.isActive).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Daily Health Score Hero */}
      <HealthScoreCard />

      {/* AI Health Copilot Quick Insight Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-teal-500/10 border border-sky-200/60 dark:border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                HealthTrack AI Copilot
              </h4>
              <span className="px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[9px] font-black uppercase tracking-wider">
                Active Analysis
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Your resting heart rate ({latestVital?.heartRate ?? 72} BPM) and daily hydration are in steady alignment.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("assistant")}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer shrink-0"
        >
          <span>Open AI Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Vitals Grid (6 Clinical & Activity Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Heart Rate */}
        <VitalCard
          title="Heart Rate"
          value={latestVital ? latestVital.heartRate : "--"}
          unit="BPM"
          icon={Heart}
          iconColor="text-rose-500"
          iconBg="bg-rose-50 dark:bg-rose-950/40"
          statusBadge={hrStatus}
          changeText={latestVital ? "Resting rhythm" : "Click to log"}
          changeType="neutral"
          onClick={() => (latestVital ? onNavigate("metrics") : setShowReadingModal(true))}
        />

        {/* Blood Pressure */}
        <VitalCard
          title="Blood Pressure"
          value={latestVital ? `${latestVital.systolicBp}/${latestVital.diastolicBp}` : "--/--"}
          unit="mmHg"
          icon={Activity}
          iconColor="text-sky-500"
          iconBg="bg-sky-50 dark:bg-sky-950/40"
          statusBadge={{
            label: bpStatus.category,
            variant: bpStatus.category === "Normal" ? "success" : "info",
          }}
          changeText={latestVital ? "AHA Target Zone" : "Click to log"}
          changeType="neutral"
          onClick={() => (latestVital ? onNavigate("metrics") : setShowReadingModal(true))}
        />

        {/* SpO2 */}
        <VitalCard
          title="Blood Oxygen"
          value={latestVital ? latestVital.spo2 : "--"}
          unit="%"
          icon={Droplet}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-50 dark:bg-cyan-950/40"
          statusBadge={spo2Status}
          changeText={latestVital ? "Oxygenation" : "Click to log"}
          changeType="neutral"
          onClick={() => (latestVital ? onNavigate("metrics") : setShowReadingModal(true))}
        />

        {/* Temperature */}
        <VitalCard
          title="Temperature"
          value={latestVital ? latestVital.temperature : "--"}
          unit="°F"
          icon={Thermometer}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
          statusBadge={tempStatus}
          changeText={latestVital ? "Normothermic" : "Click to log"}
          changeType="neutral"
          onClick={() => (latestVital ? onNavigate("metrics") : setShowReadingModal(true))}
        />

        {/* Daily Steps */}
        <VitalCard
          title="Daily Steps"
          value={todayActivity.steps.toLocaleString()}
          unit={`/ ${(profile.dailyStepGoal || 8000).toLocaleString()}`}
          icon={Footprints}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
          statusBadge={{
            label: `${stepPercent}% Goal`,
            variant: stepPercent >= 80 ? "success" : "info",
          }}
          changeText={`${todayActivity.distanceKm} km walked`}
          changeType="neutral"
          onClick={() => onNavigate("activity")}
        />

        {/* Sleep */}
        <VitalCard
          title="Sleep Rest"
          value={latestSleep ? latestSleep.totalHours : "--"}
          unit="hours"
          icon={Moon}
          iconColor="text-indigo-500"
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
          statusBadge={{
            label: latestSleep ? `${latestSleep.qualityScore}% Rest` : "No Log",
            variant: latestSleep && latestSleep.qualityScore >= 80 ? "success" : "info",
          }}
          changeText={latestSleep ? "Recovery score" : "Log sleep"}
          changeType="neutral"
          onClick={() => onNavigate("sleep")}
        />
      </div>

      {/* 3. Weekly Trends Chart & Hydration / Schedule Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Weekly Chart */}
        <div className="lg:col-span-2">
          <WeeklyHealthChart />
        </div>

        {/* Right (1 col): Hydration Station & Today's Schedule */}
        <div className="space-y-6">
          {/* Hydration Interactive Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Hydration Station
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Daily Goal: {profile.dailyWaterGoalMl} ml
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                {waterIntakeTodayMl} ml
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-sky-400 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            {/* Quick Log Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => logWater(250)}
                className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 250 ml
              </button>
              <button
                onClick={() => logWater(500)}
                className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 500 ml
              </button>
              <button
                onClick={() => logWater(750)}
                className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 750 ml
              </button>
            </div>
          </div>

          {/* Quick Dual Card: Nutrition & Mental State */}
          <div className="grid grid-cols-2 gap-3">
            {/* Nutrition Card */}
            <div
              onClick={() => onNavigate("nutrition")}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Utensils className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Nutrition</h5>
              <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {meals.reduce((sum, m) => sum + m.calories, 0)} kcal
              </p>
              <span className="text-[10px] text-slate-400">{meals.length} meals logged</span>
            </div>

            {/* Mental Wellness Card */}
            <div
              onClick={() => onNavigate("wellness")}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Brain className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Mood State</h5>
              <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {todayMood ? todayMood.primaryMood : "Check-in"}
              </p>
              <span className="text-[10px] text-slate-400">4-7-8 Breathing</span>
            </div>
          </div>

          {/* Today's Care Reminders Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                  <Pill className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today&apos;s Care Schedule
                </h4>
              </div>
              <button
                onClick={() => onNavigate("reminders")}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
              >
                All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeReminders.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-400">No active reminders scheduled.</p>
                  <button
                    onClick={() => onNavigate("reminders")}
                    className="text-xs text-sky-600 dark:text-sky-400 font-medium hover:underline mt-1 inline-block"
                  >
                    + Add your first reminder
                  </button>
                </div>
              ) : (
                activeReminders.map((rem) => {
                  const isDone = rem.lastTakenDate === todayStr;
                  return (
                    <div
                      key={rem.id}
                      onClick={() => markReminderTaken(rem.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 opacity-75"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isDone
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-300 dark:border-slate-600 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isDone
                                ? "line-through text-slate-400 dark:text-slate-500"
                                : "text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {rem.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block">{rem.time}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {rem.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reading Modal */}
      <AddReadingModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
      />
    </div>
  );
}
