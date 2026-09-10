"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Settings,
  Moon,
  Sun,
  RotateCcw,
  Shield,
  Smartphone,
  CheckCircle2,
  Database,
  Trash2,
  Sparkles,
} from "lucide-react";

export function SettingsView() {
  const {
    darkMode,
    toggleDarkMode,
    resetAllDataToDefaults,
    resetWater,
    showToast,
    profile,
  } = useHealth();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          System Preferences & Configuration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage visual appearance, notification rules, data caching, and privacy settings
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Interface & Visual Theme
        </h3>
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Night Mode / Clinical Dark Palette
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Low-strain dark slate theme for evening study or low-light monitoring
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
              darkMode
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? "Dark Mode Active" : "Light Mode Active"}
          </button>
        </div>
      </div>

      {/* Sensor & Data Sync */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Device & Data Synchronization
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Browser Local Storage Persistence
              </p>
              <p className="text-[11px] text-slate-400">
                All logs, profile updates, and reminders automatically persist in your local browser sandbox.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold text-[11px]">
              Active & Encrypted
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Clear Hydration Log for Today
              </p>
              <p className="text-[11px] text-slate-400">
                Reset daily water tracker back to 0 ml
              </p>
            </div>
            <button
              onClick={() => {
                resetWater();
                showToast({ type: "info", title: "Water Reset", message: "Today's hydration counter reset to 0 ml." });
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors"
            >
              Reset Hydration
            </button>
          </div>
        </div>
      </div>

      {/* Factory Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/80 dark:border-rose-950 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">
          Factory Reset Sample Dataset
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Restore default simulated clinical vitals readings, student schedule, and reminder items.
        </p>
        <button
          onClick={resetAllDataToDefaults}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Health Data to Mock Defaults
        </button>
      </div>
    </div>
  );
}
