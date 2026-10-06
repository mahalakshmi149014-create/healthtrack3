"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Footprints,
  Moon,
  Bot,
  FileBarChart2,
  BellRing,
  UserCheck,
  Settings,
  ShieldAlert,
  HeartPulse,
  Sparkles,
  Droplets,
  Utensils,
  Brain,
  ChevronRight,
  Calendar,
  Target,
  FileText,
} from "lucide-react";
import { useHealth } from "@/context/HealthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { healthScoreData, waterIntakeTodayMl, profile, reminders, t } = useHealth();

  const activeRemindersCount = reminders.filter((r) => r.isActive).length;

  const navigationItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard, badge: null },
    { id: "calendar", label: t.calendar, icon: Calendar, badge: null },
    { id: "goals", label: t.goals, icon: Target, badge: null },
    { id: "notes", label: t.notes, icon: FileText, badge: null },
    { id: "assistant", label: t.assistant, icon: Bot, badge: "AI" },
    { id: "metrics", label: t.metrics, icon: Activity, badge: null },
    { id: "activity", label: t.activity, icon: Footprints, badge: null },
    { id: "sleep", label: t.sleepMetric, icon: Moon, badge: null },
    { id: "hydration", label: t.hydration, icon: Droplets, badge: null },
    { id: "nutrition", label: t.nutrition, icon: Utensils, badge: null },
    { id: "wellness", label: t.wellness, icon: Brain, badge: null },
    { id: "reminders", label: t.reminders, icon: BellRing, badge: activeRemindersCount > 0 ? String(activeRemindersCount) : null },
    { id: "reports", label: t.reports, icon: FileBarChart2, badge: null },
    { id: "profile", label: t.profile, icon: UserCheck, badge: null },
    { id: "settings", label: t.settings, icon: Settings, badge: null },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Health<span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">Track</span>
                </span>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50 tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Score Snapshot Box */}
          <div className="mx-4 my-3 p-3.5 rounded-2xl bg-gradient-to-br from-sky-50/80 via-teal-50/30 to-slate-50/80 dark:from-sky-950/40 dark:via-teal-950/20 dark:to-slate-900 border border-sky-100 dark:border-sky-900/40 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.todaysHealthScore}
                </span>
              </div>
              <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                {healthScoreData.overallScore}/100
              </span>
            </div>
            <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-teal-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${healthScoreData.overallScore}%` }}
              />
            </div>
          </div>

          {/* Navigation Links (Scrollable for compact screens) */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 custom-scrollbar">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md shadow-sky-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Demographics Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
          <div
            onClick={() => handleSelect("profile")}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-100 dark:border-slate-700/50"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
              {profile.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{profile.role}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
