"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load categories.");
      }

      const payload = await response.json();
      setCategories(payload.categories || []);
    } catch (error) {
      console.error("Category fetch failed:", error);
      setCategories([]);
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Enter Category Name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save category.");
      }

      setName("");
      await fetchCategories();
    } catch (error: any) {
      alert(error?.message || "Failed to save category.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Delete failed.");
      }

      await fetchCategories();
    } catch (error: any) {
      alert(error?.message || "Delete failed.");
    }
  }

  const filteredCategories = categories.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            Categories
          </h2>

          <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
            Total: {filteredCategories.length}
          </span>
        </div>

        <input
          type="text"
          placeholder="🔍 Search Categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-yellow-500/20 p-3 rounded text-white mb-6"
        />

        <form
          onSubmit={addCategory}
          className="flex gap-4 mb-8"
        >
          <input
            className="flex-1 bg-black border border-yellow-500 p-3 text-white"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-black px-6 py-3 font-bold rounded"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </form>

        <div className="space-y-4">
          {filteredCategories.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center bg-[#1b1b1b] border border-yellow-500/20 rounded-lg p-4"
            >
              <div>
                <h3 className="text-xl font-bold text-yellow-400">
                  {c.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  Category ID: {c.id}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    const newName = prompt("Edit Category", c.name);

                    if (!newName) return;

                    try {
                      const response = await fetch("/api/admin/categories", {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: c.id, name: newName }),
                      });

                      const payload = await response.json();

                      if (!response.ok) {
                        throw new Error(payload.error || "Update failed.");
                      }

                      await fetchCategories();
                    } catch (error: any) {
                      alert(error?.message || "Update failed.");
                    }
                  }}
                  className="text-blue-400 font-bold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-red-500 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}