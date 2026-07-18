"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setFullName(user?.user_metadata?.full_name || "");
      setPhone(user?.user_metadata?.phone || "");
    }

    loadUser();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile Updated Successfully 🎉");
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="mb-8 text-4xl font-bold text-yellow-400">
        My Profile
      </h1>

      <div className="max-w-xl rounded-2xl border border-yellow-500/20 bg-[#111] p-8">
        <div className="space-y-6">

          <div>
            <label className="text-gray-400">Full Name</label>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-400">Phone Number</label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="mt-2 w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-400">Email</label>

            <input
              value={user?.email || ""}
              readOnly
              className="mt-2 w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-gray-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}
