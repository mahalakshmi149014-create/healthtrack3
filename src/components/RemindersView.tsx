"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  BellRing,
  Pill,
  Droplet,
  Dumbbell,
  Stethoscope,
  Moon,
  Plus,
  CheckCircle2,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { AddReminderModal } from "./AddReminderModal";
import { ReminderItem } from "@/types/health";

export function RemindersView() {
  const { reminders, toggleReminder, markReminderTaken, deleteReminder } = useHealth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const todayStr = new Date().toISOString().split("T")[0];

  const filteredReminders = reminders.filter((r) => {
    if (activeCategory === "all") return true;
    return r.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const getCategoryIcon = (category: ReminderItem["category"]) => {
    switch (category) {
      case "Medicine":
        return <Pill className="w-4 h-4 text-rose-500" />;
      case "Water":
        return <Droplet className="w-4 h-4 text-cyan-500" />;
      case "Exercise":
        return <Dumbbell className="w-4 h-4 text-emerald-500" />;
      case "Checkup":
        return <Stethoscope className="w-4 h-4 text-indigo-500" />;
      case "Sleep":
        return <Moon className="w-4 h-4 text-purple-500" />;
      default:
        return <BellRing className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Care Schedules & Health Reminders
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated alerts for medications, hydration checkpoints, workouts, and doctor checkups
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Care Reminder
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        {[
          { id: "all", label: "All Reminders" },
          { id: "medicine", label: "Medication & Supplements" },
          { id: "water", label: "Hydration" },
          { id: "exercise", label: "Workouts" },
          { id: "checkup", label: "Doctor Checkups" },
          { id: "sleep", label: "Sleep Rest" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeCategory === tab.id
                ? "bg-sky-600 text-white font-semibold shadow-xs shadow-sky-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReminders.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <BellRing className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No reminders scheduled for this category.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Add Care Reminder&quot; above to create recurring medicine or activity alarms.
            </p>
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const isTakenToday = rem.lastTakenDate === todayStr;
            return (
              <div
                key={rem.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isTakenToday
                    ? "border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/20 dark:bg-emerald-950/10"
                    : "border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div>
                  {/* Top bar with Category icon & Toggle switch */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {getCategoryIcon(rem.category)}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {rem.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active toggle */}
                      <button
                        onClick={() => toggleReminder(rem.id)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                          rem.isActive
                            ? "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                        }`}
                      >
                        {rem.isActive ? "Active" : "Paused"}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteReminder(rem.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Instructions */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rem.title}
                  </h3>
                  {rem.dosageOrDetail && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {rem.dosageOrDetail}
                    </p>
                  )}

                  {/* Meta details */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-500" />
                      {rem.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {rem.frequency}
                    </span>
                  </div>
                </div>

                {/* Bottom Action: Mark Done / Taken */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isTakenToday ? "✓ Completed for today" : "Pending action"}
                  </span>
                  <button
                    onClick={() => markReminderTaken(rem.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isTakenToday
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isTakenToday ? "Mark as Pending" : "Mark as Completed"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
