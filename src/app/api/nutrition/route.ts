import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch meals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mealType, calories, proteinG, carbsG, fatG } = body;

    if (!name || !calories) {
      return NextResponse.json({ success: false, error: "name and calories are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("meals")
      .insert({
        name,
        meal_type: mealType || "Lunch",
        calories: Number(calories),
        protein_g: Number(proteinG || 0),
        carbs_g: Number(carbsG || 0),
        fat_g: Number(fatG || 0),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to log meal" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Meal id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("meals").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Meal entry deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete meal" }, { status: 500 });
  }
}
