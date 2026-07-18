"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddressesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setAddresses(data);
    }

    setLoading(false);
  }

  async function deleteAddress(id: string) {
    const ok = window.confirm(
      "Delete this address?"
    );

    if (!ok) return;

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadAddresses();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">

      <div className="mx-auto max-w-5xl">

        <div className="mb-10 flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-yellow-400">
              My Addresses
            </h1>

            <p className="mt-2 text-gray-400">
              Manage your saved delivery addresses.
            </p>

          </div>

          <button
            onClick={() => router.push("/addresses/new")}
            className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400"
          >
            + Add Address
          </button>

        </div>

        {loading ? (
          <div className="text-center text-gray-400">
            Loading...
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-[#111] p-10 text-center">

            <h2 className="text-2xl font-semibold">
              No Address Found
            </h2>

            <p className="mt-3 text-gray-400">
              Add your first delivery address.
            </p>

          </div>
        ) : (
          <div className="grid gap-6">

            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-yellow-500/20 bg-[#111] p-6 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="space-y-2">

                    <h2 className="text-2xl font-bold text-yellow-400">
                      {address.full_name}
                    </h2>

                    <p className="text-gray-300">
                      📞 {address.phone}
                    </p>

                    <p className="text-gray-300">
                      📍 {address.address_line1}
                    </p>

                    {address.address_line2 && (
                      <p className="text-gray-300">
                        {address.address_line2}
                      </p>
                    )}

                    <p className="text-gray-300">
                      {address.city}, {address.state}
                    </p>

                    <p className="text-gray-300">
                      PIN : {address.pincode}
                    </p>

                  </div>

                  <div className="flex flex-col gap-3">

                    <button
                      onClick={() =>
                        router.push(
                          `/addresses/edit/${address.id}`
                        )
                      }
                      className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteAddress(address.id)
                      }
                      className="rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </main>
  );
}
          