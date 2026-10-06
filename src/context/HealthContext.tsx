"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HealthMetricReading,
  ActivityEntry,
  SleepEntry,
  ReminderItem,
  UserHealthProfile,
  NotificationItem,
  HydrationLogItem,
  MealItem,
  MoodEntry,
  LabTestReport,
  HealthNoteEntry,
  PersonalHealthGoals,
  ThemeMode,
} from "@/types/health";
import {
  initialProfile,
  initialVitalsHistory,
  initialActivities,
  initialSleepData,
  initialReminders,
  initialNotifications,
  initialHydrationLogs,
  initialMeals,
  initialMoodLogs,
  initialLabReports,
  initialHealthNotes,
  initialPersonalGoals,
} from "@/data/mockData";
import { calculateHealthScore } from "@/utils/healthCalc";
import { supabase } from "@/lib/supabase";
import { translations, Language } from "@/data/translations";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message?: string;
}

interface HealthContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["en"];

  // Theme & Appearance
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Profile
  profile: UserHealthProfile;
  updateProfile: (data: Partial<UserHealthProfile>) => Promise<void>;

  // Personal Goals
  personalGoals: PersonalHealthGoals;
  updatePersonalGoals: (goals: Partial<PersonalHealthGoals>) => void;

  // Notes
  healthNotes: HealthNoteEntry[];
  addHealthNote: (note: Omit<HealthNoteEntry, "id" | "timestamp">) => void;
  deleteHealthNote: (id: string) => void;

  // Vitals & Metrics
  vitals: HealthMetricReading[];
  latestVital: HealthMetricReading | null;
  addVitalReading: (reading: Omit<HealthMetricReading, "id" | "timestamp">) => Promise<void>;
  deleteVitalReading: (id: string) => Promise<void>;

  // Activities
  activities: ActivityEntry[];
  todayActivity: ActivityEntry;
  addActivityEntry: (entry: Partial<ActivityEntry>) => void;
  addWorkout: (workout: {
    type: "Walking" | "Running" | "Cycling" | "Gym" | "Yoga" | "Swimming";
    durationMinutes: number;
    calories: number;
  }) => void;

  // Sleep
  sleepData: SleepEntry[];
  latestSleep: SleepEntry | null;
  addSleepEntry: (entry: Omit<SleepEntry, "id">) => Promise<void>;

  // Reminders
  reminders: ReminderItem[];
  toggleReminder: (id: string) => Promise<void>;
  markReminderTaken: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<ReminderItem, "id" | "isActive">) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;

  // Hydration
  waterIntakeTodayMl: number;
  hydrationLogs: HydrationLogItem[];
  logWater: (amountMl: number, beverageType?: HydrationLogItem["beverageType"]) => void;
  resetWater: () => void;

  // Nutrition & Meals
  meals: MealItem[];
  addMeal: (meal: Omit<MealItem, "id" | "time">) => void;
  deleteMeal: (id: string) => void;

  // Mental Wellness
  moodLogs: MoodEntry[];
  todayMood: MoodEntry | null;
  logMood: (entry: Omit<MoodEntry, "id" | "timestamp" | "date">) => void;

  // Reports & Lab
  labReports: LabTestReport[];
  addLabReport: (report: Omit<LabTestReport, "id">) => void;

  // Composite Health Score
  healthScoreData: ReturnType<typeof calculateHealthScore>;

  // Notifications & Toasts
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;

  // Auth & Cloud
  isAuthenticated: boolean;
  isCloudConnected: boolean;
  loginDemo: (role?: "Student" | "General User") => void;
  logout: () => void;
  resetAllDataToDefaults: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserHealthProfile>(initialProfile);
  const [personalGoals, setPersonalGoals] = useState<PersonalHealthGoals>(initialPersonalGoals);
  const [healthNotes, setHealthNotes] = useState<HealthNoteEntry[]>(initialHealthNotes);
  const [vitals, setVitals] = useState<HealthMetricReading[]>(initialVitalsHistory);
  const [activities, setActivities] = useState<ActivityEntry[]>(initialActivities);
  const [sleepData, setSleepData] = useState<SleepEntry[]>(initialSleepData);
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [waterIntakeTodayMl, setWaterIntakeTodayMl] = useState<number>(1500);
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLogItem[]>(initialHydrationLogs);
  const [meals, setMeals] = useState<MealItem[]>(initialMeals);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>(initialMoodLogs);
  const [labReports, setLabReports] = useState<LabTestReport[]>(initialLabReports);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = translations[language] || translations.en;

  const showToast = ({ type, title, message }: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("healthtrack_lang", lang);
    } catch {}
  };

  const applyTheme = (mode: ThemeMode) => {
    let isDark = false;
    if (mode === "dark") {
      isDark = true;
    } else if (mode === "light") {
      isDark = false;
    } else if (mode === "system") {
      isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem("healthtrack_theme_mode", mode);
    } catch {}
    applyTheme(mode);
  };

  const toggleDarkMode = () => {
    const nextMode = darkMode ? "light" : "dark";
    setThemeMode(nextMode);
  };

  // Sync / Fetch initial data
  useEffect(() => {
    // 1. Language persistence
    try {
      const savedLang = localStorage.getItem("healthtrack_lang") as Language;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    } catch {}

    // 2. Theme persistence
    try {
      const savedThemeMode = localStorage.getItem("healthtrack_theme_mode") as ThemeMode;
      if (savedThemeMode) {
        setThemeModeState(savedThemeMode);
        applyTheme(savedThemeMode);
      } else {
        const legacyDark = localStorage.getItem("healthtrack_darkmode");
        if (legacyDark !== null) {
          const isDark = JSON.parse(legacyDark);
          setThemeModeState(isDark ? "dark" : "light");
          applyTheme(isDark ? "dark" : "light");
        }
      }
    } catch {}

    // 3. Notes & Goals persistence
    try {
      const savedGoals = localStorage.getItem("healthtrack_goals");
      if (savedGoals) {
        setPersonalGoals(JSON.parse(savedGoals));
      }
      const savedNotes = localStorage.getItem("healthtrack_notes");
      if (savedNotes) {
        setHealthNotes(JSON.parse(savedNotes));
      }
    } catch {}

    // 4. Supabase & Remote Data
    async function loadData() {
      try {
        const { data: remoteVitals, error: vitalsErr } = await supabase
          .from("vitals_history")
          .select("*")
          .order("recorded_at", { ascending: false });

        if (!vitalsErr && remoteVitals && remoteVitals.length > 0) {
          const mapped: HealthMetricReading[] = remoteVitals.map((rv) => ({
            id: rv.id,
            timestamp: rv.recorded_at || rv.created_at,
            heartRate: rv.heart_rate,
            systolicBp: rv.systolic_bp,
            diastolicBp: rv.diastolic_bp,
            spo2: Number(rv.spo2),
            temperature: Number(rv.temperature),
            notes: rv.notes,
            loggedBy: rv.logged_by,
          }));
          setVitals(mapped);
          setIsCloudConnected(true);
        } else if (!vitalsErr) {
          setIsCloudConnected(true);
        }

        const { data: remoteReminders, error: remErr } = await supabase
          .from("reminders")
          .select("*")
          .order("created_at", { ascending: true });

        if (!remErr && remoteReminders && remoteReminders.length > 0) {
          const mappedReminders: ReminderItem[] = remoteReminders.map((rr) => ({
            id: rr.id,
            title: rr.title,
            category: rr.category as any,
            time: rr.time,
            dosageOrDetail: rr.dosage_or_detail,
            frequency: rr.frequency as any,
            isActive: rr.is_active,
            lastTakenDate: rr.last_taken_date,
          }));
          setReminders(mappedReminders);
        }

        const { data: remoteProfiles, error: profErr } = await supabase
          .from("profiles")
          .select("*")
          .limit(1);

        if (!profErr && remoteProfiles && remoteProfiles.length > 0) {
          const rp = remoteProfiles[0];
          setProfile({
            name: rp.name || "HealthTrack User",
            email: rp.email || "",
            role: rp.role || "Student",
            age: rp.age || 20,
            gender: rp.gender || "Prefer not to say",
            bloodGroup: rp.blood_group || "O+",
            heightCm: Number(rp.height_cm) || 170,
            weightKg: Number(rp.weight_kg) || 65,
            dailyStepGoal: rp.daily_step_goal || 8000,
            dailyWaterGoalMl: rp.daily_water_goal_ml || 2500,
            dailySleepGoalHours: Number(rp.daily_sleep_goal_hours) || 8,
            emergencyContact: rp.emergency_contact || initialProfile.emergencyContact,
            medicalConditions: rp.medical_conditions || [],
            allergies: rp.allergies || [],
          });
        }
      } catch {}
    }

    loadData();
  }, []);

  const updateProfile = async (data: Partial<UserHealthProfile>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem("healthtrack_profile", JSON.stringify(updated));

    try {
      await supabase.from("profiles").upsert({
        name: updated.name,
        email: updated.email,
        role: updated.role,
        age: updated.age,
        gender: updated.gender,
        blood_group: updated.bloodGroup,
        height_cm: updated.heightCm,
        weight_kg: updated.weightKg,
        daily_step_goal: updated.dailyStepGoal,
        daily_water_goal_ml: updated.dailyWaterGoalMl,
        daily_sleep_goal_hours: updated.dailySleepGoalHours,
        emergency_contact: updated.emergencyContact,
        medical_conditions: updated.medicalConditions,
        allergies: updated.allergies,
      });
    } catch {}

    showToast({ type: "success", title: "Profile Synced", message: "Health profile updated successfully." });
  };

  const updatePersonalGoals = (goals: Partial<PersonalHealthGoals>) => {
    const updated = { ...personalGoals, ...goals };
    setPersonalGoals(updated);
    setProfile((prev) => ({
      ...prev,
      dailyStepGoal: updated.dailySteps,
      dailyWaterGoalMl: updated.dailyWaterMl,
      dailySleepGoalHours: updated.dailySleepHours,
    }));
    try {
      localStorage.setItem("healthtrack_goals", JSON.stringify(updated));
    } catch {}
    showToast({ type: "success", title: "Goals Saved", message: "Personal health targets updated." });
  };

  const addHealthNote = (note: Omit<HealthNoteEntry, "id" | "timestamp">) => {
    const newNote: HealthNoteEntry = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newNote, ...healthNotes];
    setHealthNotes(updated);
    try {
      localStorage.setItem("healthtrack_notes", JSON.stringify(updated));
    } catch {}
    showToast({ type: "success", title: "Note Saved", message: `"${note.title}" added to health observations.` });
  };

  const deleteHealthNote = (id: string) => {
    const updated = healthNotes.filter((n) => n.id !== id);
    setHealthNotes(updated);
    try {
      localStorage.setItem("healthtrack_notes", JSON.stringify(updated));
    } catch {}
    showToast({ type: "info", title: "Note Removed" });
  };

  const latestVital: HealthMetricReading | null = vitals.length > 0 ? vitals[0] : null;

  const addVitalReading = async (reading: Omit<HealthMetricReading, "id" | "timestamp">) => {
    const newEntry: HealthMetricReading = {
      ...reading,
      id: `vit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      loggedBy: "Manual",
    };
    const updated = [newEntry, ...vitals];
    setVitals(updated);
    localStorage.setItem("healthtrack_vitals", JSON.stringify(updated));

    // Reading Alerts Check
    const hasWarning =
      reading.heartRate < 55 ||
      reading.heartRate > 105 ||
      reading.systolicBp > 135 ||
      reading.diastolicBp > 90 ||
      reading.spo2 < 95;

    if (hasWarning) {
      const alertNotif: NotificationItem = {
        id: `alert-${Date.now()}`,
        title: "Reading Attention Alert",
        message: `Reading (${reading.heartRate} BPM, BP ${reading.systolicBp}/${reading.diastolicBp}) is outside reference range. Please review this reading.`,
        time: "Just now",
        type: "alert",
        isRead: false,
      };
      setNotifications((prev) => [alertNotif, ...prev]);
    }

    try {
      await supabase.from("vitals_history").insert({
        heart_rate: reading.heartRate,
        systolic_bp: reading.systolicBp,
        diastolic_bp: reading.diastolicBp,
        spo2: reading.spo2,
        temperature: reading.temperature,
        notes: reading.notes,
        logged_by: "Manual",
        recorded_at: newEntry.timestamp,
      });
    } catch {}

    showToast({
      type: "success",
      title: "Vitals Recorded",
      message: `HR: ${reading.heartRate} bpm | BP: ${reading.systolicBp}/${reading.diastolicBp} mmHg`,
    });
  };

  const deleteVitalReading = async (id: string) => {
    const updated = vitals.filter((v) => v.id !== id);
    setVitals(updated);
    localStorage.setItem("healthtrack_vitals", JSON.stringify(updated));

    try {
      await supabase.from("vitals_history").delete().eq("id", id);
    } catch {}

    showToast({ type: "info", title: "Record Deleted" });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayActivity = activities.find((a) => a.date === todayStr) || {
    id: "act-today",
    date: todayStr,
    steps: 6842,
    stepGoal: personalGoals.dailySteps || 8000,
    caloriesBurned: 420,
    activeMinutes: 30,
    distanceKm: 5.1,
    workouts: [
      {
        id: "w-demo",
        type: "Running" as const,
        durationMinutes: 30,
        calories: 250,
        time: "07:30 AM",
      },
    ],
  };

  const addActivityEntry = (entry: Partial<ActivityEntry>) => {
    setActivities((prev) => {
      const existsIndex = prev.findIndex((a) => a.date === (entry.date || todayStr));
      let updated: ActivityEntry[];
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = { ...updated[existsIndex], ...entry };
      } else {
        const newAct: ActivityEntry = {
          id: `act-${Date.now()}`,
          date: entry.date || todayStr,
          steps: entry.steps || 0,
          stepGoal: personalGoals.dailySteps,
          caloriesBurned: entry.caloriesBurned || 0,
          activeMinutes: entry.activeMinutes || 0,
          distanceKm: entry.distanceKm || 0,
          workouts: entry.workouts || [],
        };
        updated = [newAct, ...prev];
      }
      return updated;
    });
    showToast({ type: "success", title: "Activity Updated", message: "Steps and workout metrics saved." });
  };

  const addWorkout = (workout: {
    type: "Walking" | "Running" | "Cycling" | "Gym" | "Yoga" | "Swimming";
    durationMinutes: number;
    calories: number;
  }) => {
    const newWorkout = {
      id: `w-${Date.now()}`,
      ...workout,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setActivities((prev) => {
      const current = prev.find((a) => a.date === todayStr) || todayActivity;
      const updatedToday: ActivityEntry = {
        ...current,
        caloriesBurned: current.caloriesBurned + workout.calories,
        activeMinutes: current.activeMinutes + workout.durationMinutes,
        steps: current.steps + (workout.type === "Running" ? 3000 : workout.type === "Walking" ? 2200 : 800),
        distanceKm: Number((current.distanceKm + (workout.type === "Running" ? 3.2 : 1.6)).toFixed(1)),
        workouts: [newWorkout, ...(current.workouts || [])],
      };
      const filtered = prev.filter((a) => a.date !== todayStr);
      return [updatedToday, ...filtered];
    });
    showToast({
      type: "success",
      title: "Workout Logged",
      message: `${workout.type} (${workout.durationMinutes} min) saved!`,
    });
  };

  const latestSleep: SleepEntry | null = sleepData.length > 0 ? sleepData[0] : null;

  const addSleepEntry = async (entry: Omit<SleepEntry, "id">) => {
    const newSleep: SleepEntry = {
      ...entry,
      id: `slp-${Date.now()}`,
    };
    const updated = [newSleep, ...sleepData];
    setSleepData(updated);

    try {
      await supabase.from("sleep_logs").insert({
        date: entry.date,
        bedtime: entry.bedtime,
        wake_time: entry.wakeTime,
        total_hours: entry.totalHours,
        quality_score: entry.qualityScore,
        stages: entry.stages,
        notes: entry.notes,
      });
    } catch {}

    showToast({ type: "success", title: "Sleep Logged", message: `${entry.totalHours} hrs sleep recorded.` });
  };

  const toggleReminder = async (id: string) => {
    const item = reminders.find((r) => r.id === id);
    const updatedState = !item?.isActive;

    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, isActive: updatedState } : r));
      localStorage.setItem("healthtrack_reminders", JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from("reminders").update({ is_active: updatedState }).eq("id", id);
    } catch {}
  };

  const markReminderTaken = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    const item = reminders.find((r) => r.id === id);
    const isAlreadyTaken = item?.lastTakenDate === today;
    const newDate = isAlreadyTaken ? null : today;

    setReminders((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, lastTakenDate: newDate || undefined } : r
      );
      localStorage.setItem("healthtrack_reminders", JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from("reminders").update({ last_taken_date: newDate }).eq("id", id);
    } catch {}

    showToast({ type: "success", title: "Reminder Completed", message: "Care routine marked as done." });
  };

  const addReminder = async (reminder: Omit<ReminderItem, "id" | "isActive">) => {
    const newRem: ReminderItem = {
      ...reminder,
      id: `rem-${Date.now()}`,
      isActive: true,
    };
    const updated = [...reminders, newRem];
    setReminders(updated);
    localStorage.setItem("healthtrack_reminders", JSON.stringify(updated));

    // Notification for reminder addition
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Reminder Set: ${reminder.title}`,
      message: `Scheduled for ${reminder.time} (${reminder.frequency})`,
      time: "Just now",
      type: "reminder",
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    try {
      await supabase.from("reminders").insert({
        title: reminder.title,
        category: reminder.category,
        time: reminder.time,
        dosage_or_detail: reminder.dosageOrDetail,
        frequency: reminder.frequency,
        is_active: true,
      });
    } catch {}

    showToast({ type: "success", title: "Reminder Saved", message: `Scheduled: ${reminder.title}` });
  };

  const deleteReminder = async (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    localStorage.setItem("healthtrack_reminders", JSON.stringify(updated));

    try {
      await supabase.from("reminders").delete().eq("id", id);
    } catch {}

    showToast({ type: "info", title: "Reminder Removed" });
  };

  const logWater = (amountMl: number, beverageType: HydrationLogItem["beverageType"] = "Water") => {
    const newLog: HydrationLogItem = {
      id: `hyd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      amountMl,
      beverageType,
    };
    setHydrationLogs((prev) => [newLog, ...prev]);
    setWaterIntakeTodayMl((prev) => {
      const updated = prev + amountMl;
      localStorage.setItem("healthtrack_water", String(updated));
      return updated;
    });
    showToast({
      type: "info",
      title: "Hydration Logged",
      message: `+${amountMl} ml (${beverageType}) recorded!`,
    });
  };

  const resetWater = () => {
    setWaterIntakeTodayMl(0);
    setHydrationLogs([]);
    localStorage.setItem("healthtrack_water", "0");
  };

  const addMeal = (meal: Omit<MealItem, "id" | "time">) => {
    const newMeal: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMeals((prev) => [newMeal, ...prev]);
    showToast({
      type: "success",
      title: "Meal Logged",
      message: `${meal.name} (+${meal.calories} kcal) added.`,
    });
  };

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast({ type: "info", title: "Meal Removed" });
  };

  const logMood = (entry: Omit<MoodEntry, "id" | "timestamp" | "date">) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const newMood: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
      date: today,
      timestamp: now.toISOString(),
    };
    setMoodLogs((prev) => [newMood, ...prev]);
    showToast({
      type: "success",
      title: "Mental Wellness Logged",
      message: `Mood: ${entry.primaryMood} recorded.`,
    });
  };

  const todayMood: MoodEntry | null = moodLogs.length > 0 ? moodLogs[0] : null;

  const addLabReport = (report: Omit<LabTestReport, "id">) => {
    const newReport: LabTestReport = {
      ...report,
      id: `lab-${Date.now()}`,
    };
    setLabReports((prev) => [newReport, ...prev]);
    showToast({
      type: "success",
      title: "Lab Report Added",
      message: `${report.title} saved to record.`,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const loginDemo = (role: "Student" | "General User" = "Student") => {
    setIsAuthenticated(true);
    localStorage.setItem("healthtrack_auth", "true");
    setProfile((prev) => ({
      ...prev,
      role: role === "Student" ? "Student" : "General User",
      name: role === "Student" ? "Alex Morgan" : "Jordan Morgan",
    }));
    showToast({
      type: "success",
      title: "Signed In",
      message: `Welcome to HealthTrack Pro!`,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("healthtrack_auth", "false");
    showToast({ type: "info", title: "Signed Out", message: "You have securely signed out." });
  };

  const resetAllDataToDefaults = () => {
    setProfile(initialProfile);
    setPersonalGoals(initialPersonalGoals);
    setHealthNotes(initialHealthNotes);
    setVitals(initialVitalsHistory);
    setActivities(initialActivities);
    setSleepData(initialSleepData);
    setReminders(initialReminders);
    setNotifications(initialNotifications);
    setHydrationLogs(initialHydrationLogs);
    setMeals(initialMeals);
    setMoodLogs(initialMoodLogs);
    setLabReports(initialLabReports);
    setWaterIntakeTodayMl(1500);
    localStorage.clear();
    showToast({ type: "info", title: "Data Reset", message: "All health data reset to demo baseline." });
  };

  const healthScoreData = calculateHealthScore({
    restingHeartRate: latestVital ? latestVital.heartRate : 72,
    systolicBp: latestVital ? latestVital.systolicBp : 120,
    diastolicBp: latestVital ? latestVital.diastolicBp : 80,
    spo2: latestVital ? latestVital.spo2 : 98,
    temperature: latestVital ? latestVital.temperature : 98.6,
    steps: todayActivity.steps,
    stepGoal: personalGoals.dailySteps || profile.dailyStepGoal,
    sleepHours: latestSleep ? latestSleep.totalHours : 7.33,
    sleepGoal: personalGoals.dailySleepHours || profile.dailySleepGoalHours,
    waterMl: waterIntakeTodayMl,
    waterGoal: personalGoals.dailyWaterMl || profile.dailyWaterGoalMl,
  });

  return (
    <HealthContext.Provider
      value={{
        language,
        setLanguage,
        t,
        themeMode,
        setThemeMode,
        darkMode,
        toggleDarkMode,
        profile,
        updateProfile,
        personalGoals,
        updatePersonalGoals,
        healthNotes,
        addHealthNote,
        deleteHealthNote,
        vitals,
        latestVital,
        addVitalReading,
        deleteVitalReading,
        activities,
        todayActivity,
        addActivityEntry,
        addWorkout,
        sleepData,
        latestSleep,
        addSleepEntry,
        reminders,
        toggleReminder,
        markReminderTaken,
        addReminder,
        deleteReminder,
        waterIntakeTodayMl,
        hydrationLogs,
        logWater,
        resetWater,
        meals,
        addMeal,
        deleteMeal,
        moodLogs,
        todayMood,
        logMood,
        labReports,
        addLabReport,
        healthScoreData,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        toasts,
        showToast,
        dismissToast,
        isAuthenticated,
        isCloudConnected,
        loginDemo,
        logout,
        resetAllDataToDefaults,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
}
