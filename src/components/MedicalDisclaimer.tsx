"use client";

import React, { useState } from "react";
import { AlertCircle, X, ShieldCheck } from "lucide-react";

export function MedicalDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-sky-50 dark:bg-sky-950/40 border-b border-sky-200 dark:border-sky-800/60 px-4 py-2 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
        <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
        <span>
          <strong className="font-semibold">Medical & Educational Disclaimer:</strong> HealthTrack presents simulated student & personal vitals tracking data. This platform does <strong className="font-semibold underline decoration-sky-400">not</strong> provide clinical diagnosis or medical advice. Consult a licensed healthcare professional for any medical concerns.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded text-sky-500 hover:text-sky-800 dark:hover:text-sky-100 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function MedicalDisclaimerBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/70">
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      <span>Sample Data — Not a Medical Diagnosis</span>
    </div>
  );
}
