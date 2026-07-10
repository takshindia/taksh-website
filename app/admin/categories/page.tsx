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
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: false });

    setCategories(data || []);
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Enter Category Name");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("categories")
      .insert([{ name }]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setName("");
    fetchCategories();
  }

  async function deleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchCategories();
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

                    const { error } = await supabase
                      .from("categories")
                      .update({ name: newName })
                      .eq("id", c.id);

                    if (error) {
                      alert(error.message);
                    } else {
                      fetchCategories();
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