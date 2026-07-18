"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type Product = {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  discount_price: number | null;
  sku: string | null;
  stock: number;
  category_id: number | null;
  featured: boolean;
  image_url: string | null;
  image_urls: string[] | null;
};

type Category = {
  id: number;
  name: string;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  discount_price: "",
  sku: "",
  stock: "",
  category_id: "",
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    void fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const payload = await response.json();

      setProducts((payload.products || []) as Product[]);
      setCategories((payload.categories || []) as Category[]);
    } catch (error) {
      console.error("Product fetch failed:", error);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);
    setImageFiles([]);
    setFormData(emptyForm);
  }

  function createSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      slug: createSlug(prev.name),
    }));
  }, [formData.name]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("slug", formData.slug.trim());
      form.append("description", formData.description.trim());
      form.append("price", String(Number(formData.price)));
      form.append(
        "discount_price",
        formData.discount_price === ""
          ? ""
          : String(Number(formData.discount_price))
      );
      form.append("sku", formData.sku.trim());
      form.append("stock", String(Number(formData.stock)));
      form.append(
        "category_id",
        formData.category_id === ""
          ? ""
          : String(Number(formData.category_id))
      );
      form.append("featured", String(formData.featured));

      if (editingId) {
        form.append("id", String(editingId));
      }

      imageFiles.forEach((file) => {
        form.append("files", file);
      });

      const response = await fetch("/api/admin/products", {
        method: editingId ? "PUT" : "POST",
        body: form,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong.");
      }

      alert(
        editingId
          ? "✅ Product Updated Successfully"
          : "✅ Product Added Successfully"
      );

      resetForm();
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function editProduct(product: Product) {
    setEditingId(product.id);

    setFormData({
      name: product.name ?? "",
      slug: product.slug ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      discount_price:
        product.discount_price != null
          ? String(product.discount_price)
          : "",
      sku: product.sku ?? "",
      stock: String(product.stock ?? ""),
      category_id:
        product.category_id != null
          ? String(product.category_id)
          : "",
      featured: product.featured ?? false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProduct(id: number) {
    const ok = confirm("Are you sure you want to delete this product?");

    if (!ok) return;

    try {
      const response = await fetch("/api/admin/products", {
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

      await fetchData();
    } catch (err: any) {
      alert(err?.message || "Delete failed.");
    }
  }

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const keyword = (
          (product.name || "") +
          " " +
          (product.description || "") +
          " " +
          (product.sku || "")
        ).toLowerCase();

        const matchesSearch = keyword.includes(
          search.toLowerCase()
        );

        const matchesCategory =
          categoryFilter === "all" ||
          String(product.category_id) === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "priceLow":
            return a.price - b.price;

          case "priceHigh":
            return b.price - a.price;

          case "name":
            return a.name.localeCompare(b.name);

          default:
            return b.id - a.id;
        }
      });
  }, [products, search, categoryFilter, sortBy]);

  function getDiscount(product: Product) {
    if (
      !product.discount_price ||
      product.discount_price <= 0
    )
      return 0;

    return Math.round(
      ((product.price - product.discount_price) /
        product.price) *
        100
    );
  }
  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-yellow-400">
            Products
          </h1>

          <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold">
            Total : {filteredProducts.length}
          </div>
        </div>

        {/* Search + Sort + Filter */}
        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="🔍 Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
          >
            <option value="latest">Latest</option>
            <option value="priceLow">Price : Low → High</option>
            <option value="priceHigh">Price : High → Low</option>
            <option value="name">Name (A-Z)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={String(category.id)}
              >
                {category.name}
              </option>
            ))}
          </select>

        </div>

        {/* Product Form */}

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-yellow-500/20 rounded-xl p-8"
        >

          <h2 className="text-2xl text-yellow-400 mb-6">

            {editingId
              ? "✏ Edit Product"
              : "➕ Add Product"}

          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              name="slug"
              placeholder="Slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              type="number"
              name="discount_price"
              placeholder="Discount Price"
              value={formData.discount_price}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            />

            <input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            />

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (

                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>

              ))}

            </select>

            <div className="flex items-center gap-3">

              <input
                id="featured"
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />

              <label
                htmlFor="featured"
                className="text-white"
              >
                ⭐ Featured Product
              </label>

            </div>

            <textarea
              name="description"
              placeholder="Product Description..."
              value={formData.description}
              onChange={handleInputChange}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white md:col-span-2 min-h-[140px]"
            />

            <div className="md:col-span-2">

              <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) =>
    setImageFiles(Array.from(e.target.files || []))
  }
  className="block w-full text-white"
/>

<div className="flex flex-wrap gap-4 mt-4">
  {imageFiles.map((file, index) => (
    <img
      key={index}
      src={URL.createObjectURL(file)}
      alt={`Preview ${index + 1}`}
      className="w-24 h-24 rounded-lg object-cover border border-yellow-500"
    />
  ))}
</div>

            </div>

            <div className="md:col-span-2 flex gap-4">

              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (

                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-600 px-8 py-3 rounded-lg text-white"
                >
                  Cancel
                </button>

              )}

            </div>

          </div>

        </form>
        {/* Products List */}
        <div className="space-y-4">

          {loading ? (
            <div className="text-center text-gray-400 py-10">
              Loading Products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No Products Found
            </div>
          ) : (
            filteredProducts.map((product) => {
              const discount = getDiscount(product);

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-surface border border-yellow-500/20 rounded-xl p-5"
                >
                  {/* Image */}
                  <div>
                    <img
                      src={
                        product.image_url ||
                        "https://via.placeholder.com/120x120?text=No+Image"
                      }
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-lg border border-yellow-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {product.name}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      {product.description || "No Description"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">

                      <span className="bg-zinc-700 px-2 py-1 rounded text-xs text-white">
                        SKU : {product.sku || "N/A"}
                      </span>

                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          product.stock > 0
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {product.stock > 0
                          ? `Stock : ${product.stock}`
                          : "Out of Stock"}
                      </span>

                      {product.featured && (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          ⭐ Featured
                        </span>
                      )}

                      {discount > 0 && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          🔥 {discount}% OFF
                        </span>
                      )}

                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[120px]">

                    {product.discount_price ? (
                      <>
                        <div className="text-gray-500 line-through">
                          ₹{product.price}
                        </div>

                        <div className="text-2xl font-bold text-green-400">
                          ₹{product.discount_price}
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-yellow-400">
                        ₹{product.price}
                      </div>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">

                    <button
                      onClick={() => editProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>
    </AdminLayout>
  );
}