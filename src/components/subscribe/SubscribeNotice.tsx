"use client";

import { useSearchParams } from "next/navigation";

export function SubscribeNotice() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  if (!canceled) return null;

  return (
    <div className="max-w-2xl mx-auto mb-10 px-5 py-4 border border-border bg-bg-surface text-center">
      <p className="font-label text-[0.68rem] tracking-[0.12em] uppercase text-cream-dim">
        Checkout was canceled — no charge was made.
      </p>
    </div>
  );
}
