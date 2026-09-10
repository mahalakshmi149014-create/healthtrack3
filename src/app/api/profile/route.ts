import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || null });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      role,
      age,
      gender,
      bloodGroup,
      heightCm,
      weightKg,
      dailyStepGoal,
      dailyWaterGoalMl,
      dailySleepGoalHours,
      emergencyContact,
      medicalConditions,
      allergies,
    } = body;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        name,
        email,
        role: role || "Student",
        age: Number(age || 20),
        gender: gender || "Prefer not to say",
        blood_group: bloodGroup || "O+",
        height_cm: Number(heightCm || 170),
        weight_kg: Number(weightKg || 65),
        daily_step_goal: Number(dailyStepGoal || 8000),
        daily_water_goal_ml: Number(dailyWaterGoalMl || 2500),
        daily_sleep_goal_hours: Number(dailySleepGoalHours || 8),
        emergency_contact: emergencyContact || {},
        medical_conditions: medicalConditions || [],
        allergies: allergies || [],
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to upsert profile" }, { status: 500 });
  }
}
