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
} from "@/types/health";


export const initialProfile: UserHealthProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@healthtrack.io",
  role: "Student",
  age: 22,
  gender: "Prefer not to say",
  bloodGroup: "O+",
  heightCm: 174,
  weightKg: 68,
  dailyStepGoal: 10000,
  dailyWaterGoalMl: 2800,
  dailySleepGoalHours: 8,
  dailyCalorieGoal: 2200,
  emergencyContact: {
    name: "Jordan Morgan",
    relationship: "Guardian / Parent",
    phone: "+1 (555) 234-5678",
    doctorName: "Dr. Sarah Jenkins, MD",
    doctorPhone: "+1 (555) 987-6543",
  },
  medicalConditions: ["Mild Seasonal Allergies"],
  allergies: ["Penicillin", "Pollen"],
};

export const initialVitalsHistory: HealthMetricReading[] = [
  {
    id: "vit-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    heartRate: 72,
    systolicBp: 118,
    diastolicBp: 78,
    spo2: 99,
    temperature: 98.4,
    notes: "Resting reading after afternoon hydration",
    loggedBy: "Manual",
  },
  {
    id: "vit-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    heartRate: 76,
    systolicBp: 122,
    diastolicBp: 80,
    spo2: 98,
    temperature: 98.6,
    notes: "Post-workout baseline check",
    loggedBy: "Sync",
  },
  {
    id: "vit-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    heartRate: 68,
    systolicBp: 116,
    diastolicBp: 76,
    spo2: 99,
    temperature: 98.2,
    notes: "Morning resting baseline",
    loggedBy: "Manual",
  },
  {
    id: "vit-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    heartRate: 74,
    systolicBp: 120,
    diastolicBp: 79,
    spo2: 98,
    temperature: 98.7,
    notes: "Routine evening vitals check",
    loggedBy: "Manual",
  },
];

export const initialActivities: ActivityEntry[] = [
  {
    id: "act-today",
    date: new Date().toISOString().split("T")[0],
    steps: 7420,
    stepGoal: 10000,
    caloriesBurned: 485,
    activeMinutes: 45,
    distanceKm: 5.4,
    workouts: [
      {
        id: "w-1",
        type: "Running",
        durationMinutes: 30,
        calories: 320,
        time: "07:30 AM",
      },
      {
        id: "w-2",
        type: "Walking",
        durationMinutes: 15,
        calories: 85,
        time: "12:45 PM",
      },
    ],
  },
  {
    id: "act-yesterday",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    steps: 10250,
    stepGoal: 10000,
    caloriesBurned: 620,
    activeMinutes: 60,
    distanceKm: 7.8,
    workouts: [
      {
        id: "w-3",
        type: "Cycling",
        durationMinutes: 45,
        calories: 450,
        time: "06:15 PM",
      },
    ],
  },
];

export const initialSleepData: SleepEntry[] = [
  {
    id: "slp-1",
    date: new Date().toISOString().split("T")[0],
    bedtime: "23:15",
    wakeTime: "07:15",
    totalHours: 8.0,
    qualityScore: 91,
    stages: {
      deepMinutes: 120,
      remMinutes: 110,
      lightMinutes: 220,
      awakeMinutes: 30,
    },
    notes: "Deep restful sleep, consistent circadian rhythm",
  },
  {
    id: "slp-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    bedtime: "23:45",
    wakeTime: "07:00",
    totalHours: 7.25,
    qualityScore: 84,
    stages: {
      deepMinutes: 95,
      remMinutes: 90,
      lightMinutes: 215,
      awakeMinutes: 35,
    },
    notes: "Good rest, slight waking around 4 AM",
  },
];

export const initialReminders: ReminderItem[] = [
  {
    id: "rem-1",
    title: "Morning Multivitamin & Omega-3",
    category: "Medicine",
    time: "08:30 AM",
    dosageOrDetail: "1 Softgel with breakfast",
    frequency: "Daily",
    isActive: true,
    lastTakenDate: new Date().toISOString().split("T")[0],
  },
  {
    id: "rem-2",
    title: "Midday Hydration Refill",
    category: "Water",
    time: "01:00 PM",
    dosageOrDetail: "500 ml electrolyte water",
    frequency: "Daily",
    isActive: true,
  },
  {
    id: "rem-3",
    title: "Evening Aerobic Cardio / Walk",
    category: "Exercise",
    time: "06:30 PM",
    dosageOrDetail: "45 mins zone 2 brisk pace",
    frequency: "Daily",
    isActive: true,
  },
  {
    id: "rem-4",
    title: "Annual Preventive Health Screening",
    category: "Checkup",
    time: "10:00 AM",
    dosageOrDetail: "Dr. Jenkins Clinical Lab Review",
    frequency: "Weekly",
    isActive: true,
  },
];

export const initialHydrationLogs: HydrationLogItem[] = [
  {
    id: "hyd-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    amountMl: 500,
    beverageType: "Water",
  },
  {
    id: "hyd-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    amountMl: 350,
    beverageType: "Electrolyte",
  },
  {
    id: "hyd-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    amountMl: 400,
    beverageType: "Water",
  },
  {
    id: "hyd-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    amountMl: 250,
    beverageType: "Tea",
  },
];

export const initialMeals: MealItem[] = [
  {
    id: "meal-1",
    name: "Oatmeal with Blueberries, Chia Seeds & Whey Protein",
    mealType: "Breakfast",
    calories: 460,
    proteinG: 34,
    carbsG: 58,
    fatG: 10,
    time: "08:15 AM",
  },
  {
    id: "meal-2",
    name: "Grilled Salmon Bowl with Quinoa, Avocado & Greens",
    mealType: "Lunch",
    calories: 680,
    proteinG: 48,
    carbsG: 62,
    fatG: 26,
    time: "01:10 PM",
  },
  {
    id: "meal-3",
    name: "Greek Yogurt with Mixed Almonds & Honey",
    mealType: "Snack",
    calories: 240,
    proteinG: 18,
    carbsG: 22,
    fatG: 8,
    time: "04:30 PM",
  },
];

export const initialMoodLogs: MoodEntry[] = [
  {
    id: "mood-1",
    date: new Date().toISOString().split("T")[0],
    timestamp: new Date().toISOString(),
    score: 4,
    primaryMood: "Energetic",
    energyLevel: 8,
    stressLevel: 3,
    tags: ["Workout Done", "Good Sleep", "Hydrated"],
    journalNote: "Feeling focused and energized after morning workout and balanced nutrition.",
  },
  {
    id: "mood-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    score: 4,
    primaryMood: "Calm",
    energyLevel: 7,
    stressLevel: 4,
    tags: ["Meditation", "Walk in Park"],
    journalNote: "Productive day with low cognitive strain.",
  },
];

export const initialLabReports: LabTestReport[] = [
  {
    id: "lab-1",
    title: "Comprehensive Metabolic & Lipid Panel",
    testDate: new Date(Date.now() - 1000 * 3600 * 24 * 14).toISOString().split("T")[0],
    category: "Lipid Panel",
    status: "Normal",
    summary: "All cardiovascular lipid markers and fasting blood glucose are within optimal clinical safety ranges.",
    markers: [
      {
        name: "Total Cholesterol",
        value: 174,
        unit: "mg/dL",
        referenceRange: "< 200 mg/dL",
        status: "normal",
        clinicalContext: "Total circulating cholesterol is well within desirable limits.",
      },
      {
        name: "HDL ('Good') Cholesterol",
        value: 58,
        unit: "mg/dL",
        referenceRange: "> 45 mg/dL",
        status: "normal",
        clinicalContext: "Protective high-density lipoprotein level indicates good cardiovascular defense.",
      },
      {
        name: "LDL ('Bad') Cholesterol",
        value: 96,
        unit: "mg/dL",
        referenceRange: "< 100 mg/dL",
        status: "normal",
        clinicalContext: "Optimal atherogenic lipoprotein clearance.",
      },
      {
        name: "Triglycerides",
        value: 100,
        unit: "mg/dL",
        referenceRange: "< 150 mg/dL",
        status: "normal",
        clinicalContext: "Normal fasting serum triglycerides.",
      },
      {
        name: "Fasting Blood Glucose",
        value: 88,
        unit: "mg/dL",
        referenceRange: "70 - 99 mg/dL",
        status: "normal",
        clinicalContext: "Healthy baseline glycemic regulation.",
      },
    ],
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Daily Step Goal Milestone! 🎯",
    message: "You're at 7,420 steps today — only 2,580 more to hit your 10k goal!",
    time: "20m ago",
    type: "milestone",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Hydration Checkpoint 💧",
    message: "You logged 1,500 ml so far. Drink another glass of water before dinner!",
    time: "1h ago",
    type: "reminder",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Vitals Synchronized 🩺",
    message: "Resting BP 118/78 and SpO2 99% logged to your medical history.",
    time: "3h ago",
    type: "info",
    isRead: true,
  },
];

export const initialHealthNotes: HealthNoteEntry[] = [
  {
    id: "note-1",
    date: new Date().toISOString().split("T")[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    category: "Workout",
    title: "Morning 5k Run Completed",
    content: "Felt strong during the 30-minute interval jog. Good cardiovascular recovery rate, heart rate normalized within 4 minutes.",
    tags: ["Running", "High Energy", "Post-Recovery"],
  },
  {
    id: "note-2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    timestamp: new Date(Date.now() - 86400000 - 1000 * 60 * 300).toISOString(),
    category: "Observation",
    title: "Slight fatigue in the afternoon",
    content: "Noticed brief lethargy around 3 PM after studying. Drank 500ml water and took a 10 min stroll outside, felt refreshed.",
    tags: ["Hydration", "Focus", "Rest"],
  },
  {
    id: "note-3",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: "Doctor Appointment",
    title: "Routine Primary Care Checkup with Dr. Jenkins",
    content: "Reviewed blood pressure (118/78 mmHg) and lipid panel. Dr. confirmed vitals are in optimal ranges. Advised keeping water intake around 2.5 - 3 Liters.",
    tags: ["Checkup", "AHA Optimal", "Doctor Review"],
  },
];

export const initialPersonalGoals: PersonalHealthGoals = {
  dailySteps: 8000,
  dailyWaterMl: 2500,
  dailySleepHours: 8,
  dailyWorkoutMinutes: 30,
  dailyActiveCalories: 500,
};


