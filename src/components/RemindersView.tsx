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
  Sparkles,
} from "lucide-react";
import { AddReminderModal } from "./AddReminderModal";
import { ReminderItem } from "@/types/health";

export function RemindersView() {
  const { reminders, toggleReminder, markReminderTaken, deleteReminder, t } = useHealth();
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
            {t.reminders}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Smart automated alerts for medications, water intake, workouts, sleep, and custom schedules
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t.addReminder}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        {[
          { id: "all", label: "All Reminders" },
          { id: "medicine", label: t.medicineReminders },
          { id: "water", label: t.waterReminders },
          { id: "exercise", label: t.exerciseReminders },
          { id: "sleep", label: t.sleepReminders },
          { id: "checkup", label: t.customReminders },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
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
          <div className="col-span-full p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <BellRing className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              No reminders in this category. Click &ldquo;Add Reminder&rdquo; to create one.
            </p>
          </div>
        ) : (
          filteredReminders.map((reminder) => {
            const isCompletedToday = reminder.lastTakenDate === todayStr;

            return (
              <div
                key={reminder.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isCompletedToday
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/40"
                    : reminder.isActive
                    ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs"
                    : "bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/40 dark:border-slate-800/40 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 mt-0.5">
                      {getCategoryIcon(reminder.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {reminder.title}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {reminder.frequency}
                        </span>
                      </div>

                      {reminder.dosageOrDetail && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {reminder.dosageOrDetail}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          {reminder.time}
                        </span>
                        <span>•</span>
                        <span>{reminder.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => markReminderTaken(reminder.id)}
                      title="Mark as completed today"
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCompletedToday
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddReminderModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
