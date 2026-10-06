"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  Plus,
  HeartPulse,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  Check,
  Flame,
  Droplet,
  Globe,
  Calendar as CalendarIcon,
  Target,
  FileText,
} from "lucide-react";
import { AddReadingModal } from "./AddReadingModal";
import { SUPPORTED_LANGUAGES } from "@/data/translations";

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: string;
}

export function Header({ onToggleSidebar, activeTab }: HeaderProps) {
  const {
    profile,
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    todayActivity,
    waterIntakeTodayMl,
    logout,
    t,
  } = useHealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabTitles: Record<string, string> = {
    dashboard: t.dashboard,
    calendar: t.healthCalendar,
    goals: t.personalGoals,
    notes: t.healthNotes,
    assistant: t.assistant,
    metrics: t.metrics,
    activity: t.activity,
    sleep: t.sleepMetric,
    hydration: t.hydration,
    nutrition: t.nutrition,
    wellness: t.wellness,
    reminders: t.reminders,
    reports: t.reports,
    profile: t.profile,
    settings: t.settings,
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-all duration-200">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {tabTitles[activeTab] || t.appName}
            </h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">
              {profile.name} • {profile.role}
            </p>
          </div>
        </div>

        {/* Search Bar & Global Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Badge in Header */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="dark:bg-slate-900 text-slate-800 dark:text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Reading Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addReading}</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications & Alerts
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No new notifications or reading alerts.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.isRead
                            ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-70"
                            : "bg-sky-50/40 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-800/50"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[10px] font-normal text-slate-400 shrink-0 ml-2">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Logout Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white font-black text-xs">
                {profile.name.charAt(0)}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
                </div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AddReadingModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
