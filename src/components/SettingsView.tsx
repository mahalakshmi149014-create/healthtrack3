"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Settings,
  Moon,
  Sun,
  Laptop,
  RotateCcw,
  Shield,
  Smartphone,
  CheckCircle2,
  Database,
  Trash2,
  Sparkles,
  Globe,
  Lock,
  UserCheck,
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/data/translations";

export function SettingsView() {
  const {
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    resetAllDataToDefaults,
    resetWater,
    showToast,
    profile,
    t,
  } = useHealth();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t.settings}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage language selection, light/dark themes, goals configuration, and cloud privacy
        </p>
      </div>

      {/* 1. Language Options */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.selectLanguage}
            </h3>
            <p className="text-xs text-slate-400">
              Select your preferred interface language across the entire application
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                language === lang.code
                  ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 ring-2 ring-sky-500/20 shadow-xs"
                  : "border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang.nativeName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang.name}</div>
              </div>
              {language === lang.code && (
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interface & Visual Theme (Light, Dark, System) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          {t.themeMode}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Choose Light Mode, Dark Mode, or match your System Default
        </p>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setThemeMode("light")}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
              themeMode === "light"
                ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 ring-2 ring-sky-500/20"
                : "border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.lightMode}
            </span>
          </button>

          <button
            onClick={() => setThemeMode("dark")}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
              themeMode === "dark"
                ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 ring-2 ring-sky-500/20"
                : "border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.darkMode}
            </span>
          </button>

          <button
            onClick={() => setThemeMode("system")}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
              themeMode === "system"
                ? "border-sky-500 bg-sky-50/60 dark:bg-sky-950/50 ring-2 ring-sky-500/20"
                : "border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Laptop className="w-5 h-5 text-teal-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t.systemMode}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Privacy & Security */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Privacy & Authentication
            </h3>
            <p className="text-xs text-slate-400">
              Supabase authentication & encrypted local sandbox
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Logged in as:
            </span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Data Isolation:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Protected User Sandbox
            </span>
          </div>
        </div>
      </div>

      {/* 4. Sensor & Factory Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-rose-950 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">
          Reset Health Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Restore default simulated clinical vitals readings, student schedule, and reminder items.
        </p>
        <button
          onClick={resetAllDataToDefaults}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Health Data to Mock Defaults
        </button>
      </div>
    </div>
  );
}
