export function calculateHealthScore(params: {
  restingHeartRate: number;
  systolicBp: number;
  diastolicBp: number;
  spo2: number;
  temperature: number;
  steps: number;
  stepGoal: number;
  sleepHours: number;
  sleepGoal: number;
  waterMl: number;
  waterGoal: number;
}): {
  overallScore: number;
  cardioScore: number;
  activityScore: number;
  sleepScore: number;
  hydrationScore: number;
  statusText: string;
  statusColor: string;
} {
  const {
    restingHeartRate,
    systolicBp,
    diastolicBp,
    spo2,
    temperature,
    steps,
    stepGoal,
    sleepHours,
    sleepGoal,
    waterMl,
    waterGoal,
  } = params;

  // 1. Cardio score (max 100)
  let cardio = 100;
  // Heart rate penalty
  if (restingHeartRate < 60 || restingHeartRate > 100) {
    cardio -= Math.min(25, Math.abs(restingHeartRate - 75));
  }
  // BP penalty (Normal < 120 and < 80)
  if (systolicBp > 120) {
    cardio -= Math.min(30, (systolicBp - 120) * 1.5);
  }
  if (diastolicBp > 80) {
    cardio -= Math.min(20, (diastolicBp - 80) * 1.5);
  }
  // SpO2 penalty
  if (spo2 < 95) {
    cardio -= (95 - spo2) * 8;
  }
  // Temp penalty
  if (temperature > 99.0 || temperature < 97.0) {
    cardio -= Math.abs(temperature - 98.6) * 10;
  }
  cardio = Math.max(20, Math.min(100, Math.round(cardio)));

  // 2. Activity score (max 100)
  const activityRatio = Math.min(1.2, steps / (stepGoal || 8000));
  const activityScore = Math.max(10, Math.min(100, Math.round(activityRatio * 90)));

  // 3. Sleep score (max 100)
  const sleepRatio = Math.min(1.1, sleepHours / (sleepGoal || 8));
  let sleepScore = Math.round(sleepRatio * 95);
  if (sleepHours < 6) sleepScore = Math.max(30, sleepScore - 25);
  sleepScore = Math.max(10, Math.min(100, sleepScore));

  // 4. Hydration score (max 100)
  const hydrationRatio = Math.min(1.1, waterMl / (waterGoal || 2500));
  const hydrationScore = Math.max(10, Math.min(100, Math.round(hydrationRatio * 95)));

  // Overall weighted score: Cardio (35%), Sleep (25%), Activity (25%), Hydration (15%)
  const overallScore = Math.round(
    cardio * 0.35 + sleepScore * 0.25 + activityScore * 0.25 + hydrationScore * 0.15
  );

  let statusText = "Excellent Health Condition";
  let statusColor = "text-emerald-600 dark:text-emerald-400";

  if (overallScore < 60) {
    statusText = "Needs Attention";
    statusColor = "text-rose-600 dark:text-rose-400";
  } else if (overallScore < 75) {
    statusText = "Moderate Wellness";
    statusColor = "text-amber-600 dark:text-amber-400";
  } else if (overallScore < 88) {
    statusText = "Good & Stable";
    statusColor = "text-teal-600 dark:text-teal-400";
  }

  return {
    overallScore,
    cardioScore: cardio,
    activityScore,
    sleepScore,
    hydrationScore,
    statusText,
    statusColor,
  };
}

export function getBpCategory(systolic: number, diastolic: number): {
  category: "Normal" | "Elevated" | "Stage 1 HTN" | "Stage 2 HTN" | "Crisis";
  badgeClass: string;
  desc: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return {
      category: "Normal",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      desc: "Optimal blood pressure (<120 / <80 mmHg)",
    };
  } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: "Elevated",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      desc: "Elevated systolic reading (120-129 mmHg)",
    };
  } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: "Stage 1 HTN",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
      desc: "Stage 1 Hypertension (130-139 / 80-89 mmHg)",
    };
  } else if (systolic >= 180 || diastolic >= 120) {
    return {
      category: "Crisis",
      badgeClass: "bg-rose-600 text-white animate-pulse border-rose-700",
      desc: "Hypertensive crisis. Seek immediate medical care.",
    };
  } else {
    return {
      category: "Stage 2 HTN",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
      desc: "Stage 2 Hypertension (≥140 or ≥90 mmHg)",
    };
  }
}

export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  colorClass: string;
} {
  if (!heightCm || !weightKg) return { bmi: 22.0, category: "Normal", colorClass: "text-emerald-600" };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: "Underweight", colorClass: "text-sky-600 dark:text-sky-400" };
  if (bmi <= 24.9) return { bmi, category: "Normal", colorClass: "text-emerald-600 dark:text-emerald-400" };
  if (bmi <= 29.9) return { bmi, category: "Overweight", colorClass: "text-amber-600 dark:text-amber-400" };
  return { bmi, category: "Obese", colorClass: "text-rose-600 dark:text-rose-400" };
}
