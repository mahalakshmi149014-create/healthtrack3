import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch reminders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, time, dosageOrDetail, frequency } = body;

    if (!title || !category || !time) {
      return NextResponse.json({ success: false, error: "title, category, and time are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reminders")
      .insert({
        title,
        category,
        time,
        dosage_or_detail: dosageOrDetail || null,
        frequency: frequency || "Daily",
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to create reminder" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isActive, lastTakenDate } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Reminder id is required" }, { status: 400 });
    }

    const updates: any = {};
    if (typeof isActive === "boolean") updates.is_active = isActive;
    if (lastTakenDate !== undefined) updates.last_taken_date = lastTakenDate;

    const { data, error } = await supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update reminder" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Reminder id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("reminders").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Reminder deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete reminder" }, { status: 500 });
  }
}
