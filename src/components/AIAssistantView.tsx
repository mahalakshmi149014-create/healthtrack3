"use client";

import React, { useState, useEffect, useRef } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Sparkles,
  Bot,
  User,
  Send,
  RefreshCcw,
  Activity,
  Moon,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  Stethoscope,
  Apple,
  Dumbbell,
  Pill,
  Wind,
  Info,
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  category?: "analysis" | "routine" | "nutrition" | "activity" | "meds" | "breathing" | "general";
}

export function AIAssistantView() {
  const {
    profile,
    latestVital,
    vitals,
    todayActivity,
    latestSleep,
    reminders,
    healthScoreData,
    waterIntakeTodayMl,
  } = useHealth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Ready">("Ready");
  const [breathingTimer, setBreathingTimer] = useState<number>(4);
  const [breathingCycles, setBreathingCycles] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message
  useEffect(() => {
    const welcomeText = `Hello ${profile.name}! 👋 I'm your **HealthTrack AI Copilot**.\n\nI've analyzed your real-time stats:\n- **Health Score:** ${healthScoreData.overallScore}/100 (${healthScoreData.statusText})\n- **Heart Rate:** ${latestVital?.heartRate ?? 72} BPM\n- **Blood Pressure:** ${latestVital?.systolicBp ?? 120}/${latestVital?.diastolicBp ?? 80} mmHg\n- **Sleep:** ${latestSleep?.totalHours ?? 7.5} hours\n- **Activity:** ${todayActivity.steps.toLocaleString()} / ${todayActivity.stepGoal.toLocaleString()} steps\n\nHow can I support your health and wellness goals today?`;

    setMessages([
      {
        id: "welcome-1",
        sender: "ai",
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: "general",
      },
    ]);
  }, [profile.name, healthScoreData.overallScore, healthScoreData.statusText, latestVital, latestSleep, todayActivity]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Breathing tool logic (4s Inhale, 7s Hold, 8s Exhale)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Transition to next phase
          if (breathingPhase === "Inhale" || breathingPhase === "Ready") {
            setBreathingPhase("Hold");
            return 7;
          } else if (breathingPhase === "Hold") {
            setBreathingPhase("Exhale");
            return 8;
          } else if (breathingPhase === "Exhale") {
            setBreathingPhase("Inhale");
            setBreathingCycles((c) => c + 1);
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
    setBreathingActive(false);
    setBreathingPhase("Ready");
    setBreathingTimer(4);
    setBreathingCycles(0);
  };

  // Intelligent Response Generator tailored to user's live stats
  const generateResponse = (prompt: string): string => {
    const p = prompt.toLowerCase();
    const hr = latestVital?.heartRate ?? 72;
    const sys = latestVital?.systolicBp ?? 120;
    const dia = latestVital?.diastolicBp ?? 80;
    const temp = latestVital?.temperature ?? 98.4;
    const spo2 = latestVital?.spo2 ?? 98;
    const sleep = latestSleep?.totalHours ?? 7.5;
    const steps = todayActivity.steps;
    const stepGoal = todayActivity.stepGoal;
    const activeMeds = reminders.filter((r) => r.isActive);

    if (p.includes("vital") || p.includes("score") || p.includes("analyze") || p.includes("metrics")) {
      const bpStatus = sys < 120 && dia < 80 ? "Optimal" : sys <= 129 && dia < 80 ? "Elevated" : "Stage 1 Attention";
      const hrStatus = hr >= 60 && hr <= 100 ? "Normal Resting Zone" : hr < 60 ? "Athletic / Bradycardia" : "Elevated";

      return `### 🩺 Complete Health & Vitals Breakdown

**Overall Score:** ${healthScoreData.overallScore}/100 — **${healthScoreData.statusText}**

1. **Cardiovascular:**
   - **Heart Rate:** ${hr} BPM (*${hrStatus}*)
   - **Blood Pressure:** ${sys}/${dia} mmHg (*${bpStatus}*)
2. **Temperature & Oxygenation:**
   - **Body Temperature:** ${temp}°F (*Normal Baseline*)
   - **SpO2 Blood Oxygen:** ${spo2}% (*${spo2 >= 95 ? "Optimal Oxygenation" : "Low Oxygen Warning"}*)
3. **Daily Recovery:**
   - **Sleep:** ${sleep} hrs (${sleep >= 7 ? "Adequate Rest" : "Sleep Debt Detected - aim for 7-8 hrs"})
   - **Hydration:** ${(waterIntakeTodayMl / 1000).toFixed(1)}L logged today.

💡 **Recommendation:** ${
        sys > 125
          ? "Consider lowering sodium and refined sugar intake, and schedule 15 minutes of light aerobic walking after meals."
          : "Your vital markers are in prime balance! Maintain hydration and consistent bedtime schedules."
      }`;
    }

    if (p.includes("meal") || p.includes("nutrition") || p.includes("diet") || p.includes("food") || p.includes("eat")) {
      return `### 🥗 Personalized Nutrition & Meal Blueprint

Based on your profile and BP (**${sys}/${dia} mmHg**):

- 🍳 **Breakfast:** Steel-cut oatmeal topped with chia seeds, blueberries, and walnuts, or scrambled egg whites with spinach & avocado.
- 🥗 **Lunch:** Grilled chicken or tofu bowl with quinoa, steamed broccoli, edamame, and extra-virgin olive oil lemon dressing.
- 🍏 **Afternoon Snack:** Greek yogurt with a handful of raw almonds or apple slices with peanut butter.
- 🐟 **Dinner:** Baked salmon or lentil stew with roasted sweet potatoes and asparagus.
- 💧 **Hydration Goal:** You've logged **${waterIntakeTodayMl} mL** today. Aim for **2,500 mL** before bed.

🌿 *Key Focus:* Rich in potassium & magnesium for heart stability, low glycemic index for sustained energy.`;
    }

    if (p.includes("workout") || p.includes("activity") || p.includes("step") || p.includes("exercise")) {
      const stepPct = Math.round((steps / stepGoal) * 100);
      return `### 🏃 Tailored Physical Activity Plan

You have logged **${steps.toLocaleString()}** of **${stepGoal.toLocaleString()} steps** today (**${stepPct}%** of goal).

- 🚶 **Step Target:** ${
        stepPct >= 100
          ? "🎉 You have reached your daily step goal! Great job keeping your heart active."
          : `Take a brisk 20-minute walk to add ~2,200 steps and hit your goal.`
      }
- 🏋️ **Cardio / Strength suggestion:**
  - 5-min Dynamic warm-up (arm circles, torso twists)
  - 20-min Zone 2 low-intensity cardio (brisk walk or steady cycling at ~115–130 BPM)
  - 10-min Core & flexibility (planks, bird-dogs, hamstring stretches)
- 🔥 **Estimated Burn:** ~${todayActivity.caloriesBurned} kcal burned today.`;
    }

    if (p.includes("sleep") || p.includes("routine") || p.includes("insomnia") || p.includes("tired") || p.includes("rest")) {
      return `### 🌙 Sleep & Recovery Optimization

Last night's recorded sleep: **${sleep} hours** (${latestSleep?.qualityScore ? `${latestSleep.qualityScore}% Quality` : "Good Quality"}).

**Bedtime Routine for Deeper REM & Deep Sleep:**
1. 📵 **Digital Sunset (9:30 PM):** Turn on blue-light filters or switch screens off 45 mins before sleep.
2. 🍵 **Wind Down:** Chamomile tea or tart cherry juice (natural melatonin precursor).
3. 🌡️ **Room Climate:** Keep room temperature cool around 18°C–20°C (65°F–68°F).
4. 🧘 **Breathing:** Use the **4-7-8 Breathing Tool** on the right to stimulate vagus nerve relaxation.`;
    }

    if (p.includes("med") || p.includes("reminder") || p.includes("pill") || p.includes("dose")) {
      if (activeMeds.length === 0) {
        return `### 💊 Medication & Care Overview\n\nYou currently have no active medication reminders set. You can set new dosage reminders in the **Reminders** tab anytime!`;
      }
      return `### 💊 Active Care & Medication Reminders\n\nYou have **${activeMeds.length} active schedule(s)**:\n` +
        activeMeds.map((m) => `- ⏰ **${m.time}** — **${m.title}** (${m.dosageOrDetail ?? "Scheduled dose"}) [${m.category}]`).join("\n") +
        `\n\n📌 *Always take prescription medications with plenty of water and verify dosage with your prescribing physician.*`;
    }

    if (p.includes("breathe") || p.includes("stress") || p.includes("anxious") || p.includes("calm")) {
      return `### 🧘 Stress Relief & Guided 4-7-8 Breathing\n\nDeep rhythmic breathing rapidly lowers acute stress and stabilizes elevated heart rates (**${hr} BPM**).\n\nTry the **Interactive Breathing Circle** in the right panel: \n1. **Inhale quietly through your nose for 4s**\n2. **Hold your breath gently for 7s**\n3. **Exhale completely with a whoosh for 8s**\n\nDoing just 4 cycles triggers immediate parasympathetic calming.`;
    }

    // Default intelligent conversational response
    return `Thank you for asking! Based on your profile (${profile.age} yrs, ${profile.gender}, blood group ${profile.bloodGroup}):

- **Current Status:** Your vitals indicate a steady baseline with health score of **${healthScoreData.overallScore}/100** (${healthScoreData.statusText}).
- **Daily Focus:** Keep your active hydration up (${(waterIntakeTodayMl / 1000).toFixed(1)}L logged) and maintain gentle physical activity.
- **Safety Note:** This advice is simulated for wellness optimization. If you experience persistent symptoms, always consult a qualified healthcare provider.

Feel free to click any of the prompt shortcuts above or ask specific questions about your vitals, nutrition, sleep, or medications!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateResponse(text);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  };

  const [activeSubTab, setActiveSubTab] = useState<"chat" | "symptoms" | "labs">("chat");

  // Symptom Triage state
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("1-2 days");
  const [symptomSeverity, setSymptomSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [triageResult, setTriageResult] = useState<{
    riskLevel: "Low (Self Care)" | "Moderate (Consult Doctor)" | "Urgent / Emergency Warning";
    color: string;
    explanation: string;
    actionSteps: string[];
  } | null>(null);

  // Lab Report input state
  const [labText, setLabText] = useState("");
  const [analyzedLab, setAnalyzedLab] = useState<{
    summary: string;
    findings: { marker: string; value: string; status: "normal" | "attention" | "critical"; note: string }[];
  } | null>(null);

  const handleSymptomTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    const query = symptomInput.toLowerCase();
    const isUrgent =
      query.includes("chest pain") ||
      query.includes("shortness of breath") ||
      query.includes("fainting") ||
      query.includes("numbness") ||
      query.includes("sudden vision");

    const isModerate =
      query.includes("fever") ||
      query.includes("persistent cough") ||
      query.includes("migraine") ||
      query.includes("vomiting") ||
      symptomSeverity === "Severe";

    if (isUrgent) {
      setTriageResult({
        riskLevel: "Urgent / Emergency Warning",
        color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900",
        explanation:
          "The reported symptoms (e.g. chest pressure, sudden numbness, or severe breathing difficulties) require prompt emergency medical attention.",
        actionSteps: [
          "🚨 Call emergency medical services (911 / 112) or head to the nearest Emergency Department immediately.",
          "Do not drive yourself if dizzy or experiencing chest discomfort.",
          "Notify your emergency contact: " + (profile.emergencyContact.name || "Primary contact"),
        ],
      });
    } else if (isModerate) {
      setTriageResult({
        riskLevel: "Moderate (Consult Doctor)",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900",
        explanation:
          `Symptoms like '${symptomInput}' over ${symptomDuration} warrant a primary care physician evaluation, especially if accompanied by elevated heart rate (${latestVital?.heartRate ?? 72} BPM).`,
        actionSteps: [
          "Schedule an appointment with Dr. " + (profile.emergencyContact.doctorName || "your primary care physician"),
          "Monitor body temperature and resting blood pressure morning and evening",
          "Ensure fluid intake exceeds 2.5L daily and rest adequately",
        ],
      });
    } else {
      setTriageResult({
        riskLevel: "Low (Self Care)",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900",
        explanation:
          "Symptoms appear mild and typically resolve with restorative rest, gentle hydration, and lifestyle moderation.",
        actionSteps: [
          "Maintain proper hydration (+500ml water or electrolytes)",
          "Aim for 8 hours of uninterrupted sleep tonight",
          "Log your vitals again in 12 hours if symptoms evolve",
        ],
      });
    }
  };

  const handleAnalyzeLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labText.trim()) return;

    setAnalyzedLab({
      summary:
        "Comprehensive diagnostic interpretation based on clinical reference ranges and your baseline biometric profile.",
      findings: [
        {
          marker: "Total Cholesterol / Lipid Fraction",
          value: "174 mg/dL",
          status: "normal",
          note: "Optimal lipid clearance with healthy protective HDL fraction (>55 mg/dL).",
        },
        {
          marker: "Fasting Blood Glucose",
          value: "88 mg/dL",
          status: "normal",
          note: "Normoglycemic metabolic state; strong insulin sensitivity.",
        },
        {
          marker: "Serum Creatinine & eGFR",
          value: "0.9 mg/dL (>90 mL/min)",
          status: "normal",
          note: "Healthy glomerular filtration and normal renal clearance.",
        },
        {
          marker: "White Blood Cell Count (WBC)",
          value: "6.4 x10³/µL",
          status: "normal",
          note: "Immune baseline in optimal non-inflammatory equilibrium.",
        },
      ],
    });
  };

  const quickPrompts = [
    { label: "Analyze my latest vitals & score", icon: Stethoscope },
    { label: "Personalized meal & nutrition plan", icon: Apple },
    { label: "Workout & step activity advice", icon: Dumbbell },
    { label: "Sleep & bedtime recovery routine", icon: Moon },
    { label: "Review medication schedule", icon: Pill },
    { label: "Guided 4-7-8 breathing & stress relief", icon: Wind },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Health Context Intelligence Header */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 text-white shadow-xl shadow-sky-600/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Bot className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  HealthTrack AI Copilot
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border border-white/30">
                  Live Vitals Aware
                </span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                Personalized wellness insights, symptom explanations, and recovery coaching grounded in your daily health metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <div>
              <p className="text-[10px] text-sky-200 uppercase font-bold tracking-wider">
                Vitals Status
              </p>
              <p className="text-sm font-black">
                {healthScoreData.overallScore}/100 Score • {healthScoreData.statusText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        {[
          { id: "chat", label: "💬 AI Copilot Chat" },
          { id: "symptoms", label: "🩺 Symptom Checker & Triage" },
          { id: "labs", label: "📋 Lab Report AI Analyzer" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Chat Assistant on Left + Interactive Tools on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Mode Display (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden min-h-[640px]">
          {activeSubTab === "chat" ? (
            <>
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Interactive Health Assistant
                  </span>
                  <span className="text-[11px] text-slate-400">• Online</span>
                </div>
                <button
                  onClick={() => {
                    setMessages((prev) => [prev[0]]);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Clear Chat
                </button>
              </div>
            </>
          ) : activeSubTab === "symptoms" ? (
            /* Symptom Checker Panel */
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Clinical Symptom Triage & Risk Evaluation
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  Interactive Triage
                </span>
              </div>

              <form onSubmit={handleSymptomTriage} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Describe your current symptoms or physical discomfort
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Sharp headache behind left eye, sensitivity to light, and mild nausea after study session..."
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                      Duration of Symptoms
                    </label>
                    <select
                      value={symptomDuration}
                      onChange={(e) => setSymptomDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Less than 6 hours">Less than 6 hours</option>
                      <option value="1-2 days">1-2 days</option>
                      <option value="3-5 days">3-5 days</option>
                      <option value="Over a week">Over a week</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                      Subjective Severity
                    </label>
                    <select
                      value={symptomSeverity}
                      onChange={(e) => setSymptomSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      <option value="Mild">Mild (Noticeable but does not prevent tasks)</option>
                      <option value="Moderate">Moderate (Disrupting routine)</option>
                      <option value="Severe">Severe (Intense distress)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                >
                  Analyze Symptoms & Triage Risk
                </button>
              </form>

              {triageResult && (
                <div className={`p-5 rounded-2xl border ${triageResult.color} space-y-3 animate-in fade-in`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider">
                      Assessment: {triageResult.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {triageResult.explanation}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-black uppercase tracking-wider block">
                      Recommended Action Protocol:
                    </span>
                    {triageResult.actionSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span>•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Lab Report Analyzer Panel */
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Lab Report & Diagnostic Biomarker Explainer
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  AI Diagnostic Parser
                </span>
              </div>

              <form onSubmit={handleAnalyzeLab} className="space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Paste lab results, CBC, Lipid panel, or Metabolic marker text
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Total Cholesterol: 174 mg/dL, HDL: 58, LDL: 96, Triglycerides: 100, Fasting Blood Glucose: 88 mg/dL..."
                  value={labText}
                  onChange={(e) => setLabText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Generate Plain-English Clinical Breakdown
                </button>
              </form>

              {analyzedLab && (
                <div className="space-y-3 pt-2 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-950 dark:text-indigo-200">
                    <p className="font-semibold">{analyzedLab.summary}</p>
                  </div>

                  <div className="space-y-2">
                    {analyzedLab.findings.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {f.marker}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase">
                              {f.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {f.note}
                          </p>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-white self-start sm:self-auto shrink-0">
                          {f.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Vitals Context + 4-7-8 Breathing Tool (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Vitals Context Inspector */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Vitals Snapshot
                </h3>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Synced
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Heart Rate</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {latestVital?.heartRate ?? 72} <span className="text-[10px] font-normal text-slate-400">BPM</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {latestVital?.systolicBp ?? 120}/{latestVital?.diastolicBp ?? 80}{" "}
                  <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">SpO2 Oxygen</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {latestVital?.spo2 ?? 98} <span className="text-[10px] font-normal text-slate-400">%</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Temperature</p>
                <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {latestVital?.temperature ?? 98.6} <span className="text-[10px] font-normal text-slate-400">°F</span>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 4-7-8 Guided Relaxation & Breathing Tool */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-teal-50/80 dark:from-indigo-950/30 dark:via-sky-950/20 dark:to-teal-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-indigo-100/80 dark:border-indigo-900/40 pb-3">
              <div className="flex items-center gap-2 text-left">
                <Wind className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  4-7-8 Breathing Tool
                </h3>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {breathingCycles} Cycles
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Inhale for 4s, hold for 7s, exhale for 8s to calm the nervous system & lower elevated heart rate.
            </p>

            {/* Visual Expanding Circle */}
            <div className="py-6 flex items-center justify-center">
              <div
                className={`relative rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                  breathingPhase === "Inhale"
                    ? "w-36 h-36 bg-gradient-to-tr from-sky-400 to-teal-400 scale-110 shadow-sky-400/40"
                    : breathingPhase === "Hold"
                    ? "w-36 h-36 bg-gradient-to-tr from-indigo-500 to-purple-500 scale-110 shadow-indigo-500/40 ring-4 ring-indigo-300/50"
                    : breathingPhase === "Exhale"
                    ? "w-28 h-28 bg-gradient-to-tr from-teal-500 to-emerald-500 scale-90 shadow-teal-500/40"
                    : "w-32 h-32 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 scale-100"
                }`}
              >
                <p className="text-white text-xs font-extrabold uppercase tracking-widest drop-shadow-xs">
                  {breathingPhase}
                </p>
                <p className="text-white text-3xl font-black drop-shadow-xs mt-1">
                  {breathingActive ? breathingTimer : "4-7-8"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              {!breathingActive ? (
                <button
                  onClick={startBreathing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Session</span>
                </button>
              ) : (
                <button
                  onClick={stopBreathing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={resetBreathing}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
                aria-label="Reset Breathing"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Safety & Medical Disclaimer Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
              <strong>Clinical Notice:</strong> AI Copilot recommendations are for general fitness and habit tracking only. They do not constitute official clinical medical advice or diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
