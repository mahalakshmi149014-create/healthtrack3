"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  X,
  Heart,
  Activity,
  Droplet,
  Thermometer,
  FileText,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { getBpCategory } from "@/utils/healthCalc";

interface AddReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddReadingModal({ isOpen, onClose }: AddReadingModalProps) {
  const { addVitalReading } = useHealth();

  const [heartRate, setHeartRate] = useState<number>(72);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [spo2, setSpo2] = useState<number>(98);
  const [temperature, setTemperature] = useState<number>(98.6);
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const bpStatus = getBpCategory(systolicBp, diastolicBp);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!heartRate || heartRate < 35 || heartRate > 230) {
      errs.heartRate = "Heart rate must be between 35 and 230 bpm";
    }
    if (!systolicBp || systolicBp < 70 || systolicBp > 260) {
      errs.systolicBp = "Systolic BP must be between 70 and 260 mmHg";
    }
    if (!diastolicBp || diastolicBp < 40 || diastolicBp > 150) {
      errs.diastolicBp = "Diastolic BP must be between 40 and 150 mmHg";
    }
    if (diastolicBp >= systolicBp) {
      errs.diastolicBp = "Diastolic must be lower than Systolic pressure";
    }
    if (!spo2 || spo2 < 70 || spo2 > 100) {
      errs.spo2 = "SpO₂ must be between 70% and 100%";
    }
    if (!temperature || temperature < 92 || temperature > 108) {
      errs.temperature = "Body temp must be between 92°F and 108°F";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addVitalReading({
      heartRate: Number(heartRate),
      systolicBp: Number(systolicBp),
      diastolicBp: Number(diastolicBp),
      spo2: Number(spo2),
      temperature: Number(temperature),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                Log New Health Reading
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your vital signs and physiological markers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Heart Rate */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                min={40}
                max={220}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
                required
              />
              {errors.heartRate && (
                <p className="text-xs text-rose-500 mt-1">{errors.heartRate}</p>
              )}
            </div>

            {/* SpO2 */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                Oxygen SpO₂ (%)
              </label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                min={70}
                max={100}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
                required
              />
              {errors.spo2 && <p className="text-xs text-rose-500 mt-1">{errors.spo2}</p>}
            </div>
          </div>

          {/* Blood Pressure Row */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Activity className="w-3.5 h-3.5 text-sky-500" />
                Blood Pressure (Systolic / Diastolic mmHg)
              </label>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${bpStatus.badgeClass}`}>
                {bpStatus.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Systolic (e.g. 120)"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
                required
              />
              <input
                type="number"
                placeholder="Diastolic (e.g. 80)"
                value={diastolicBp}
                onChange={(e) => setDiastolicBp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
                required
              />
            </div>
            {(errors.systolicBp || errors.diastolicBp) && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.systolicBp || errors.diastolicBp}
              </p>
            )}
          </div>

          {/* Temperature */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              Body Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              min={92}
              max={108}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
              required
            />
            {errors.temperature && (
              <p className="text-xs text-rose-500 mt-1">{errors.temperature}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Context / Activity Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Post-study session, resting, after campus jog"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden transition-all"
            />
          </div>

          {/* Clinical Tip */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p>
              For accurate resting heart rate and blood pressure, sit comfortably for 5 minutes prior to measuring.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
