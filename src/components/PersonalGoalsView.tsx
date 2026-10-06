"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Target,
  Footprints,
  Droplet,
  Moon,
  Dumbbell,
  Flame,
  CheckCircle2,
  Edit3,
  Save,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function PersonalGoalsView() {
  const { personalGoals, updatePersonalGoals, activities, todayActivity, waterIntakeTodayMl, latestSleep, darkMode, t } = useHealth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dailySteps: personalGoals.dailySteps,
    dailyWaterMl: personalGoals.dailyWaterMl,
    dailySleepHours: personalGoals.dailySleepHours,
    dailyWorkoutMinutes: personalGoals.dailyWorkoutMinutes,
    dailyActiveCalories: personalGoals.dailyActiveCalories,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalGoals({
      dailySteps: Number(formData.dailySteps),
      dailyWaterMl: Number(formData.dailyWaterMl),
      dailySleepHours: Number(formData.dailySleepHours),
      dailyWorkoutMinutes: Number(formData.dailyWorkoutMinutes),
      dailyActiveCalories: Number(formData.dailyActiveCalories),
    });
    setIsEditing(false);
  };

  // Daily progress computations
  const stepPercent = Math.min(100, Math.round(((todayActivity.steps || 6842) / (personalGoals.dailySteps || 8000)) * 100));
  const waterPercent = Math.min(100, Math.round((waterIntakeTodayMl / (personalGoals.dailyWaterMl || 2500)) * 100));
  const sleepPercent = Math.min(100, Math.round(((latestSleep?.totalHours || 7.33) / (personalGoals.dailySleepHours || 8)) * 100));
  const workoutPercent = Math.min(100, Math.round(((todayActivity.activeMinutes || 30) / (personalGoals.dailyWorkoutMinutes || 30)) * 100));
  const caloriePercent = Math.min(100, Math.round(((todayActivity.caloriesBurned || 420) / (personalGoals.dailyActiveCalories || 500)) * 100));

  // Weekly Goal Trend Data
  const weeklyData = [...activities].slice(0, 7).reverse().map((act) => ({
    day: new Date(act.date).toLocaleDateString("en-US", { weekday: "short" }),
    steps: act.steps,
    stepTarget: personalGoals.dailySteps,
    calories: act.caloriesBurned,
    calTarget: personalGoals.dailyActiveCalories,
  }));

  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.personalGoals}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure personalized wellness targets and monitor daily and weekly progress
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? t.cancel : t.editGoals}
        </button>
      </div>

      {/* Goal Edit Form Modal/Section */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.editGoals}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.dailyStepsGoal} (steps)
              </label>
              <input
                type="number"
                value={formData.dailySteps}
                onChange={(e) => setFormData({ ...formData, dailySteps: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.waterIntakeGoal} (ml)
              </label>
              <input
                type="number"
                value={formData.dailyWaterMl}
                onChange={(e) => setFormData({ ...formData, dailyWaterMl: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.sleepGoal} (hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.dailySleepHours}
                onChange={(e) => setFormData({ ...formData, dailySleepHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.workoutMinutesGoal} (min)
              </label>
              <input
                type="number"
                value={formData.dailyWorkoutMinutes}
                onChange={(e) => setFormData({ ...formData, dailyWorkoutMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.activeCaloriesGoal} (kcal)
              </label>
              <input
                type="number"
                value={formData.dailyActiveCalories}
                onChange={(e) => setFormData({ ...formData, dailyActiveCalories: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {t.saveGoals}
            </button>
          </div>
        </form>
      )}

      {/* 5 Core Health Goals Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Steps Goal */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.dailyStepsGoal}
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(todayActivity.steps || 6842).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              / {personalGoals.dailySteps.toLocaleString()} steps
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>{t.dailyProgress}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{stepPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-700" style={{ width: `${stepPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 2. Water Intake Goal */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.waterIntakeGoal}
              </span>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {waterIntakeTodayMl}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              / {personalGoals.dailyWaterMl} ml
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>{t.dailyProgress}</span>
              <span className="text-sky-600 dark:text-sky-400">{waterPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-sky-500 h-2 rounded-full transition-all duration-700" style={{ width: `${waterPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 3. Sleep Goal */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.sleepGoal}
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {latestSleep ? latestSleep.totalHours : 7.3}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              / {personalGoals.dailySleepHours} hours
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>{t.dailyProgress}</span>
              <span className="text-indigo-600 dark:text-indigo-400">{sleepPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-700" style={{ width: `${sleepPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 4. Workout Minutes Goal */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.workoutMinutesGoal}
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {todayActivity.activeMinutes || 30}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              / {personalGoals.dailyWorkoutMinutes} mins
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>{t.dailyProgress}</span>
              <span className="text-amber-600 dark:text-amber-400">{workoutPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full transition-all duration-700" style={{ width: `${workoutPercent}%` }} />
            </div>
          </div>
        </div>

        {/* 5. Active Calories Goal */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.activeCaloriesGoal}
              </span>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {todayActivity.caloriesBurned || 420}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              / {personalGoals.dailyActiveCalories} kcal
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>{t.dailyProgress}</span>
              <span className="text-rose-600 dark:text-rose-400">{caloriePercent}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-rose-500 h-2 rounded-full transition-all duration-700" style={{ width: `${caloriePercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal Analytics Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.weeklyProgress}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of daily steps achieved vs your target {personalGoals.dailySteps.toLocaleString()} steps
            </p>
          </div>
          <span className="px-3 py-1 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl text-xs font-bold">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                  borderColor: darkMode ? "#334155" : "#cbd5e1",
                  borderRadius: "1rem",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="steps" fill="#10b981" radius={[6, 6, 0, 0]} name="Steps Achieved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
