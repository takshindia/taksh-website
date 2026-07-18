"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type GalleryItem = {
  id: number;
  caption: string;
  image_url: string;
  created_at?: string;
};

const PAGE_SIZE = 6;

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");

  async function fetchGallery() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/gallery", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const payload = await response.json();
      setItems(payload.gallery || []);
      setPage(1);
    } catch (err: any) {
      setError(err?.message || "Unable to load gallery.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchGallery();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!files.length) {
      alert("Choose at least one image.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("caption", caption);

      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      setFiles([]);
      setCaption("");
      await fetchGallery();
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function updateCaption(id: number, captionText: string) {
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, caption: captionText }),
      });

      if (!response.ok) {
        throw new Error("Caption update failed.");
      }

      await fetchGallery();
    } catch (err: any) {
      alert(err?.message || "Could not update caption.");
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this gallery image?")) return;

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      await fetchGallery();
    } catch (err: any) {
      alert(err?.message || "Could not delete image.");
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      `${item.caption}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-yellow-400">🖼️ Gallery</h1>
          <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
            Total: {filteredItems.length}
          </span>
        </div>

        <div className="bg-[#181818] border border-yellow-500/20 rounded-xl p-5">
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block w-full text-white"
            />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption"
              className="w-full bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            />

            <button
              type="submit"
              disabled={uploading}
              className="bg-yellow-500 text-black px-5 py-3 rounded-lg font-bold disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </form>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search caption..."
          className="w-full bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
        />

        {loading && <p className="text-yellow-400">Loading gallery...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#1b1b1b] border border-yellow-500/20 rounded-xl overflow-hidden"
            >
              <img src={item.image_url} alt={item.caption || "Gallery image"} className="w-full h-52 object-cover" />

              <div className="p-4 space-y-3">
                <input
                  defaultValue={item.caption}
                  id={`caption-${item.id}`}
                  className="w-full bg-black border border-yellow-500/20 rounded p-2 text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const value = (document.getElementById(`caption-${item.id}`) as HTMLInputElement)?.value || "";
                      void updateCaption(item.id, value);
                    }}
                    className="bg-blue-600 px-3 py-2 rounded text-white"
                  >
                    Edit Caption
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-600 px-3 py-2 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length > PAGE_SIZE && (
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-[#181818] border border-yellow-500/20 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-300">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-[#181818] border border-yellow-500/20 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
