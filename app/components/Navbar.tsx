"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = {
    color: "white",
    textDecoration: "none",
    fontSize: "17px",
    fontWeight: 500 as const,
    transition: "0.3s",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,175,55,0.25)",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <Image
            src="/taksh-logo.png"
            alt="तक्ष"
            width={140}
            height={60}
            priority
            style={{
              width: "140px",
              height: "auto",
              cursor: "pointer",
            }}
          />
        </Link>

        <div
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <Link href="/" style={navLink}>
            Home
          </Link>

          <Link href="/products" style={navLink}>
            Products
          </Link>

          <Link href="/about" style={navLink}>
            About
          </Link>

          <Link href="/contact" style={navLink}>
            Contact
          </Link>

          <Link
            href="/cart"
            style={{
              background: "#d4af37",
              color: "#111",
              padding: "10px 22px",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Cart
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "1px solid #d4af37",
              color: "#d4af37",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "22px",
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "#111",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            gap: "18px",
          }}
        >
          <Link href="/" style={navLink}>Home</Link>
          <Link href="/products" style={navLink}>Products</Link>
          <Link href="/about" style={navLink}>About</Link>
          <Link href="/contact" style={navLink}>Contact</Link>
          <Link href="/cart" style={navLink}>Cart</Link>
          <Link href="/checkout" style={navLink}>Checkout</Link>
        </div>
      )}
    </nav>
  );
}