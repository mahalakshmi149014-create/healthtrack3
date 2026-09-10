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
} from "lucide-react";
import { AddReadingModal } from "./AddReadingModal";

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTab: string;
}

export function Header({ onToggleSidebar, activeTab }: HeaderProps) {
  const {
    profile,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    todayActivity,
    waterIntakeTodayMl,
    logout,
  } = useHealth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabTitles: Record<string, string> = {
    dashboard: "Health Dashboard",
    assistant: "AI Health Assistant & Copilot",
    metrics: "Clinical Metrics & Vitals",
    activity: "Activity & Fitness",
    sleep: "Sleep & Recovery",
    hydration: "Hydration Intelligence",
    nutrition: "Nutrition & Macronutrients",
    wellness: "Mental Wellness & Recovery",
    reminders: "Medication & Care Reminders",
    reports: "Health Reports & Summaries",
    profile: "Health Profile & Emergency Contacts",
    settings: "System Preferences",
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 transition-all duration-200">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {tabTitles[activeTab] || "HealthTrack"}
            </h1>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">
              {profile.name} • {profile.role} Monitoring Overview
            </p>
          </div>
        </div>

        {/* Search Bar & Global Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search metrics, meds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 focus:border-sky-500 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Quick Add Reading Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Reading</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Notifications & Alerts
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-black rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new health alerts or reminders
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                          n.isRead
                            ? "bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 text-slate-500 opacity-70"
                            : "bg-sky-50/70 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/40 text-slate-800 dark:text-slate-200 font-medium"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-[11px]">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Logout Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.name.charAt(0)}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Add Reading Modal */}
      <AddReadingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}
