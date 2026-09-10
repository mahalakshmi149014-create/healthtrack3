"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Activity, Plus } from "lucide-react";
import { AddReadingModal } from "./AddReadingModal";

export function WeeklyHealthChart() {
  const { vitals, darkMode } = useHealth();
  const [metricMode, setMetricMode] = useState<"cardio" | "bp" | "wellness">("cardio");
  const [showAddModal, setShowAddModal] = useState(false);

  // Format data for chart
  const chartData = [...vitals]
    .reverse()
    .slice(-7)
    .map((v) => {
      const date = new Date(v.timestamp);
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day: dayLabel,
        time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        heartRate: v.heartRate,
        systolic: v.systolicBp,
        diastolic: v.diastolicBp,
        spo2: v.spo2,
        temperature: v.temperature,
      };
    });

  const gridColor = darkMode ? "rgba(51, 65, 85, 0.4)" : "rgba(226, 232, 240, 0.8)";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              Clinical Trends & Progression
            </h3>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Longitudinal heart rate variability, blood pressure curve, and oxygen saturation
          </p>
        </div>

        {/* Metric Segmented Control */}
        <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setMetricMode("cardio")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              metricMode === "cardio"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setMetricMode("bp")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              metricMode === "bp"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setMetricMode("wellness")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              metricMode === "wellness"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            SpO₂ & Temp
          </button>
        </div>
      </div>

      {/* Interactive Recharts Graph */}
      {vitals.length === 0 ? (
        <div className="h-72 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
          <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
            No vitals recorded yet
          </h4>
          <p className="text-[11px] text-slate-400 max-w-xs mt-1 mb-3">
            Add your first resting heart rate and blood pressure reading to start tracking your clinical trend lines.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Log First Reading
          </button>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === "cardio" ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hrGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis domain={[50, 120]} stroke={textColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    borderColor: darkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#hrGrad)"
                />
              </AreaChart>
            ) : metricMode === "bp" ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis domain={[60, 160]} stroke={textColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    borderColor: darkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP (mmHg)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0284c7", strokeWidth: 2, stroke: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic BP (mmHg)"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0d9488", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" domain={[90, 100]} stroke="#06b6d4" fontSize={12} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[96, 104]} stroke="#f59e0b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                    borderColor: darkMode ? "#334155" : "#e2e8f0",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="spo2"
                  name="SpO₂ (%)"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  name="Temp (°F)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Add Reading Modal */}
      <AddReadingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
