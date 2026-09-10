"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Plus,
  Trash2,
  Calendar,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getBpCategory } from "@/utils/healthCalc";
import { AddReadingModal } from "./AddReadingModal";

export function MetricsView() {
  const { vitals, deleteVitalReading } = useHealth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterRange, setFilterRange] = useState<"all" | "7d" | "30d">("all");

  const filteredVitals = vitals.filter((v) => {
    if (filterRange === "all") return true;
    const timeDiffDays = (Date.now() - new Date(v.timestamp).getTime()) / (1000 * 3600 * 24);
    if (filterRange === "7d") return timeDiffDays <= 7;
    if (filterRange === "30d") return timeDiffDays <= 30;
    return true;
  });

  // Calculate Aggregates
  const hrVals = filteredVitals.map((v) => v.heartRate);
  const minHr = hrVals.length ? Math.min(...hrVals) : 0;
  const maxHr = hrVals.length ? Math.max(...hrVals) : 0;
  const avgHr = hrVals.length ? Math.round(hrVals.reduce((a, b) => a + b, 0) / hrVals.length) : 0;

  const sysVals = filteredVitals.map((v) => v.systolicBp);
  const avgSys = sysVals.length ? Math.round(sysVals.reduce((a, b) => a + b, 0) / sysVals.length) : 0;
  const diaVals = filteredVitals.map((v) => v.diastolicBp);
  const avgDia = diaVals.length ? Math.round(diaVals.reduce((a, b) => a + b, 0) / diaVals.length) : 0;

  const spo2Vals = filteredVitals.map((v) => v.spo2);
  const avgSpo2 = spo2Vals.length ? Math.round(spo2Vals.reduce((a, b) => a + b, 0) / spo2Vals.length) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Clinical Health Metrics & Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Detailed longitudinal readings of cardiovascular, hemodynamic, and body temperature metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterRange("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterRange === "all"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterRange("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterRange === "7d"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setFilterRange("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterRange === "30d"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Past 30 Days
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Reading
          </button>
        </div>
      </div>

      {/* Aggregate Stat Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Heart Rate Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Heart Rate Averaging
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{avgHr}</span>
            <span className="text-xs text-slate-400">BPM (Avg)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Min: {minHr} bpm</span>
            <span>Max: {maxHr} bpm</span>
          </div>
        </div>

        {/* Blood Pressure Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-sky-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mean Arterial Pressure
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {avgSys}/{avgDia}
            </span>
            <span className="text-xs text-slate-400">mmHg (Avg)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Systolic Target: &lt;120</span>
            <span>Diastolic: &lt;80</span>
          </div>
        </div>

        {/* SpO2 Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-cyan-500 mb-2">
            <Droplet className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Oxygenation Benchmark
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{avgSpo2}%</span>
            <span className="text-xs text-slate-400">SpO₂ (Avg)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Normal Range: 95-100%</span>
            <span className="text-emerald-500 font-semibold">Optimal</span>
          </div>
        </div>
      </div>

      {/* Clinical Reference Standards Guide */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-500 shrink-0" />
          <span>
            <strong>Reference Range Guidelines (AHA/WHO):</strong> Resting HR: 60-100 bpm | Blood Pressure: &lt;120 / &lt;80 mmHg | SpO₂: &gt;95% | Temp: 97.8°F – 99.1°F.
          </span>
        </div>
      </div>

      {/* Vitals History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recorded Vitals Log History ({filteredVitals.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Heart Rate</th>
                <th className="px-6 py-3">Blood Pressure</th>
                <th className="px-6 py-3">SpO₂ Oxygen</th>
                <th className="px-6 py-3">Body Temp</th>
                <th className="px-6 py-3">Status / Notes</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredVitals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No readings found for the selected time window.
                  </td>
                </tr>
              ) : (
                filteredVitals.map((v) => {
                  const date = new Date(v.timestamp);
                  const bpCategory = getBpCategory(v.systolicBp, v.diastolicBp);
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <div className="font-semibold">
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {v.heartRate}
                        </span>{" "}
                        <span className="text-slate-400">bpm</span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {v.systolicBp}/{v.diastolicBp}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${bpCategory.badgeClass}`}>
                            {bpCategory.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                          {v.spo2}%
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {v.temperature}°F
                        </span>
                      </td>
                      <td className="px-6 py-3.5 max-w-xs truncate text-slate-500 dark:text-slate-400">
                        {v.notes || "Routine check"}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteVitalReading(v.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reading Modal */}
      <AddReadingModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
