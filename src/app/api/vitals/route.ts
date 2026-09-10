import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const { data, error } = await supabase
      .from("vitals_history")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch vitals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { heartRate, systolicBp, diastolicBp, spo2, temperature, notes, loggedBy } = body;

    if (!heartRate || !systolicBp || !diastolicBp) {
      return NextResponse.json(
        { success: false, error: "heartRate, systolicBp, and diastolicBp are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("vitals_history")
      .insert({
        heart_rate: Number(heartRate),
        systolic_bp: Number(systolicBp),
        diastolic_bp: Number(diastolicBp),
        spo2: Number(spo2 || 98),
        temperature: Number(temperature || 98.6),
        notes: notes || null,
        logged_by: loggedBy || "Manual",
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create vital entry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Vital reading id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("vitals_history").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Vital record deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete vital" }, { status: 500 });
  }
}
