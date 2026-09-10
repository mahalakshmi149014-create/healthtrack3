"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  ShieldAlert,
  Heart,
  Activity,
  CheckCircle2,
  User,
  Share2,
} from "lucide-react";
import { MedicalDisclaimerBadge } from "./MedicalDisclaimer";

export function ReportsView() {
  const { profile, vitals, todayActivity, latestSleep, healthScoreData, showToast } = useHealth();
  const [reportPeriod, setReportPeriod] = useState<"weekly" | "monthly">("weekly");

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = "Timestamp,HeartRate_BPM,Systolic_mmHg,Diastolic_mmHg,SpO2_Percent,Temperature_F,Notes\n";
    const rows = vitals
      .map(
        (v) =>
          `"${v.timestamp}",${v.heartRate},${v.systolicBp},${v.diastolicBp},${v.spo2},${v.temperature},"${v.notes || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HealthTrack_Vitals_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ type: "success", title: "Report Exported", message: "CSV file downloaded successfully." });
  };

  const hrVals = vitals.map((v) => v.heartRate);
  const avgHr = hrVals.length ? Math.round(hrVals.reduce((a, b) => a + b, 0) / hrVals.length) : 0;
  const sysVals = vitals.map((v) => v.systolicBp);
  const avgSys = sysVals.length ? Math.round(sysVals.reduce((a, b) => a + b, 0) / sysVals.length) : 0;
  const diaVals = vitals.map((v) => v.diastolicBp);
  const avgDia = diaVals.length ? Math.round(diaVals.reduce((a, b) => a + b, 0) / diaVals.length) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Health Reports & Clinical Summaries
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate printable medical summaries and longitudinal vital exports for appointments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Summary
          </button>
        </div>
      </div>

      {/* Printable Clinical Summary Document */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm print:border-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">HealthTrack</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                • Vitals & Health Summary
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <MedicalDisclaimerBadge />
        </div>

        {/* Patient / User Profile Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Patient / User</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Age / Gender</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {profile.age} yrs • {profile.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Blood Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.bloodGroup}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Height & Weight</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {profile.heightCm} cm • {profile.weightKg} kg
            </span>
          </div>
        </div>

        {/* Aggregate Clinical Metrics */}
        <div className="py-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Longitudinal Vitals Averages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Average Resting HR</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {avgHr} <span className="text-xs font-normal text-slate-400">bpm</span>
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Within optimal 60-100 threshold
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Mean Arterial Blood Pressure</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {avgSys}/{avgDia} <span className="text-xs font-normal text-slate-400">mmHg</span>
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Normotensive standard
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Overall Health Score</span>
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {healthScoreData.overallScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {healthScoreData.statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Known Medical Conditions & Allergies */}
        <div className="py-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Disclosed Medical Conditions:</h4>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
              {profile.medicalConditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Known Allergies:</h4>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
              {profile.allergies.map((all, i) => (
                <li key={i}>{all}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Contact & Primary Physician */}
        <div className="py-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Emergency Contact:</h4>
            <p className="text-slate-600 dark:text-slate-400">
              {profile.emergencyContact.name} ({profile.emergencyContact.relationship}) • {profile.emergencyContact.phone}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Assigned Physician / Clinic:</h4>
            <p className="text-slate-600 dark:text-slate-400">
              {profile.emergencyContact.doctorName || "Not specified"} • {profile.emergencyContact.doctorPhone || "N/A"}
            </p>
          </div>
        </div>

        {/* Footer Medical Disclaimer Note */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>NOTICE TO HEALTHCARE PROVIDERS:</strong> This report is a digital health log export compiled from self-reported readings and mock sensor data. It does not replace clinical laboratory diagnostic tests or formal triage.
          </p>
        </div>
      </div>
    </div>
  );
}
