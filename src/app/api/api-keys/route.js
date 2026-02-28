import { supabase } from "@/lib/supabase-server";

function checkSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local"
    );
  }
}

export async function GET() {
  try {
    checkSupabase();
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const apiKeys = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      key: row.key,
      type: row.type,
      usage: row.usage ?? 0,
    }));

    return Response.json({ apiKeys });
  } catch (err) {
    console.error("GET api-keys error:", err);
    return Response.json(
      { error: err.message || "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    checkSupabase();
    const body = await request.json();
    const { name, key, type = "dev" } = body;

    if (!name || !key) {
      return Response.json(
        { error: "name and key are required" },
        { status: 400 }
      );
    }

    const insertType = ["dev", "prod"].includes(String(type)) ? String(type) : "dev";

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        name: String(name).trim(),
        key: String(key).trim(),
        type: insertType,
        usage: 0,
        updated_at: new Date().toISOString(),
      })
      .select("id, name, key, type, usage")
      .single();

    if (error) throw error;

    const newKey = {
      id: data.id,
      name: data.name,
      key: data.key,
      type: data.type,
      usage: data.usage ?? 0,
    };

    return Response.json(newKey, { status: 201 });
  } catch (err) {
    console.error("POST api-keys error:", err);
    return Response.json(
      { error: err.message || "Failed to create API key" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    checkSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "id query param is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, key, type, usage } = body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (name != null) updates.name = String(name).trim();
    if (key != null) updates.key = String(key).trim();
    if (type != null && ["dev", "prod"].includes(String(type))) updates.type = String(type);
    if (usage != null) updates.usage = Number(usage) || 0;

    const { data, error } = await supabase
      .from("api_keys")
      .update(updates)
      .eq("id", id)
      .select("id, name, key, type, usage")
      .single();

    if (error) throw error;

    if (!data) {
      return Response.json({ error: "API key not found" }, { status: 404 });
    }

    const updated = {
      id: data.id,
      name: data.name,
      key: data.key,
      type: data.type,
      usage: data.usage ?? 0,
    };

    return Response.json(updated);
  } catch (err) {
    console.error("PUT api-keys error:", err);
    return Response.json(
      { error: err.message || "Failed to update API key" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    checkSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "id query param is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) throw error;

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE api-keys error:", err);
    return Response.json(
      { error: err.message || "Failed to delete API key" },
      { status: 500 }
    );
  }
}
