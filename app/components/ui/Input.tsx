"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <input
        {...props}
        className={`w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 ${className}`}
      />
    </div>
  );
}