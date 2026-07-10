"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    stock: "",
    category_id: "",
    featured: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: p, error: pError } = await supabase
      .from("products")
      .select("*");

    const { data: c, error: cError } = await supabase
      .from("categories")
      .select("*");

    console.log("Products:", p, pError);
    console.log("Categories:", c, cError);

    setProducts(p || []);
    setCategories(c || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = "";

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("Products")
          .upload(fileName, file);

        if (error) {
          alert("Image Upload Error: " + error.message);
          console.log(error);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("Products")
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
      }
if (editingId) {
  const { error } = await supabase
    .from("products")
    .update({
      name: formData.name,
      description: formData.desc,
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      category_id: Number(formData.category_id),
      featured: formData.featured,
      image_url: imageUrl || products.find(p => p.id === editingId)?.image_url,
    })
    .eq("id", editingId);

  if (error) {
    alert("Update Error: " + error.message);
  } else {
    alert("Product Updated Successfully");
    setEditingId(null);
    fetchData();
    setFormData({
  name: "",
  desc: "",
  price: "",
  stock: "",
  category_id: "",
  featured: false,
});

setFile(null);
  }

  setLoading(false);
  return;
}
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          description: formData.desc,
          price: Number(formData.price),
          stock: Number(formData.stock || 0),
          category_id: Number(formData.category_id),
          featured: formData.featured,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        alert("Insert Error: " + error.message);
        console.log(error);
      } else {
        alert("Product Added Successfully");

        setFormData({
          name: "",
          desc: "",
          price: "",
          stock: "",
          category_id: "",
          featured: false,
        });

        setFile(null);

        fetchData();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

    setLoading(false);
  }
function editProduct(product: any) {
  setEditingId(product.id);

  setFormData({
    name: product.name || "",
    desc: product.description || "",
    price: String(product.price || ""),
    stock: String(product.stock || ""),
    category_id: String(product.category_id || ""),
    featured: product.featured || false,
  });
}
async function deleteProduct(id: number) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
  } else {
    fetchData();
  }
}
const filteredProducts = products.filter((p: any) =>
  (
    (p.name || "") +
    (p.description || "") +
    (p.price || "")
  )
    .toLowerCase()
    .includes(search.toLowerCase())
);
  return (
    <AdminLayout>
      <div className="mb-4 flex justify-between items-center">
  <h2 className="text-2xl font-bold text-yellow-400">
    Products
  </h2>

  <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
    Total: {filteredProducts.length}
  </span>
</div>
      <div className="mb-6">
  <input
    type="text"
    placeholder="🔍 Search Products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full bg-black border border-yellow-500/20 p-3 rounded text-white"
  />
</div>
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-8 border border-gold/20 mb-12"
      >
        <h2 className="text-xl text-gold mb-6">Add New Product</h2>

        <div className="grid grid-cols-2 gap-6">
          <input
            className="bg-black p-3 border border-gold/20"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="number"
            className="bg-black p-3 border border-gold/20"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <select
            className="bg-black p-3 border border-gold/20"
            value={formData.category_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_id: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

       <input
  type="file"
  style={{
    display: "block",
    width: "100%",
    backgroundColor: "white",
    color: "black",
    border: "2px solid red",
    padding: "10px",
  }}
  onChange={(e) =>
    setFile(e.target.files ? e.target.files[0] : null)
  }
/>
{file && (
  <img
    src={URL.createObjectURL(file)}
    alt="Preview"
    className="w-32 h-32 object-cover rounded-lg border border-yellow-500 mt-3"
  />
)}

          <button
            type="submit"
            className="bg-yellow-500 text-black p-3 font-bold rounded"
            disabled={loading}
          >
           {loading
  ? "Saving..."
  : editingId
  ? "Update Product"
  : "Add Product"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {filteredProducts.length === 0 && (
  <div className="text-center text-gray-400 py-10">
    No Products Found
  </div>
)}
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center bg-surface p-4 border border-gold/20"
          >
            <img
              src={p.image_url || "https://via.placeholder.com/300"}
              className="w-16 h-16 object-cover"
            />

            <div className="flex-1 ml-4">
  <h3 className="text-white font-bold text-lg">
    {p.name}
  </h3>

  <p className="text-gray-400 text-sm">
    ₹{p.price}
  </p>

  <div className="flex gap-2 mt-2">
    <span
      className={`px-2 py-1 rounded text-xs ${
        p.stock > 0
          ? "bg-green-600"
          : "bg-red-600"
      }`}
    >
      {p.stock > 0
        ? `Stock: ${p.stock}`
        : "Out of Stock"}
    </span>

    {p.featured && (
      <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
        ⭐ Featured
      </span>
    )}
  </div>
</div>

            <span>₹{p.price}</span>

           <button
  onClick={() => editProduct(p)}
  className="text-blue-500 mr-4"
>
  ✏️ Edit
</button>

<button
  type="button"
  onClick={() => {
    alert("Delete Click");
    deleteProduct(p.id);
  }}
  className="text-red-500"
>
  🗑 Delete
</button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}