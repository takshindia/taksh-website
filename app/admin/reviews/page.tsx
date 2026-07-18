"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

type Review = {
  id: number;
  product_id: number | null;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
};

const PAGE_SIZE = 6;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  async function fetchReviews() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/reviews", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load reviews.");
      }

      const payload = await response.json();
      setReviews(payload.reviews || []);
      setPage(1);
    } catch (err: any) {
      setError(err?.message || "Unable to load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchReviews();
  }, []);

  async function updateReviewStatus(id: number, status: "approved" | "rejected") {
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Status update failed.");
      }

      await fetchReviews();
    } catch (err: any) {
      alert(err?.message || "Could not update review status.");
    }
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      await fetchReviews();
    } catch (err: any) {
      alert(err?.message || "Could not delete review.");
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch = `${review.product_name} ${review.customer_name} ${review.comment}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || review.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const paginatedReviews = filteredReviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h1 className="text-3xl font-bold text-yellow-400">⭐ Reviews</h1>
          <span className="bg-yellow-500 text-black px-4 py-2 rounded font-bold">
            Total: {filteredReviews.length}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product / customer / review..."
            className="w-full bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black border border-yellow-500/20 rounded-lg p-3 text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading && <p className="text-yellow-400">Loading reviews...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1b1b1b] border border-yellow-500/20 rounded-xl p-5"
            >
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold text-yellow-400">{review.product_name}</h2>
                  <p className="text-gray-300 mt-1">Customer: {review.customer_name}</p>
                  <p className="text-gray-400">Rating: {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                  <p className="text-gray-400 mt-2">{review.comment}</p>
                </div>

                <div className="text-right flex flex-col gap-2">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold">
                    {review.status}
                  </span>

                  <div className="flex gap-2 justify-end flex-wrap">
                    <button
                      onClick={() => updateReviewStatus(review.id, "approved")}
                      className="bg-green-600 px-3 py-2 rounded text-white text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, "rejected")}
                      className="bg-red-600 px-3 py-2 rounded text-white text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="bg-gray-700 px-3 py-2 rounded text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length > PAGE_SIZE && (
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
