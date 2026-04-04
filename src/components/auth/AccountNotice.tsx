"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AccountNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [notice, setNotice] = useState<"confirmed" | "subscribed" | null>(null);

  useEffect(() => {
    if (searchParams.get("confirmed") === "true") setNotice("confirmed");
    else if (searchParams.get("subscribed") === "true") setNotice("subscribed");
  }, [searchParams]);

  useEffect(() => {
    if (!notice) return;
    // Clean the URL after showing the notice
    const timer = setTimeout(() => {
      router.replace("/account", { scroll: false });
    }, 6000);
    return () => clearTimeout(timer);
  }, [notice, router]);

  if (!notice) return null;

  const messages = {
    confirmed: {
      label: "Email confirmed",
      body: "Your account is active. Welcome to Barefoot Mary.",
    },
    subscribed: {
      label: "Subscription active",
      body: "You now have access to all subscriber content.",
    },
  };

  const { label, body } = messages[notice];

  return (
    <div className="mb-8 border border-[rgba(106,170,106,0.3)] bg-[rgba(106,170,106,0.06)] px-5 py-4 flex items-start gap-3">
      <span className="text-[#6aaa6a] mt-0.5 shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="font-label text-[0.65rem] tracking-[0.15em] uppercase text-[#6aaa6a] mb-0.5">
          {label}
        </p>
        <p className="text-[0.85rem] text-cream font-body">{body}</p>
      </div>
    </div>
  );
}
