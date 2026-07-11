"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (
      email === "taksh.support03@gmail.com" &&
      password === "Taksh@123"
    ) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
      return;
    }

    alert("Invalid Email or Password");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#151515",
          borderRadius: "20px",
          padding: "40px",
          border: "1px solid rgba(212,175,55,.2)",
          textAlign: "center",
        }}
      >
        <Image
          src="/taksh-logo.png"
          alt="TAKSH"
          width={140}
          height={140}
          style={{
            margin: "0 auto 20px",
            height: "auto",
          }}
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
            fontSize: "16px",
            outline: "none",
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
            marginBottom: "25px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#0f0f0f",
            color: "white",
            fontSize: "16px",
            outline: "none",
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
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <p
          style={{
            marginTop: "25px",
            color: "#888",
            fontSize: "14px",
            lineHeight: "22px",
          }}
        >
          तक्ष Admin Panel
          <br />
          Authorized access only.
        </p>
      </div>
    </main>
  );
}