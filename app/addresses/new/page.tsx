"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewAddressPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [pincode, setPincode] = useState("");

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      pincode,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Address Saved Successfully 🎉");

    router.push("/addresses");
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-yellow-400">
          Add New Address
        </h1>

        <form
          onSubmit={saveAddress}
          className="space-y-4 rounded-2xl border border-yellow-500/20 bg-[#111] p-6"
        >
            <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          />

          <input
            type="text"
            placeholder="Address Line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          />

          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-black p-3"
            />

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="rounded-lg border border-gray-700 bg-black p-3"
            />
          </div>

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
    