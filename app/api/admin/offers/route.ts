import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA_DIR = path.join(process.cwd(), "data");
const OFFERS_FILE = path.join(DATA_DIR, "admin-offers.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readOffersFile() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(OFFERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeOffersFile(data: Record<string, any>[]) {
  await ensureDataDir();
  await fs.writeFile(OFFERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function isMissingSupabaseTableError(error: any) {
  return /Could not find the table|does not exist|schema cache/i.test(
    error?.message || ""
  );
}

function normalizeDateInput(value: string) {
  const dateInput = String(value || "").trim();

  if (!dateInput) {
    throw new Error("Start date and end date are required.");
  }

  const normalized = new Date(`${dateInput}T12:00:00`);

  if (Number.isNaN(normalized.getTime())) {
    throw new Error("Dates must be valid ISO dates.");
  }

  return normalized.toISOString().slice(0, 10);
}

function normalizeOfferPayload(body: Record<string, any>) {
  const startDate = normalizeDateInput(body.start_date);
  const endDate = normalizeDateInput(body.end_date);

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (start > end) {
    throw new Error("Start date cannot be after end date.");
  }

  return {
    coupon_code: String(body.coupon_code || "").trim(),
    discount: Number(body.discount || 0),
    banner: String(body.banner || "").trim(),
    start_date: startDate,
    end_date: endDate,
    status: String(body.status || "active").trim(),
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const fallback = await readOffersFile();
        return NextResponse.json({ offers: fallback || [] }, { status: 200 });
      }

      return NextResponse.json({ offers: [] }, { status: 200 });
    }

    return NextResponse.json({ offers: data || [] });
  } catch (error: any) {
    if (isMissingSupabaseTableError(error)) {
      const fallback = await readOffersFile();
      return NextResponse.json({ offers: fallback || [] }, { status: 200 });
    }

    return NextResponse.json({ offers: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = normalizeOfferPayload(body);

    const { error } = await supabase.from("offers").insert([payload]);

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const offers = await readOffersFile();
        offers.unshift({ id: Date.now(), ...payload });
        await writeOffersFile(offers);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Offer create failed." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const payload = normalizeOfferPayload(body);

    const { error } = await supabase
      .from("offers")
      .update(payload)
      .eq("id", Number(body.id));

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const offers = await readOffersFile();
        const index = offers.findIndex((item: any) => item.id === Number(body.id));

        if (index >= 0) {
          offers[index] = { ...offers[index], ...payload };
        } else {
          offers.unshift({ id: Number(body.id), ...payload });
        }

        await writeOffersFile(offers);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Offer update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    const { error } = await supabase.from("offers").delete().eq("id", id);

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const offers = await readOffersFile();
        const filtered = offers.filter((item: any) => item.id !== id);
        await writeOffersFile(filtered);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Offer delete failed." },
      { status: 500 }
    );
  }
}
