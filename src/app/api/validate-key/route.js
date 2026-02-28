import { supabase } from "@/lib/supabase-server";

function checkSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }
}

export async function POST(request) {
  try {
    checkSupabase();
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== "string") {
      return Response.json({ valid: false }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("id")
      .eq("key", key.trim())
      .maybeSingle();

    if (error) throw error;

    const valid = !!data;

    return Response.json({ valid });
  } catch (err) {
    console.error("validate-key error:", err);
    return Response.json(
      { error: err.message || "Validation failed", valid: false },
      { status: 500 }
    );
  }
}
