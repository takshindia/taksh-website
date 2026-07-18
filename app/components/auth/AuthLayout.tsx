"use client";

import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-[#111111] p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-yellow-400">
            तक्ष
          </h1>

          <h2 className="mt-6 text-3xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-2 text-gray-400">
            {subtitle}
          </p>

        </div>

        {children}

      </div>
    </div>
  );
}