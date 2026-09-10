"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  statusBadge: {
    label: string;
    variant: "success" | "warning" | "danger" | "info";
  };
  changeText?: string;
  changeType?: "increase" | "decrease" | "neutral";
  subtitle?: string;
  onClick?: () => void;
}

export function VitalCard({
  title,
  value,
  unit,
  icon: Icon,
  iconColor,
  iconBg,
  statusBadge,
  changeText,
  changeType = "neutral",
  subtitle,
  onClick,
}: VitalCardProps) {
  const badgeClasses = {
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80 shadow-xs shadow-emerald-500/10",
    warning:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80 shadow-xs shadow-amber-500/10",
    danger:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80 shadow-xs shadow-rose-500/10 animate-pulse",
    info: "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80 shadow-xs shadow-sky-500/10",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 shadow-xs hover:shadow-xl hover:border-sky-300/80 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
    >
      {/* Subtle background ambient glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-sky-500/5 dark:bg-sky-400/5 rounded-full blur-2xl group-hover:bg-sky-500/10 dark:group-hover:bg-sky-400/10 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-110 shadow-xs`}
            >
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>
              )}
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
              badgeClasses[statusBadge.variant]
            }`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Metric Value */}
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {value}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        </div>
      </div>

      {/* Footer / Trend change */}
      {changeText && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {changeType === "increase" && (
              <div className="p-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            )}
            {changeType === "decrease" && (
              <div className="p-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
            )}
            {changeType === "neutral" && (
              <Minus className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">
              {changeText}
            </span>
          </div>

          {onClick && (
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
