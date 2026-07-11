"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const savedEmail =
      localStorage.getItem("admin_email") ||
      "taksh.support03@gmail.com";

    setEmail(savedEmail);
  }, []);

  function saveSettings() {
    const currentPassword =
      localStorage.getItem("admin_password") ||
      "Taksh@123";

    if (oldPassword !== currentPassword) {
      alert("❌ Old Password is incorrect");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ New Password & Confirm Password do not match");
      return;
    }

    localStorage.setItem("admin_email", email);

    if (newPassword.trim() !== "") {
      localStorage.setItem("admin_password", newPassword);
    }

    alert("✅ Settings Saved Successfully");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-yellow-400">
        ⚙️ Settings
      </h1>

      <div className="bg-[#181818] border border-yellow-500/20 rounded-xl p-6 max-w-xl">

        <label className="block text-sm mb-2">
          Admin Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full p-3 rounded bg-black border border-gray-700 mb-5"
        />

        <label className="block text-sm mb-2">
          Old Password
        </label>

        <input
          type="password"
          value={oldPassword}
          onChange={(e)=>setOldPassword(e.target.value)}
          placeholder="Old Password"
          className="w-full p-3 rounded bg-black border border-gray-700 mb-5"
        />

        <label className="block text-sm mb-2">
          New Password
        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-3 rounded bg-black border border-gray-700 mb-5"
        />

        <label className="block text-sm mb-2">
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full p-3 rounded bg-black border border-gray-700 mb-6"
        />

        <button
          onClick={saveSettings}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold"
        >
          💾 Save Settings
        </button>

      </div>
    </div>
  );
}
