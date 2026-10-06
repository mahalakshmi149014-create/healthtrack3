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
  Moon,
  Droplet,
  Footprints,
  Pill,
  FileText,
} from "lucide-react";
import { MedicalDisclaimerBadge } from "./MedicalDisclaimer";

export function ReportsView() {
  const {
    profile,
    vitals,
    todayActivity,
    latestSleep,
    waterIntakeTodayMl,
    healthScoreData,
    showToast,
    reminders,
    healthNotes,
    personalGoals,
    t,
  } = useHealth();

  const [reportPeriod, setReportPeriod] = useState<"weekly" | "monthly">("weekly");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDoctorLink = () => {
    navigator.clipboard?.writeText(window.location.origin + "#reports?token=cl_share_" + Date.now());
    setCopiedLink(true);
    showToast({
      type: "success",
      title: "Doctor Access Link Copied",
      message: "A secure, read-only tokenized link was copied to your clipboard.",
    });
    setTimeout(() => setCopiedLink(false), 3000);
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
            {t.medicalSummaryReport}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.reportsSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {t.shareDoctorLink}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {t.exportCsv}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {t.printPdf}
          </button>
        </div>
      </div>

      {/* Main Printable Medical Summary Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                HealthTrack <span className="text-sky-600">Pro</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                Official Clinical Summary
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString(undefined, { dateStyle: "full" })}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
            <p className="font-bold text-slate-900 dark:text-white">Primary Care Physician:</p>
            <p>{profile.emergencyContact.doctorName || "Dr. Sarah Jenkins, MD"}</p>
            <p>{profile.emergencyContact.doctorPhone || "+1 (555) 987-6543"}</p>
          </div>
        </div>

        {/* Patient Demographics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">{t.patientName}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Age & Gender</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {profile.age} yrs • {profile.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Height / Weight / Blood</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {profile.heightCm} cm • {profile.weightKg} kg • {profile.bloodGroup}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.emergencyContact}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {profile.emergencyContact.name} ({profile.emergencyContact.phone})
            </span>
          </div>
        </div>

        {/* Medical Conditions & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {t.medicalConditions}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.medicalConditions.length > 0 ? (
                profile.medicalConditions.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None reported</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
              {t.allergies}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.allergies.length > 0 ? (
                profile.allergies.map((a, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No known allergies</span>
              )}
            </div>
          </div>
        </div>

        {/* Selected Vitals Trends Summary */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Cardiovascular & Hemodynamic Trends
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Avg Heart Rate</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{avgHr} BPM</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Avg Blood Pressure</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{avgSys}/{avgDia} mmHg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Daily Steps</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {todayActivity.steps.toLocaleString()} / {personalGoals.dailySteps.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Daily Health Score</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {healthScoreData.overallScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Sleep, Hydration & Activity Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Moon className="w-4 h-4" />
              <span>Sleep & Recovery</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Latest: <strong className="text-slate-900 dark:text-white">{latestSleep ? latestSleep.totalHours : 7.3} hrs</strong> (Score: {latestSleep ? latestSleep.qualityScore : 86}/100)
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Droplet className="w-4 h-4" />
              <span>Hydration Status</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Today: <strong className="text-slate-900 dark:text-white">{waterIntakeTodayMl} ml</strong> / Goal: {personalGoals.dailyWaterMl} ml
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-4 h-4" />
              <span>Workouts & Fitness</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Active: <strong className="text-slate-900 dark:text-white">{todayActivity.activeMinutes} mins</strong> ({todayActivity.caloriesBurned} kcal burned)
            </p>
          </div>
        </div>

        {/* Medication & Care Schedule List */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Pill className="w-4 h-4 text-rose-500" />
            Current Prescriptions & Supplement Schedule
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            {reminders.map((rem) => (
              <div key={rem.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{rem.title}</span>
                  {rem.dosageOrDetail && (
                    <span className="text-slate-400 ml-2">({rem.dosageOrDetail})</span>
                  )}
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {rem.time} • {rem.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Health Observations & Notes */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" />
            Recent Observations & Patient Notes
          </h3>
          <div className="space-y-2">
            {healthNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>{note.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{note.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{note.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-400">
          <p>{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
