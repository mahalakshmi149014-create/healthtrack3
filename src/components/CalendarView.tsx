"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Pill,
  Footprints,
  Droplet,
  Moon,
  Activity,
  Heart,
  Clock,
  Sparkles,
} from "lucide-react";

export function CalendarView() {
  const { vitals, activities, sleepData, reminders, t } = useHealth();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // First day of month and days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Find records for a given date
  const getDayData = (dateStr: string) => {
    const dayVitals = vitals.filter((v) => v.timestamp.startsWith(dateStr));
    const dayActivity = activities.find((a) => a.date === dateStr);
    const daySleep = sleepData.find((s) => s.date === dateStr);
    const hasMedCompleted = reminders.some((r) => r.lastTakenDate === dateStr);

    return {
      hasVitals: dayVitals.length > 0,
      vitals: dayVitals,
      activity: dayActivity,
      sleep: daySleep,
      hasMedCompleted,
    };
  };

  const selectedData = getDayData(selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.healthCalendar}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.calendarSubtitle}
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-3">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Calendar Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-slate-50/40 dark:bg-slate-900/30" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedDay = String(dayNum).padStart(2, "0");
              const formattedMonth = String(month + 1).padStart(2, "0");
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const data = getDayData(dateStr);
              const isSelected = selectedDateStr === dateStr;
              const isToday = new Date().toISOString().split("T")[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`relative h-16 sm:h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-sky-500/20 shadow-md"
                      : isToday
                      ? "border-emerald-500/60 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? "text-sky-600 dark:text-sky-400"
                          : isToday
                          ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  {/* Badges / indicators */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {data.hasVitals && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="Vitals Logged" />
                    )}
                    {data.activity && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Activity Done" />
                    )}
                    {data.sleep && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500" title="Sleep Logged" />
                    )}
                    {data.hasMedCompleted && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Medication Taken" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Vitals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Activity / Workout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Sleep</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Medication / Habit</span>
            </div>
          </div>
        </div>

        {/* Right Details Panel for Selected Date */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.daySummary}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(selectedDateStr + "T00:00:00").toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                <CalendarIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Vitals breakdown */}
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {t.heartRate} & BP
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedData.hasVitals ? "Recorded" : "No record"}
                  </span>
                </div>
                {selectedData.hasVitals ? (
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      HR: <span className="font-bold">{selectedData.vitals[0].heartRate} BPM</span> • SpO₂:{" "}
                      <span className="font-bold">{selectedData.vitals[0].spo2}%</span>
                    </div>
                    <div>
                      BP:{" "}
                      <span className="font-bold">
                        {selectedData.vitals[0].systolicBp}/{selectedData.vitals[0].diastolicBp} mmHg
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">{t.noDataForDate}</p>
                )}
              </div>

              {/* Activity breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5 text-emerald-500" />
                    {t.steps} & Activity
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {selectedData.activity ? `${selectedData.activity.steps.toLocaleString()} steps` : "0 steps"}
                  </span>
                </div>
                {selectedData.activity ? (
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div>
                      Active: <span className="font-bold">{selectedData.activity.activeMinutes} min</span> • Calories:{" "}
                      <span className="font-bold">{selectedData.activity.caloriesBurned} kcal</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">No workout or step logs for this day.</p>
                )}
              </div>

              {/* Sleep breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    {t.sleepMetric}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedData.sleep ? `${selectedData.sleep.totalHours} hrs` : "No sleep log"}
                  </span>
                </div>
                {selectedData.sleep && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Bedtime: {selectedData.sleep.bedtime} • Wake: {selectedData.sleep.wakeTime} (Score:{" "}
                    {selectedData.sleep.qualityScore}/100)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Select any date from the calendar to inspect historical vital trends and habit completions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
