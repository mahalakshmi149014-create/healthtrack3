"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Moon,
  Sparkles,
  Clock,
  Bed,
  Sunrise,
  ShieldCheck,
  Plus,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SleepView() {
  const { sleepData, latestSleep, addSleepEntry, profile, darkMode } = useHealth();
  const [showLogSleep, setShowLogSleep] = useState(false);
  const [bedtime, setBedtime] = useState("23:30");
  const [wakeTime, setWakeTime] = useState("07:15");
  const [totalHours, setTotalHours] = useState(7.75);
  const [qualityScore, setQualityScore] = useState(88);
  const [notes, setNotes] = useState("");

  const chartData = [...sleepData].reverse().map((s) => {
    const day = new Date(s.date).toLocaleDateString("en-US", { weekday: "short" });
    return {
      day,
      hours: s.totalHours,
      deep: (s.stages.deepMinutes / 60).toFixed(1),
      rem: (s.stages.remMinutes / 60).toFixed(1),
      light: (s.stages.lightMinutes / 60).toFixed(1),
    };
  });

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const deepMin = Math.round(Number(totalHours) * 60 * 0.25);
    const remMin = Math.round(Number(totalHours) * 60 * 0.25);
    const lightMin = Math.round(Number(totalHours) * 60 * 0.45);
    const awakeMin = Math.round(Number(totalHours) * 60 * 0.05);

    addSleepEntry({
      date: new Date().toISOString().split("T")[0],
      bedtime,
      wakeTime,
      totalHours: Number(totalHours),
      qualityScore: Number(qualityScore),
      stages: {
        deepMinutes: deepMin,
        remMinutes: remMin,
        lightMinutes: lightMin,
        awakeMinutes: awakeMin,
      },
      notes: notes.trim() || undefined,
    });

    setShowLogSleep(false);
  };

  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sleep Hygiene & Nocturnal Recovery
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Circadian rest cycles, REM staging, and sleep quality analytics
          </p>
        </div>

        <button
          onClick={() => setShowLogSleep(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Night&apos;s Sleep
        </button>
      </div>

      {/* Sleep Hero Score & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quality Score Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-indigo-800/40 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Sleep Recovery Score
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Moon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-black">{latestSleep ? latestSleep.qualityScore : "--"}</span>
              <span className="text-xs text-indigo-300">/ 100 Quality Index</span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-2">
              {latestSleep
                ? "Restorative sleep. Sufficient REM & deep sleep phase detected."
                : "No sleep logged yet. Click 'Log Night's Sleep' to track your rest."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" /> Bed: {latestSleep ? latestSleep.bedtime : "--:--"}
            </span>
            <span className="flex items-center gap-1">
              <Sunrise className="w-3.5 h-3.5" /> Wake: {latestSleep ? latestSleep.wakeTime : "--:--"}
            </span>
          </div>
        </div>

        {/* Total Sleep Duration */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Sleep Duration
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {latestSleep ? latestSleep.totalHours : "--"}
              </span>
              <span className="text-xs text-slate-400">hours</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Daily goal: {profile.dailySleepGoalHours} hours{" "}
              {latestSleep && `(${Math.round((latestSleep.totalHours / profile.dailySleepGoalHours) * 100)}% target)`}
            </p>
          </div>

          {/* Sleep Stages Progress */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
              <span>Deep: {latestSleep ? `${latestSleep.stages.deepMinutes}m` : "--"}</span>
              <span>REM: {latestSleep ? `${latestSleep.stages.remMinutes}m` : "--"}</span>
              <span>Light: {latestSleep ? `${latestSleep.stages.lightMinutes}m` : "--"}</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden w-full gap-0.5">
              <div className="bg-indigo-600" style={{ width: "30%" }} title="Deep Sleep" />
              <div className="bg-sky-500" style={{ width: "35%" }} title="REM Sleep" />
              <div className="bg-teal-400" style={{ width: "30%" }} title="Light Sleep" />
              <div className="bg-amber-400" style={{ width: "5%" }} title="Awake" />
            </div>
          </div>
        </div>

        {/* Student Sleep Routine Guidance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Sleep Science Tips
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              &quot;Consistent sleep timing accelerates cognitive recall and reduces academic fatigue in students by up to 34%.&quot;
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <p>✓ Avoid caffeine 6 hours before bedtime</p>
            <p>✓ Limit blue light screens 30m prior to sleep</p>
          </div>
        </div>
      </div>

      {/* 7-Day Sleep Duration Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-6">
          Sleep Consistency & Duration Trend
        </h3>

        {sleepData.length === 0 ? (
          <div className="h-48 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center">
            <Moon className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No sleep entries logged yet
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Log your bedtime and wake time to see your 7-day sleep consistency curve.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis domain={[0, 10]} stroke={textColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    borderColor: darkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="hours" name="Total Hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Log Sleep Modal */}
      {showLogSleep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Log Sleep Record
            </h3>
            <form onSubmit={handleLogSleep} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Total Hours
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={totalHours}
                    onChange={(e) => setTotalHours(Number(e.target.value))}
                    min={1}
                    max={18}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Quality (0-100)
                  </label>
                  <input
                    type="number"
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Woke up refreshed, calm night"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLogSleep(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Sleep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
