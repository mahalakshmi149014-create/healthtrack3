"use client";

import React, { useState, useEffect } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Brain,
  Smile,
  Meh,
  Frown,
  Zap,
  Moon,
  Sparkles,
  Heart,
  Wind,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";
import { MoodEntry } from "@/types/health";

export function MentalWellnessView() {
  const { moodLogs, logMood, latestVital, latestSleep } = useHealth();
  const [selectedScore, setSelectedScore] = useState<MoodEntry["score"]>(4);
  const [primaryMood, setPrimaryMood] = useState<MoodEntry["primaryMood"]>("Energetic");
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Workout Done", "Hydrated"]);
  const [journalNote, setJournalNote] = useState<string>("");

  // Breathing tool state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Ready">("Ready");
  const [breathingTimer, setBreathingTimer] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  const availableTags = [
    "Workout Done",
    "Good Sleep",
    "Hydrated",
    "Exam / Deadline",
    "Meditation",
    "Outdoor Walk",
    "Caffeine",
    "Socializing",
    "Deep Focus",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logMood({
      score: selectedScore,
      primaryMood,
      energyLevel,
      stressLevel,
      tags: selectedTags,
      journalNote: journalNote.trim() || undefined,
    });
    setJournalNote("");
  };

  // 4-7-8 Breathing Technique
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) return prev - 1;
          if (breathingPhase === "Inhale" || breathingPhase === "Ready") {
            setBreathingPhase("Hold");
            return 7;
          } else if (breathingPhase === "Hold") {
            setBreathingPhase("Exhale");
            return 8;
          } else if (breathingPhase === "Exhale") {
            setBreathingPhase("Inhale");
            setCyclesCompleted((c) => c + 1);
            return 4;
          }
          return 4;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive, breathingPhase]);

  const startBreathing = () => {
    setBreathingPhase("Inhale");
    setBreathingTimer(4);
    setBreathingActive(true);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase("Ready");
    setBreathingTimer(4);
  };

  const resetBreathing = () => {
    stopBreathing();
    setCyclesCompleted(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            Mental Wellness, Mood & Autonomic Recovery
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor subjective mood states, parasympathetic nervous tone, and somatic stress indicators
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Logger Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smile className="w-4 h-4 text-indigo-500" />
            Daily Mental State Check-in
          </h3>

          {/* Mood Selector Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              How are you feeling right now?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { label: "Energetic", score: 5 as const, icon: "⚡", bg: "hover:bg-amber-50 dark:hover:bg-amber-950/40" },
                { label: "Calm", score: 4 as const, icon: "🧘", bg: "hover:bg-teal-50 dark:hover:bg-teal-950/40" },
                { label: "Neutral", score: 3 as const, icon: "🌱", bg: "hover:bg-slate-50 dark:hover:bg-slate-800" },
                { label: "Stressed", score: 2 as const, icon: "🔥", bg: "hover:bg-orange-50 dark:hover:bg-orange-950/40" },
                { label: "Anxious", score: 1 as const, icon: "🌪️", bg: "hover:bg-rose-50 dark:hover:bg-rose-950/40" },
                { label: "Exhausted", score: 1 as const, icon: "🌙", bg: "hover:bg-purple-50 dark:hover:bg-purple-950/40" },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => {
                    setPrimaryMood(m.label as any);
                    setSelectedScore(m.score);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    primaryMood === m.label
                      ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold scale-[1.03] shadow-xs"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 " + m.bg
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[11px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Stress Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Energy Level</span>
                <span className="text-indigo-600 dark:text-indigo-400">{energyLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Fatigued</span>
                <span>Peak Vitality</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Stress / Tension</span>
                <span className="text-rose-600 dark:text-rose-400">{stressLevel} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Serene</span>
                <span>High Strain</span>
              </div>
            </div>
          </div>

          {/* Context Tags */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Influencing Factors & Bio-Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs font-semibold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Journal Note */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              Brief Journal Reflection (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What went well today? Any specific triggers or physical sensations?"
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleMoodSubmit}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Save Mental Wellness Entry
          </button>
        </div>

        {/* 4-7-8 Breathing & Parasympathetic Reset Box */}
        <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-indigo-800/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-black tracking-widest text-indigo-200 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-indigo-400" />
                Vagal Nerve Reset
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-800/60 text-indigo-200">
                4-7-8 Technique
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Inhale 4s, Hold 7s, Exhale 8s to trigger parasympathetic relaxation and down-regulate heart rate.
            </p>

            {/* Breathing Animation Circle */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-1000 ${
                  breathingPhase === "Inhale"
                    ? "scale-115 border-indigo-400 bg-indigo-500/30 shadow-2xl shadow-indigo-500/50"
                    : breathingPhase === "Hold"
                    ? "scale-115 border-amber-400 bg-amber-500/20 shadow-xl shadow-amber-500/40"
                    : breathingPhase === "Exhale"
                    ? "scale-90 border-teal-400 bg-teal-500/20 shadow-lg shadow-teal-500/30"
                    : "border-slate-700 bg-slate-800/50"
                }`}
              >
                <span className="text-2xl font-black">{breathingTimer}s</span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 mt-1">
                  {breathingPhase}
                </span>
              </div>

              <span className="text-[11px] text-slate-400 mt-4">
                Cycles completed: <strong className="text-white">{cyclesCompleted}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!breathingActive ? (
              <button
                onClick={startBreathing}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" /> Start Breathing
              </button>
            ) : (
              <button
                onClick={stopBreathing}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}
            <button
              onClick={resetBreathing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mood History Chronology */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Recent Mental Wellness Logs
        </h3>

        {moodLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No mood entries logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {moodLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-lg">
                    {log.score >= 4 ? "⚡" : log.score === 3 ? "🧘" : "🌪️"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {log.primaryMood}
                      </span>
                      <span className="text-[10px] text-slate-400">• Energy: {log.energyLevel}/10 • Stress: {log.stressLevel}/10</span>
                    </div>
                    {log.journalNote && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                        &ldquo;{log.journalNote}&rdquo;
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {log.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 self-end sm:self-auto">
                  {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })} •{" "}
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
