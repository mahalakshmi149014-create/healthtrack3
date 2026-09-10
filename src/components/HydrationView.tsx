"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Droplets,
  Droplet,
  RotateCcw,
  Sparkles,
  Clock,
  CupSoda,
  Coffee,
  Heart,
  TrendingUp,
} from "lucide-react";
import { HydrationLogItem } from "@/types/health";

export function HydrationView() {
  const { waterIntakeTodayMl, logWater, resetWater, profile, hydrationLogs } = useHealth();
  const [customAmount, setCustomAmount] = useState<string>("");
  const [beverageType, setBeverageType] = useState<HydrationLogItem["beverageType"]>("Water");

  const dailyGoal = profile.dailyWaterGoalMl || 2800;
  const percentage = Math.min(100, Math.round((waterIntakeTodayMl / dailyGoal) * 100));
  const remainingMl = Math.max(0, dailyGoal - waterIntakeTodayMl);

  const presets = [
    { label: "+250 ml Glass", amount: 250, icon: Droplet },
    { label: "+350 ml Mug", amount: 350, icon: Coffee },
    { label: "+500 ml Bottle", amount: 500, icon: Droplets },
    { label: "+750 ml Sports Flask", amount: 750, icon: CupSoda },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customAmount, 10);
    if (!isNaN(parsed) && parsed > 0) {
      logWater(parsed, beverageType);
      setCustomAmount("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-500" />
            Hydration Intelligence & Fluid Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintain optimal cognitive alertness, cellular hydration, and cardiovascular preload
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetWater}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Today
          </button>
        </div>
      </div>

      {/* Main Hydration Hero Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Water Level Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-sky-500 via-sky-600 to-cyan-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs uppercase font-black tracking-widest text-sky-100">
              Daily Target Gauge
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold text-white">
              {percentage}% Achieved
            </span>
          </div>

          <div className="relative z-10 text-center my-auto py-6">
            <div className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-md">
              {(waterIntakeTodayMl / 1000).toFixed(2)}
              <span className="text-2xl font-bold text-sky-100 ml-1">L</span>
            </div>
            <p className="text-xs text-sky-100/90 font-medium mt-1">
              Target: {(dailyGoal / 1000).toFixed(2)} L ({remainingMl} ml remaining)
            </p>
          </div>

          {/* Progress Bar & Status */}
          <div className="relative z-10 space-y-2">
            <div className="w-full bg-white/25 rounded-full h-3 overflow-hidden backdrop-blur-xs p-0.5">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-sky-100 font-semibold">
              <span>0 ml</span>
              <span>{percentage >= 100 ? "Goal Reached! 💧🎉" : `${dailyGoal} ml Target`}</span>
            </div>
          </div>
        </div>

        {/* Quick Log Presets & Beverage Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              Quick Fluid Presets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.label}
                    onClick={() => logWater(p.amount, beverageType)}
                    className="p-4 rounded-2xl bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 border border-sky-100 dark:border-sky-800/60 text-slate-800 dark:text-slate-200 transition-all hover:scale-[1.02] flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                  >
                    <div className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomSubmit} className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-48">
                <select
                  value={beverageType}
                  onChange={(e) => setBeverageType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="Water">💧 Pure Water</option>
                  <option value="Electrolyte">⚡ Electrolyte Mix</option>
                  <option value="Tea">🍵 Herbal Tea</option>
                  <option value="Coffee">☕ Coffee</option>
                  <option value="Juice">🥤 Fresh Juice</option>
                </select>
              </div>

              <div className="w-full flex-1 relative">
                <input
                  type="number"
                  placeholder="Custom amount (ml)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  min="50"
                  max="3000"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer shrink-0"
              >
                + Log Entry
              </button>
            </form>
          </div>

          {/* Hydration Benefits / Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Hydration Streak</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">5 consecutive days at 100%+ goal</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cognitive & Vitals Impact</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Resting HR lowered by ~3 BPM during optimal hydration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Hydration Logs List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Today&apos;s Fluid Intake Chronology
        </h3>

        {hydrationLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No fluids logged today yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {hydrationLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {log.beverageType}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                  +{log.amountMl} ml
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
