"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useHealth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = "border-sky-500/30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100";
        let iconClass = "text-sky-500";

        if (toast.type === "success") {
          Icon = CheckCircle2;
          borderClass = "border-emerald-500/40 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100";
          iconClass = "text-emerald-500";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          borderClass = "border-amber-500/40 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100";
          iconClass = "text-amber-500";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          borderClass = "border-rose-500/40 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100";
          iconClass = "text-rose-500";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
