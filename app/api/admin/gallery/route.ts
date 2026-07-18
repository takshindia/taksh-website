import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_FILE = path.join(DATA_DIR, "admin-gallery.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readGalleryFile() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(GALLERY_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeGalleryFile(data: Record<string, any>[]) {
  await ensureDataDir();
  await fs.writeFile(GALLERY_FILE, JSON.stringify(data, null, 2), "utf8");
}

function isMissingSupabaseTableError(error: any) {
  return /Could not find the table|does not exist|schema cache/i.test(
    error?.message || ""
  );
}

async function uploadGalleryFiles(files: File[], caption: string) {
  const inserted: any[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("Products")
      .upload(fileName, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from("Products")
      .getPublicUrl(fileName);

    inserted.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      caption,
      image_url: publicUrlData.publicUrl,
    });
  }

  return inserted;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const fallback = await readGalleryFile();
        return NextResponse.json({ gallery: fallback || [] }, { status: 200 });
      }

      return NextResponse.json({ gallery: [] }, { status: 200 });
    }

    return NextResponse.json({ gallery: data || [] });
  } catch (error: any) {
    if (isMissingSupabaseTableError(error)) {
      const fallback = await readGalleryFile();
      return NextResponse.json({ gallery: fallback || [] }, { status: 200 });
    }

    return NextResponse.json({ gallery: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const caption = String(formData.get("caption") || "");

    const inserted = await uploadGalleryFiles(files as File[], caption);

    if (inserted.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const { error } = await supabase.from("gallery").insert(inserted);

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const gallery = await readGalleryFile();
        const nextGallery = [...inserted, ...gallery];
        await writeGalleryFile(nextGallery);
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gallery upload failed." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, caption } = body;

    const { error } = await supabase
      .from("gallery")
      .update({ caption })
      .eq("id", id);

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const gallery = await readGalleryFile();
        const index = gallery.findIndex((item: any) => item.id === Number(id));

        if (index >= 0) {
          gallery[index] = { ...gallery[index], caption: String(caption || "") };
          await writeGalleryFile(gallery);
        }

        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Caption update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    const { data: item, error: itemError } = await supabase
      .from("gallery")
      .select("image_url")
      .eq("id", id)
      .single();

    if (itemError) {
      if (isMissingSupabaseTableError(itemError)) {
        const gallery = await readGalleryFile();
        const itemToDelete = gallery.find((entry: any) => entry.id === id);

        if (itemToDelete?.image_url) {
          const filePath = itemToDelete.image_url.split("/Products/")[1];
          if (filePath) {
            await supabase.storage.from("Products").remove([filePath]);
          }
        }

        await writeGalleryFile(gallery.filter((entry: any) => entry.id !== id));
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: itemError.message }, { status: 500 });
    }

    const filePath = item?.image_url?.split("/Products/")?.[1];
    if (filePath) {
      await supabase.storage.from("Products").remove([filePath]);
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      if (isMissingSupabaseTableError(error)) {
        const gallery = await readGalleryFile();
        await writeGalleryFile(gallery.filter((entry: any) => entry.id !== id));
        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gallery delete failed." },
      { status: 500 }
    );
  }
}
