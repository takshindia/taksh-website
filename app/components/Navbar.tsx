"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,175,55,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "10px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src="/favicon.png"
            alt="TAKSH"
            width={120}
            height={120}
            priority
            style={{
              width: "120px",
              height: "auto",
              cursor: "pointer",
            }}
          />
        </Link>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            Home
          </Link>

          <Link
            href="/products"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            Products
          </Link>

          <Link
            href="/about"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            About
          </Link>

          <Link
            href="/contact"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}