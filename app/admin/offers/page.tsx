"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type Offer = {
  id: number;
  coupon_code: string;
  discount: number;
  banner: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "expired";
};

const PAGE_SIZE = 6;

const emptyForm = {
  coupon_code: "",
  discount: "",
  banner: "",
  start_date: "",
  end_date: "",
  status: "active",
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  async function fetchOffers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/offers", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load offers.");
      }

      const payload = await response.json();
      setOffers(payload.offers || []);
      setPage(1);
    } catch (err: any) {
      setError(err?.message || "Unable to load offers.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchOffers();
  }, []);

  async function saveOffer(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        discount: Number(form.discount),
      };

      const url = "/api/admin/offers";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          ...payload,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchOffers();
    } catch (err: any) {
      setError(err?.message || "Could not save offer.");
    } finally {
      setSaving(false);
    }
  }

  async function editOffer(offer: Offer) {
    setEditingId(offer.id);
    setForm({
      coupon_code: offer.coupon_code,
      discount: String(offer.discount),
      banner: offer.banner,
      start_date: offer.start_date,
      end_date: offer.end_date,
      status: offer.status,
    });
  }

  async function deleteOffer(id: number) {
    if (!confirm("Delete this offer?")) return;

    try {
      const response = await fetch("/api/admin/offers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      await fetchOffers();
    } catch (err: any) {
      alert(err?.message || "Could not delete offer.");
    }
  }

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) =>
      `${offer.coupon_code} ${offer.banner} ${offer.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [offers, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / PAGE_SIZE));
  const paginatedOffers = filteredOffers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-yellow-400">🎁 Offers</h1>
          <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
            Total: {filteredOffers.length}
          </span>
        </div>

        <form onSubmit={saveOffer} className="bg-[#181818] border border-yellow-500/20 rounded-xl p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={form.coupon_code}
              onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
              placeholder="Coupon Code"
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              placeholder="Discount"
              type="number"
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              value={form.banner}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              placeholder="Banner Text"
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>

            <input
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              type="date"
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />

            <input
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              type="date"
              className="bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
              required
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-500 text-black px-5 py-3 rounded-lg font-bold disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Offer" : "Add Offer"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="bg-[#181818] border border-yellow-500/20 px-5 py-3 rounded-lg text-white"
            >
              Reset
            </button>
          </div>
        </form>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search offer / coupon / banner..."
          className="w-full bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
        />

        {loading && <p className="text-yellow-400">Loading offers...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="space-y-4">
          {paginatedOffers.map((offer) => (
            <div key={offer.id} className="bg-[#1b1b1b] border border-yellow-500/20 rounded-xl p-5">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-yellow-400">{offer.coupon_code}</h2>
                  <p className="text-gray-300">Discount: {offer.discount}%</p>
                  <p className="text-gray-400">Banner: {offer.banner}</p>
                  <p className="text-gray-400">{offer.start_date} → {offer.end_date}</p>
                </div>

                <div className="text-right">
                  <p className="text-yellow-400 font-bold">{offer.status}</p>
                  <div className="flex gap-2 mt-3 flex-wrap justify-end">
                    <button onClick={() => editOffer(offer)} className="bg-blue-600 px-3 py-2 rounded text-white">Edit</button>
                    <button onClick={() => deleteOffer(offer.id)} className="bg-red-600 px-3 py-2 rounded text-white">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length > PAGE_SIZE && (
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-[#181818] border border-yellow-500/20 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-300">Page {page} / {totalPages}</span>

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
