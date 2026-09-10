export type VitalStatus = "optimal" | "normal" | "attention" | "critical";

export interface HealthMetricReading {
  id: string;
  timestamp: string; // ISO format
  heartRate: number; // bpm
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  spo2: number; // %
  temperature: number; // °F
  steps?: number;
  notes?: string;
  loggedBy?: "Manual" | "Sync" | "Sensor";
}

export interface ActivityEntry {
  id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  stepGoal: number;
  caloriesBurned: number;
  activeMinutes: number;
  distanceKm: number;
  workouts: {
    id: string;
    type: "Walking" | "Running" | "Cycling" | "Gym" | "Yoga" | "Swimming";
    durationMinutes: number;
    calories: number;
    time: string;
  }[];
}

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // e.g. "23:15"
  wakeTime: string; // e.g. "07:05"
  totalHours: number;
  qualityScore: number; // 0 - 100
  stages: {
    deepMinutes: number;
    remMinutes: number;
    lightMinutes: number;
    awakeMinutes: number;
  };
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: "Medicine" | "Water" | "Exercise" | "Checkup" | "Sleep";
  time: string; // "08:00 AM" or "14:30"
  dosageOrDetail?: string; // e.g., "1 Tablet after food", "250 ml", "30 mins cardio"
  frequency: "Daily" | "Weekdays" | "Weekly" | "As Needed";
  isActive: boolean;
  lastTakenDate?: string; // YYYY-MM-DD
}

export interface UserHealthProfile {
  name: string;
  email: string;
  role: "Student" | "General User" | "Athlete" | "Senior";
  age: number;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  dailyStepGoal: number;
  dailyWaterGoalMl: number;
  dailySleepGoalHours: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    doctorName?: string;
    doctorPhone?: string;
  };
  medicalConditions: string[];
  allergies: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "alert" | "milestone" | "info";
  isRead: boolean;
}
