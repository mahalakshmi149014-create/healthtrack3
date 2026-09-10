import { HealthMetricReading, ActivityEntry, SleepEntry, ReminderItem, UserHealthProfile, NotificationItem } from "@/types/health";

export const initialProfile: UserHealthProfile = {
  name: "HealthTrack User",
  email: "",
  role: "Student",
  age: 20,
  gender: "Prefer not to say",
  bloodGroup: "O+",
  heightCm: 170,
  weightKg: 65,
  dailyStepGoal: 8000,
  dailyWaterGoalMl: 2500,
  dailySleepGoalHours: 8,
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    doctorName: "",
    doctorPhone: "",
  },
  medicalConditions: [],
  allergies: [],
};

export const initialVitalsHistory: HealthMetricReading[] = [];

export const initialActivities: ActivityEntry[] = [
  {
    id: "act-today",
    date: new Date().toISOString().split("T")[0],
    steps: 0,
    stepGoal: 8000,
    caloriesBurned: 0,
    activeMinutes: 0,
    distanceKm: 0,
    workouts: [],
  },
];

export const initialSleepData: SleepEntry[] = [];

export const initialReminders: ReminderItem[] = [];

export const initialNotifications: NotificationItem[] = [];
