import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Fetch vitals history, reminders, and profile for clinical summary
    const [vitalsRes, remindersRes, profileRes] = await Promise.all([
      supabase.from("vitals_history").select("*").order("recorded_at", { ascending: false }).limit(20),
      supabase.from("reminders").select("*").order("created_at", { ascending: true }),
      supabase.from("profiles").select("*").limit(1).single(),
    ]);

    const vitals = vitalsRes.data || [];
    const hrVals = vitals.map((v: any) => v.heart_rate);
    const avgHr = hrVals.length ? Math.round(hrVals.reduce((a: number, b: number) => a + b, 0) / hrVals.length) : 72;

    const sysVals = vitals.map((v: any) => v.systolic_bp);
    const avgSys = sysVals.length ? Math.round(sysVals.reduce((a: number, b: number) => a + b, 0) / sysVals.length) : 120;

    const diaVals = vitals.map((v: any) => v.diastolic_bp);
    const avgDia = diaVals.length ? Math.round(diaVals.reduce((a: number, b: number) => a + b, 0) / diaVals.length) : 80;

    return NextResponse.json({
      success: true,
      reportToken: token || "cl_token_" + Date.now(),
      generatedAt: new Date().toISOString(),
      patient: profileRes.data || { name: "Alex Morgan", age: 22, role: "Student" },
      summary: {
        totalVitalsCount: vitals.length,
        averageHeartRate: avgHr,
        meanBloodPressure: `${avgSys}/${avgDia} mmHg`,
        activeMedicationCount: (remindersRes.data || []).filter((r: any) => r.is_active).length,
      },
      vitals,
      reminders: remindersRes.data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to generate report" }, { status: 500 });
  }
}
