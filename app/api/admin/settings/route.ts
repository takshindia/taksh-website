import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "admin-settings.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readSettingsFile() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeSettingsFile(data: Record<string, any>) {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function isMissingSupabaseTableError(error: any) {
  return /Could not find the table|does not exist|schema cache/i.test(
    error?.message || ""
  );
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const fallback = await readSettingsFile();
        return NextResponse.json({ settings: fallback || null }, { status: 200 });
      }

      return NextResponse.json({ settings: null }, { status: 200 });
    }

    return NextResponse.json({ settings: data });
  } catch (error: any) {
    if (isMissingSupabaseTableError(error)) {
      const fallback = await readSettingsFile();
      return NextResponse.json({ settings: fallback || null }, { status: 200 });
    }

    return NextResponse.json({ settings: null }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      id: 1,
      business_name: String(body.business_name || "").trim(),
      logo: String(body.logo || "").trim(),
      gst: String(body.gst || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim(),
      social_links: String(body.social_links || "").trim(),
      shipping_charge: Number(body.shipping_charge || 0),
      free_shipping_limit: Number(body.free_shipping_limit || 0),
      maintenance_mode: Boolean(body.maintenance_mode),
    };

    const result = await supabase.from("settings").upsert([payload], {
      onConflict: "id",
    });

    if (result.error) {
      if (isMissingSupabaseTableError(result.error)) {
        await writeSettingsFile(payload);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (isMissingSupabaseTableError(error)) {
      const body = await request.clone().json().catch(() => ({}));
      await writeSettingsFile({
        id: 1,
        business_name: String(body.business_name || "").trim(),
        logo: String(body.logo || "").trim(),
        gst: String(body.gst || "").trim(),
        phone: String(body.phone || "").trim(),
        email: String(body.email || "").trim(),
        social_links: String(body.social_links || "").trim(),
        shipping_charge: Number(body.shipping_charge || 0),
        free_shipping_limit: Number(body.free_shipping_limit || 0),
        maintenance_mode: Boolean(body.maintenance_mode),
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: error?.message || "Settings save failed." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      business_name: String(body.business_name || "").trim(),
      logo: String(body.logo || "").trim(),
      gst: String(body.gst || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim(),
      social_links: String(body.social_links || "").trim(),
      shipping_charge: Number(body.shipping_charge || 0),
      free_shipping_limit: Number(body.free_shipping_limit || 0),
      maintenance_mode: Boolean(body.maintenance_mode),
    };

    const result = await supabase
      .from("settings")
      .update(payload)
      .eq("id", Number(body.id || 1));

    if (result.error) {
      if (isMissingSupabaseTableError(result.error)) {
        await writeSettingsFile(payload);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (isMissingSupabaseTableError(error)) {
      const body = await request.clone().json().catch(() => ({}));
      await writeSettingsFile({
        business_name: String(body.business_name || "").trim(),
        logo: String(body.logo || "").trim(),
        gst: String(body.gst || "").trim(),
        phone: String(body.phone || "").trim(),
        email: String(body.email || "").trim(),
        social_links: String(body.social_links || "").trim(),
        shipping_charge: Number(body.shipping_charge || 0),
        free_shipping_limit: Number(body.free_shipping_limit || 0),
        maintenance_mode: Boolean(body.maintenance_mode),
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: error?.message || "Settings update failed." },
      { status: 500 }
    );
  }
}
