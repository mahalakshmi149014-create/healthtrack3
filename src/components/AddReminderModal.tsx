"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  X,
  Bell,
  Clock,
  Calendar,
  Pill,
  Droplet,
  Dumbbell,
  Stethoscope,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { ReminderItem } from "@/types/health";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ReminderItem["category"];
}

export function AddReminderModal({ isOpen, onClose, defaultCategory = "Medicine" }: AddReminderModalProps) {
  const { addReminder } = useHealth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ReminderItem["category"]>(defaultCategory);
  const [time, setTime] = useState("08:00 AM");
  const [dosageOrDetail, setDosageOrDetail] = useState("");
  const [frequency, setFrequency] = useState<ReminderItem["frequency"]>("Daily");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for the reminder.");
      return;
    }

    addReminder({
      title: title.trim(),
      category,
      time,
      dosageOrDetail: dosageOrDetail.trim() || undefined,
      frequency,
    });

    setTitle("");
    setDosageOrDetail("");
    setError("");
    onClose();
  };

  const categories: { label: ReminderItem["category"]; icon: typeof Pill; color: string }[] = [
    { label: "Medicine", icon: Pill, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40" },
    { label: "Water", icon: Droplet, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40" },
    { label: "Exercise", icon: Dumbbell, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Checkup", icon: Stethoscope, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40" },
    { label: "Sleep", icon: Moon, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Create Health Reminder
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Never miss your medicine, hydration, or checkup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Reminder Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${cat.color.split(" ")[0]}`} />
                    <span className="text-[11px] truncate w-full text-center">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Title */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Title / Activity Name
            </label>
            <input
              type="text"
              placeholder="e.g., Vitamin D3, 500ml Water, Evening Walk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
              required
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Time & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Time
              </label>
              <input
                type="text"
                value={time}
                placeholder="08:00 AM"
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ReminderItem["frequency"])}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
              >
                <option value="Daily">Daily</option>
                <option value="Weekdays">Weekdays (Mon-Fri)</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>
          </div>

          {/* Dosage or Instructions */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Dosage or Specific Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 1 Tablet after food, with full glass of water"
              value={dosageOrDetail}
              onChange={(e) => setDosageOrDetail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
