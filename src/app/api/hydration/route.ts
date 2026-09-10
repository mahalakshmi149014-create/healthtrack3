import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("hydration_logs")
      .select("*")
      .order("recorded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch hydration" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amountMl, beverageType } = body;

    if (!amountMl || amountMl <= 0) {
      return NextResponse.json({ success: false, error: "Valid amountMl is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("hydration_logs")
      .insert({
        amount_ml: Number(amountMl),
        beverage_type: beverageType || "Water",
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to log hydration" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Hydration log id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("hydration_logs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Hydration log deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete log" }, { status: 500 });
  }
}
