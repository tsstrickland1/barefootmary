"use client";

import { useState } from "react";

interface SubscribeButtonProps {
  plan: "descender" | "patron";
  label: string;
  featured?: boolean;
}

export function SubscribeButton({ plan, label, featured = false }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`block w-full py-3 px-4 text-center font-label text-[0.68rem] font-semibold tracking-[0.15em] uppercase cursor-pointer transition-all duration-200 mt-auto disabled:opacity-60 disabled:cursor-not-allowed ${
          featured
            ? "bg-amber text-bg-deep border border-amber hover:bg-amber-light"
            : "bg-transparent text-cream-dim border border-border hover:border-amber hover:text-amber"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            <span>Redirecting…</span>
          </span>
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="font-label text-[0.6rem] tracking-[0.06em] text-[#c44c3c] text-center">
          {error}
        </p>
      )}
    </div>
  );
}
