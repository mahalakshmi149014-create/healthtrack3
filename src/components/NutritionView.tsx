"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import {
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  Apple,
  Clock,
  PieChart as PieIcon,
  Flame,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { MealItem } from "@/types/health";

export function NutritionView() {
  const { meals, addMeal, deleteMeal, profile } = useHealth();
  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<MealItem["mealType"]>("Lunch");
  const [calories, setCalories] = useState<number | "">("");
  const [proteinG, setProteinG] = useState<number | "">("");
  const [carbsG, setCarbsG] = useState<number | "">("");
  const [fatG, setFatG] = useState<number | "">("");
  const [showAddForm, setShowAddForm] = useState(false);

  const calorieGoal = profile.dailyCalorieGoal || 2200;

  // Calculate Totals
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fatG, 0);

  const calPercent = Math.min(100, Math.round((totalCalories / calorieGoal) * 100));

  const quickMealIdeas = [
    { name: "Avocado & Poached Egg Toast", type: "Breakfast" as const, cal: 380, p: 16, c: 32, f: 22 },
    { name: "Grilled Chicken Mediterranean Bowl", type: "Lunch" as const, cal: 560, p: 46, c: 48, f: 18 },
    { name: "Whey Protein & Berry Smoothie", type: "Snack" as const, cal: 280, p: 30, c: 28, f: 4 },
    { name: "Tofu, Broccoli & Brown Rice Stir-fry", type: "Dinner" as const, cal: 520, p: 28, c: 64, f: 16 },
  ];

  const handleQuickAdd = (idea: (typeof quickMealIdeas)[0]) => {
    addMeal({
      name: idea.name,
      mealType: idea.type,
      calories: idea.cal,
      proteinG: idea.p,
      carbsG: idea.c,
      fatG: idea.f,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !calories) return;

    addMeal({
      name: name.trim(),
      mealType,
      calories: Number(calories),
      proteinG: Number(proteinG || 0),
      carbsG: Number(carbsG || 0),
      fatG: Number(fatG || 0),
    });

    setName("");
    setCalories("");
    setProteinG("");
    setCarbsG("");
    setFatG("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            Nutritional Intelligence & Macronutrient Intake
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track daily caloric targets, lean protein distribution, glycemic load, and healthy lipids
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Close Form" : "Log Custom Meal"}
        </button>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calorie Progress Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-black tracking-widest text-emerald-100">
              Daily Calories
            </span>
            <Flame className="w-4 h-4 text-emerald-200" />
          </div>

          <div className="my-4">
            <div className="text-4xl font-black">{totalCalories}</div>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Target: {calorieGoal} kcal ({calorieGoal - totalCalories} kcal left)
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-100 font-semibold">
              <span>{calPercent}% of Goal</span>
              <span>{totalCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Protein Macro */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Protein
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[10px] font-black">
              Lean Tissue
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalProtein} <span className="text-sm font-semibold text-slate-400">g</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: ~130g daily</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((totalProtein / 130) * 100))}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates Macro */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Carbohydrates
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-[10px] font-black">
              Glycemic Energy
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalCarbs} <span className="text-sm font-semibold text-slate-400">g</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: ~240g daily</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((totalCarbs / 240) * 100))}%` }}
            />
          </div>
        </div>

        {/* Healthy Fats Macro */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Healthy Fats
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-[10px] font-black">
              Hormonal Balance
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {totalFat} <span className="text-sm font-semibold text-slate-400">g</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Target: ~65g daily</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((totalFat / 65) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Custom Meal Logger Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Apple className="w-4 h-4 text-emerald-500" />
            Log Custom Nutrition & Macro Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Meal Name</label>
              <input
                type="text"
                placeholder="e.g. Quinoa Salad with Grilled Chicken"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Category</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Calories (kcal)</label>
              <input
                type="number"
                placeholder="e.g. 520"
                value={calories}
                onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Protein (g)</label>
              <input
                type="number"
                placeholder="e.g. 35"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 mb-1 block">Carbs (g)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={carbsG}
                onChange={(e) => setCarbsG(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Save Meal Entry
            </button>
          </div>
        </form>
      )}

      {/* Quick Meal Recommendations Strip */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Smart Meal Quick-Log Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickMealIdeas.map((idea) => (
            <div
              key={idea.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {idea.type}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {idea.cal} kcal
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {idea.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {idea.p}g Protein • {idea.c}g Carbs • {idea.f}g Fat
                </p>
              </div>

              <button
                onClick={() => handleQuickAdd(idea)}
                className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
              >
                + Quick Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Today&apos;s Nutrition Journal
        </h3>

        {meals.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No meals logged yet today.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {meals.map((meal) => (
              <div key={meal.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {meal.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {meal.mealType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {meal.proteinG}g Protein • {meal.carbsG}g Carbs • {meal.fatG}g Fat • {meal.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    +{meal.calories} kcal
                  </span>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Remove Meal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
