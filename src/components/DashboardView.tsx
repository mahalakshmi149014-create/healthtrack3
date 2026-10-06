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
  AlertTriangle,
  FileText,
  Calendar as CalendarIcon,
  Target,
  Info,
} from "lucide-react";
import { VitalCard } from "./VitalCard";
import { HealthScoreCard } from "./HealthScoreCard";
import { WeeklyHealthChart } from "./WeeklyHealthChart";
import { TodayAtAGlance } from "./TodayAtAGlance";
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
    healthNotes,
    personalGoals,
    t,
  } = useHealth();

  const [showReadingModal, setShowReadingModal] = useState(false);

  // Blood Pressure categorization
  const bpStatus = latestVital
    ? getBpCategory(latestVital.systolicBp, latestVital.diastolicBp)
    : { category: "Normal" as const, badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", desc: "Optimal baseline" };

  // Status calculations for vitals
  const hrStatus: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.heartRate >= 60 && latestVital.heartRate <= 100
      ? { label: t.statusNormal, variant: "success" }
      : latestVital.heartRate < 60
      ? { label: t.statusAttentionRequired, variant: "info" }
      : { label: t.statusElevated, variant: "warning" }
    : { label: t.statusNormal, variant: "info" };

  const spo2Status: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.spo2 >= 95
      ? { label: t.statusOptimal, variant: "success" }
      : latestVital.spo2 >= 90
      ? { label: t.statusElevated, variant: "warning" }
      : { label: t.statusAttentionRequired, variant: "danger" }
    : { label: t.statusNormal, variant: "info" };

  const tempStatus: { label: string; variant: "success" | "warning" | "danger" | "info" } = latestVital
    ? latestVital.temperature >= 97.5 && latestVital.temperature <= 99.0
      ? { label: t.statusNormal, variant: "success" }
      : latestVital.temperature > 99.0
      ? { label: t.statusElevated, variant: "warning" }
      : { label: t.statusAttentionRequired, variant: "warning" }
    : { label: t.statusNormal, variant: "info" };

  // Check if any reading warrants a non-diagnostic "Review this reading" alert
  const hasReadingAlert =
    latestVital &&
    (latestVital.heartRate < 55 ||
      latestVital.heartRate > 105 ||
      latestVital.systolicBp > 135 ||
      latestVital.diastolicBp > 90 ||
      latestVital.spo2 < 95);

  const stepPercent = Math.min(100, Math.round((todayActivity.steps / (personalGoals.dailySteps || 8000)) * 100));
  const activeReminders = reminders.filter((r) => r.isActive).slice(0, 4);
  const recentNotes = healthNotes.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. UNIQUE FEATURE – TODAY AT A GLANCE */}
      <TodayAtAGlance onNavigate={onNavigate} />

      {/* Reading Alert Banner (Non-diagnostic alert) */}
      {hasReadingAlert && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/50 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {t.reviewReadingPrompt}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                {t.statusAttentionRequired}
              </span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              {t.reviewReadingNote} (HR: {latestVital?.heartRate} BPM, BP: {latestVital?.systolicBp}/{latestVital?.diastolicBp} mmHg).
            </p>
          </div>
        </div>
      )}

      {/* 2. Daily Health Score Hero */}
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
                {t.appName} AI Copilot
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

      {/* 3. Vitals Grid (6 Clinical & Activity Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Heart Rate */}
        <VitalCard
          title={t.heartRate}
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
          title={t.bloodPressure}
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
          title={t.spo2}
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
          title={t.temperature}
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
          title={t.steps}
          value={todayActivity.steps.toLocaleString()}
          unit={`/ ${(personalGoals.dailySteps || 8000).toLocaleString()}`}
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
          title={t.sleepMetric}
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

      {/* 4. Weekly Trends Chart & Quick Navigation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          <WeeklyHealthChart />

          {/* Quick Shortcuts Grid (Calendar, Goals, Notes, Reminders) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigate("calendar")}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t.calendar}</div>
              <div className="text-[10px] text-slate-400">Monthly logs</div>
            </button>

            <button
              onClick={() => onNavigate("goals")}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t.goals}</div>
              <div className="text-[10px] text-slate-400">5 Daily targets</div>
            </button>

            <button
              onClick={() => onNavigate("notes")}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t.notes}</div>
              <div className="text-[10px] text-slate-400">Observations</div>
            </button>

            <button
              onClick={() => onNavigate("reports")}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-fit mb-2 group-hover:scale-110 transition-transform">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{t.reports}</div>
              <div className="text-[10px] text-slate-400">Medical summary</div>
            </button>
          </div>
        </div>

        {/* Right (1 col): Hydration Station & Today's Schedule */}
        <div className="space-y-6">
          {/* Hydration Interactive Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
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
                    Daily Goal: {personalGoals.dailyWaterMl} ml
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                {waterIntakeTodayMl} ml
              </span>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: "+250 ml", amount: 250 },
                { label: "+500 ml", amount: 500 },
                { label: "+750 ml", amount: 750 },
              ].map((btn) => (
                <button
                  key={btn.amount}
                  onClick={() => logWater(btn.amount)}
                  className="py-2 px-3 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Care Reminders */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.reminders}
                  </h4>
                  <p className="text-[11px] text-slate-400">Scheduled checks & meds</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate("reminders")}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {activeReminders.map((rem) => {
                const todayStr = new Date().toISOString().split("T")[0];
                const isCompleted = rem.lastTakenDate === todayStr;

                return (
                  <div
                    key={rem.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isCompleted
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40"
                        : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rem.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                          {rem.time}
                        </span>
                      </div>
                      {rem.dosageOrDetail && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{rem.dosageOrDetail}</p>
                      )}
                    </div>

                    <button
                      onClick={() => markReminderTaken(rem.id)}
                      className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reading Modal */}
      <AddReadingModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
      />
    </div>
  );
}
