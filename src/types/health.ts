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
  dailyCalorieGoal?: number;
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

export interface HydrationLogItem {
  id: string;
  timestamp: string; // ISO
  amountMl: number;
  beverageType: "Water" | "Electrolyte" | "Tea" | "Coffee" | "Juice";
}

export interface MealItem {
  id: string;
  name: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  time: string;
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  score: 1 | 2 | 3 | 4 | 5; // 1: Anxious/Exhausted, 2: Low, 3: Neutral/Calm, 4: Good, 5: Energetic/Thriving
  primaryMood: "Energetic" | "Calm" | "Neutral" | "Stressed" | "Anxious" | "Exhausted";
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  tags: string[]; // e.g. ["Work", "Workout", "Meditation", "Poor Sleep"]
  journalNote?: string;
}

export interface LabTestReport {
  id: string;
  title: string;
  testDate: string;
  category: "Lipid Panel" | "Complete Blood Count (CBC)" | "Metabolic Panel" | "Thyroid Panel" | "Other";
  status: "Normal" | "Attention Required" | "Critical";
  summary: string;
  markers: {
    name: string;
    value: number | string;
    unit: string;
    referenceRange: string;
    status: "normal" | "low" | "high";
    clinicalContext: string;
  }[];
}

