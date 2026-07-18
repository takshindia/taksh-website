"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    loadAddress();
  }, []);

  async function loadAddress() {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      alert("Address not found");
      router.push("/addresses");
      return;
    }

    setFullName(data.full_name);
    setPhone(data.phone);
    setAddress1(data.address_line1);
    setAddress2(data.address_line2 || "");
    setCity(data.city);
    setState(data.state);
    setPincode(data.pincode);
  }
  async function handleUpdate() {
    setLoading(true);

    const { error } = await supabase
      .from("addresses")
      .update({
        full_name: fullName,
        phone: phone,
        address_line1: address1,
        address_line2: address2,
        city: city,
        state: state,
        pincode: pincode,
      })
      .eq("id", params.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Address Updated Successfully 🎉");
    router.push("/addresses");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        Edit Address
      </h1>

      <div className="mx-auto max-w-2xl rounded-2xl border border-yellow-500/20 bg-[#111] p-8 space-y-5">
      
      <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
        />

        <input
          type="text"
          placeholder="Address Line 1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
        />

        <input
          type="text"
          placeholder="Address Line 2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
          />

          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
          />
        </div>

        <input
          type="text"
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3"
        />
        
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </div>
    </div>
  );
}
