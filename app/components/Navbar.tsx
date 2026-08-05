"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [search, setSearch] = useState("");


  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/taksh-logo.png"
            alt="TAKSH"
            width={140}
            height={60}
            priority
            className="w-32 h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white hover:text-yellow-400 transition font-medium"
            >
              {item.name}
            </Link>
          ))}

          <button
  onClick={() => setSearchOpen(!searchOpen)}
  className="text-white hover:text-yellow-400 transition"
  aria-label="Search"
>
  <Search size={21} />
</button>

          <Link
            href="/wishlist"
            className="text-white hover:text-yellow-400"
          >
            <Heart size={21} />
          </Link>

          <Link
            href="/cart"
            className="text-white hover:text-yellow-400"
          >
            <ShoppingCart size={21} />
          </Link>

          <Link
            href="/profile"
            className="text-white hover:text-yellow-400"
          >
            <User size={21} />
          </Link>

          <Link
            href="/login"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-full transition"
          >
            Login
          </Link>

        </div>

{searchOpen && (
  <div className="absolute left-0 top-20 w-full bg-[#111] border-t border-yellow-500/20 shadow-xl">
    <div className="max-w-7xl mx-auto p-5">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-xl bg-[#1a1a1a] border border-yellow-500/20 px-4 py-3 text-white outline-none focus:border-yellow-500"
      />
    </div>
  </div>
)}

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-yellow-400"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#111] border-t border-yellow-500/20">

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            🔍 Search
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            ❤️ Wishlist
          </Link>

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            🛒 Cart
          </Link>

          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            👤 My Profile
          </Link>

          <Link
            href="/my-orders"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            📦 My Orders
          </Link>

          <Link
            href="/track/123"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            📍 Track Order
          </Link>

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white border-b border-gray-800 hover:bg-yellow-500 hover:text-black transition"
          >
            🔐 Login
          </Link>

          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 text-white hover:bg-yellow-500 hover:text-black transition"
          >
            ✨ Sign Up
          </Link>

        </div>
      )}
    </nav>
  );
}