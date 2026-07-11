"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    const savedEmail =
      localStorage.getItem("admin_email") ||
      "taksh.support03@gmail.com";

    const savedPassword =
      localStorage.getItem("admin_password") ||
      "Taksh@123";

    if (email === savedEmail && password === savedPassword) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
      return;
    }

    alert("❌ Invalid Email or Password");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#151515",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid rgba(212,175,55,.2)",
          textAlign: "center",
        }}
      >
        <Image
          src="/taksh-logo.png"
          alt="TAKSH"
          width={140}
          height={140}
          style={{ margin: "0 auto 20px", height: "auto" }}
        />

        <h1
          style={{
            color: "#d4af37",
            marginBottom: "30px",
          }}
        >
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#0f0f0f",
            color: "white",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#0f0f0f",
            color: "white",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "15px",
            background: "#d4af37",
            color: "#000",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "20px",
            color: "#888",
          }}
        >
          तक्ष Admin Panel
        </p>
      </div>
    </main>
  );
}