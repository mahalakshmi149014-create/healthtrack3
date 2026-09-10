import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("mood_logs")
      .select("*")
      .order("recorded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch mood logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, primaryMood, energyLevel, stressLevel, tags, journalNote } = body;

    const { data, error } = await supabase
      .from("mood_logs")
      .insert({
        score: Number(score || 3),
        primary_mood: primaryMood || "Calm",
        energy_level: Number(energyLevel || 7),
        stress_level: Number(stressLevel || 3),
        tags: tags || [],
        journal_note: journalNote || null,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to log mental wellness" }, { status: 500 });
  }
}
