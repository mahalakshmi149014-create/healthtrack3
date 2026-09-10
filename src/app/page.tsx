"use client";

import React, { useState, useEffect } from "react";
import { useHealth, HealthProvider } from "@/context/HealthContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { MetricsView } from "@/components/MetricsView";
import { ActivityView } from "@/components/ActivityView";
import { SleepView } from "@/components/SleepView";
import { RemindersView } from "@/components/RemindersView";
import { ReportsView } from "@/components/ReportsView";
import { ProfileView } from "@/components/ProfileView";
import { SettingsView } from "@/components/SettingsView";
import { LandingPageView } from "@/components/LandingPageView";
import { AIAssistantView } from "@/components/AIAssistantView";
import { HydrationView } from "@/components/HydrationView";
import { NutritionView } from "@/components/NutritionView";
import { MentalWellnessView } from "@/components/MentalWellnessView";
import { ToastContainer } from "@/components/ToastContainer";
import { MedicalDisclaimerBanner } from "@/components/MedicalDisclaimer";

function MainApp() {
  const { isAuthenticated } = useHealth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const validTabs = [
    "dashboard",
    "assistant",
    "metrics",
    "activity",
    "sleep",
    "hydration",
    "nutrition",
    "wellness",
    "reminders",
    "reports",
    "profile",
    "settings",
  ];

  // Sync with URL hash if present
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && validTabs.includes(hash)) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      if (currentHash && validTabs.includes(currentHash)) {
        setActiveTab(currentHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPageView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Universal Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <Header
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            activeTab={activeTab}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {activeTab === "dashboard" && <DashboardView onNavigate={handleTabChange} />}
            {activeTab === "assistant" && <AIAssistantView />}
            {activeTab === "metrics" && <MetricsView />}
            {activeTab === "activity" && <ActivityView />}
            {activeTab === "sleep" && <SleepView />}
            {activeTab === "hydration" && <HydrationView />}
            {activeTab === "nutrition" && <NutritionView />}
            {activeTab === "wellness" && <MentalWellnessView />}
            {activeTab === "reminders" && <RemindersView />}
            {activeTab === "reports" && <ReportsView />}
            {activeTab === "profile" && <ProfileView />}
            {activeTab === "settings" && <SettingsView />}
          </main>

          {/* Persistent Footer */}
          <footer className="mt-auto px-6 py-6 border-t border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs text-slate-500 dark:text-slate-400 text-center">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                <strong>HealthTrack</strong> • Modern Health & Vitals Monitoring for Students & General Users
              </p>
              <p className="text-[11px] text-slate-400">
                Sample Data Only — Not Medical Advice or Diagnosis.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* Toast Notification Mount */}
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <HealthProvider>
      <MainApp />
    </HealthProvider>
  );
}
