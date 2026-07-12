"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">

        <Link href="/">
          <Image
            src="/taksh-logo.png"
            alt="तक्ष"
            width={140}
            height={60}
            priority
            className="w-32 md:w-36 h-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white hover:text-yellow-400 transition"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/cart"
            className="bg-yellow-500 text-black px-5 py-2 rounded-full font-bold hover:scale-105 transition"
          >
            Cart
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-yellow-400 text-3xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-yellow-500/20">

          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={closeMenu}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            Cart
          </Link>

          <Link
            href="/checkout"
            onClick={closeMenu}
            className="block px-6 py-4 text-white hover:bg-yellow-500 hover:text-black transition"
          >
            Checkout
          </Link>

        </div>
      )}
    </nav>
  );
}