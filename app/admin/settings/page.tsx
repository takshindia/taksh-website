"use client";

import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [logo, setLogo] = useState("");
  const [gst, setGst] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [shippingCharge, setShippingCharge] = useState("0");
  const [freeShippingLimit, setFreeShippingLimit] = useState("0");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_email") || "taksh.support03@gmail.com";
    setEmail(savedEmail);

    void fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch("/api/admin/settings", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load settings.");
      }

      const payload = await response.json();
      const settings = payload.settings;

      if (settings) {
        setBusinessName(settings.business_name || "");
        setLogo(settings.logo || "");
        setGst(settings.gst || "");
        setPhone(settings.phone || "");
        setSocialLinks(settings.social_links || "");
        setShippingCharge(String(settings.shipping_charge || 0));
        setFreeShippingLimit(String(settings.free_shipping_limit || 0));
        setMaintenanceMode(Boolean(settings.maintenance_mode));
      }
    } catch (error) {
      console.error("Settings fetch failed:", error);
    }
  }

  async function saveSettings() {
    const currentPassword = localStorage.getItem("admin_password") || "Taksh@123";

    if (oldPassword !== currentPassword) {
      alert("❌ Old Password is incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ New Password & Confirm Password do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: businessName,
          logo,
          gst,
          phone,
          email,
          social_links: socialLinks,
          shipping_charge: Number(shippingCharge),
          free_shipping_limit: Number(freeShippingLimit),
          maintenance_mode: maintenanceMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Settings save failed.");
      }

      localStorage.setItem("admin_email", email);

      if (newPassword.trim() !== "") {
        localStorage.setItem("admin_password", newPassword);
      }

      alert("✅ Settings Saved Successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error?.message || "Unable to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-yellow-400">
          ⚙️ Settings
        </h1>

        <div className="bg-[#181818] border border-yellow-500/20 rounded-xl p-6 max-w-3xl space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Logo URL</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">GST</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Social Links</label>
              <input
                type="text"
                value={socialLinks}
                onChange={(e) => setSocialLinks(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Shipping Charge</label>
              <input
                type="number"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Free Shipping Limit</label>
              <input
                type="number"
                value={freeShippingLimit}
                onChange={(e) => setFreeShippingLimit(e.target.value)}
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              Enable Maintenance Mode
            </label>

            <div>
              <label className="block text-sm mb-2">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old Password"
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full p-3 rounded bg-black border border-gray-700"
              />
            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold disabled:opacity-60"
          >
            {loading ? "Saving..." : "💾 Save Settings"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
