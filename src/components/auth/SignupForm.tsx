"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callbackUrl },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If session is immediately available, Supabase auto-confirmed the account
    if (data.session) {
      router.refresh();
      router.push(redirect);
      return;
    }

    // No session means a confirmation email was sent
    setLoading(false);
    setAwaitingConfirmation(true);
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex flex-col items-center gap-5 py-2 text-center">
        <div className="w-10 h-10 rounded-full bg-[rgba(196,154,60,0.12)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="16" height="12" rx="1" stroke="#c49a3c" strokeWidth="1.2" />
            <path d="M2 7l8 5 8-5" stroke="#c49a3c" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="font-label text-[0.7rem] tracking-[0.15em] uppercase text-amber mb-2">
            Check your inbox
          </p>
          <p className="text-[0.88rem] text-cream font-body leading-[1.7]">
            We sent a confirmation link to{" "}
            <span className="text-cream font-medium">{email}</span>.
          </p>
          <p className="text-[0.82rem] text-cream-dim font-body mt-2 leading-[1.7]">
            Click the link in the email to activate your account and sign in.
          </p>
        </div>
        <p className="text-[0.78rem] text-cream-dim font-body">
          Wrong address?{" "}
          <button
            type="button"
            onClick={() => setAwaitingConfirmation(false)}
            className="text-amber hover:opacity-80 transition-opacity underline"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="font-label text-[0.65rem] tracking-[0.18em] uppercase text-cream-dim"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input"
        />
      </div>

      {error && (
        <p className="text-[0.8rem] text-[#e07070] font-body">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber text-bg-deep font-label text-[0.75rem] font-semibold tracking-[0.18em] uppercase px-6 py-3 transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-center text-[0.8rem] text-cream-dim font-body">
        Already have an account?{" "}
        <Link
          href={`/login${redirect !== "/account" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="text-amber hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
