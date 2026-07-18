"use client";

import { useState } from "react";
import Input from "../ui/Input";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);

  const { error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        full_name: form.name,
      },
    },
  });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created successfully!");
  router.push("/login");
};

  return (
    <form onSubmit={handleSignup} className="space-y-5">

      <Input
        label="Full Name"
        name="name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create password"
        value={form.password}
        onChange={handleChange}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
      />

      <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
>
  {loading ? "Creating..." : "Create Account"}
</button>

      <button
        type="button"
        className="w-full rounded-xl border border-gray-700 py-3 text-white hover:border-yellow-500"
      >
        Continue with Google
      </button>

    </form>
  );
}