"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HealthMetricReading,
  ActivityEntry,
  SleepEntry,
  ReminderItem,
  UserHealthProfile,
  NotificationItem,
} from "@/types/health";
import {
  initialProfile,
  initialVitalsHistory,
  initialActivities,
  initialSleepData,
  initialReminders,
  initialNotifications,
} from "@/data/mockData";
import { calculateHealthScore } from "@/utils/healthCalc";
import { supabase } from "@/lib/supabase";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message?: string;
}

interface HealthContextType {
  profile: UserHealthProfile;
  updateProfile: (data: Partial<UserHealthProfile>) => Promise<void>;
  vitals: HealthMetricReading[];
  latestVital: HealthMetricReading | null;
  addVitalReading: (reading: Omit<HealthMetricReading, "id" | "timestamp">) => Promise<void>;
  deleteVitalReading: (id: string) => Promise<void>;
  activities: ActivityEntry[];
  todayActivity: ActivityEntry;
  addActivityEntry: (entry: Partial<ActivityEntry>) => void;
  addWorkout: (workout: { type: "Walking" | "Running" | "Cycling" | "Gym" | "Yoga" | "Swimming"; durationMinutes: number; calories: number }) => void;
  sleepData: SleepEntry[];
  latestSleep: SleepEntry | null;
  addSleepEntry: (entry: Omit<SleepEntry, "id">) => Promise<void>;
  reminders: ReminderItem[];
  toggleReminder: (id: string) => Promise<void>;
  markReminderTaken: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<ReminderItem, "id" | "isActive">) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  waterIntakeTodayMl: number;
  logWater: (amountMl: number) => void;
  resetWater: () => void;
  healthScoreData: ReturnType<typeof calculateHealthScore>;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  isCloudConnected: boolean;
  loginDemo: (role?: "Student" | "General User") => void;
  logout: () => void;
  resetAllDataToDefaults: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserHealthProfile>(initialProfile);
  const [vitals, setVitals] = useState<HealthMetricReading[]>(initialVitalsHistory);
  const [activities, setActivities] = useState<ActivityEntry[]>(initialActivities);
  const [sleepData, setSleepData] = useState<SleepEntry[]>(initialSleepData);
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [waterIntakeTodayMl, setWaterIntakeTodayMl] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Sync / Fetch initial data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        // Test connection & load vitals from Supabase
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

        // Load reminders from Supabase
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

        // Load profile from Supabase
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
      } catch {
        // Fallback to clean state
      }

      // Check local storage for theme/cache
      try {
        const savedTheme = localStorage.getItem("healthtrack_darkmode");
        if (savedTheme !== null) {
          const isDark = JSON.parse(savedTheme);
          setDarkMode(isDark);
          if (isDark) document.documentElement.classList.add("dark");
        }
      } catch {}
    }

    loadData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("healthtrack_darkmode", JSON.stringify(next));
      return next;
    });
  };

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

    showToast({ type: "success", title: "Profile Synced", message: "Health profile synchronized with Supabase." });
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
      title: "Vitals Recorded & Synced",
      message: `HR: ${reading.heartRate} bpm | BP: ${reading.systolicBp}/${reading.diastolicBp} mmHg (Saved to Supabase)`,
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
    steps: 0,
    stepGoal: profile.dailyStepGoal,
    caloriesBurned: 0,
    activeMinutes: 0,
    distanceKm: 0,
    workouts: [],
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
          stepGoal: profile.dailyStepGoal,
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

  const addWorkout = (workout: { type: "Walking" | "Running" | "Cycling" | "Gym" | "Yoga" | "Swimming"; durationMinutes: number; calories: number }) => {
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
    showToast({ type: "success", title: "Workout Logged", message: `${workout.type} (${workout.durationMinutes} min) saved!` });
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

    showToast({ type: "success", title: "Sleep Logged", message: `${entry.totalHours} hrs sleep recorded to cloud.` });
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

    showToast({ type: "success", title: "Status Updated", message: "Reminder marked as completed!" });
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

  const logWater = (amountMl: number) => {
    setWaterIntakeTodayMl((prev) => {
      const updated = prev + amountMl;
      localStorage.setItem("healthtrack_water", String(updated));
      return updated;
    });
    showToast({
      type: "info",
      title: "Hydration Logged",
      message: `+${amountMl} ml recorded! (${waterIntakeTodayMl + amountMl} / ${profile.dailyWaterGoalMl} ml)`,
    });
  };

  const resetWater = () => {
    setWaterIntakeTodayMl(0);
    localStorage.setItem("healthtrack_water", "0");
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
      name: "HealthTrack User",
    }));
    showToast({
      type: "success",
      title: "Signed In",
      message: `Welcome to HealthTrack!`,
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("healthtrack_auth", "false");
    showToast({ type: "info", title: "Signed Out", message: "You have securely signed out." });
  };

  const resetAllDataToDefaults = () => {
    setProfile(initialProfile);
    setVitals([]);
    setActivities(initialActivities);
    setSleepData([]);
    setReminders([]);
    setNotifications([]);
    setWaterIntakeTodayMl(0);
    localStorage.clear();
    showToast({ type: "info", title: "Data Cleared", message: "All health data reset to clean initial state." });
  };

  const healthScoreData = calculateHealthScore({
    restingHeartRate: latestVital ? latestVital.heartRate : 72,
    systolicBp: latestVital ? latestVital.systolicBp : 120,
    diastolicBp: latestVital ? latestVital.diastolicBp : 80,
    spo2: latestVital ? latestVital.spo2 : 98,
    temperature: latestVital ? latestVital.temperature : 98.6,
    steps: todayActivity.steps,
    stepGoal: profile.dailyStepGoal,
    sleepHours: latestSleep ? latestSleep.totalHours : 8,
    sleepGoal: profile.dailySleepGoalHours,
    waterMl: waterIntakeTodayMl,
    waterGoal: profile.dailyWaterGoalMl,
  });

  return (
    <HealthContext.Provider
      value={{
        profile,
        updateProfile,
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
        logWater,
        resetWater,
        healthScoreData,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        toasts,
        showToast,
        dismissToast,
        darkMode,
        toggleDarkMode,
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
